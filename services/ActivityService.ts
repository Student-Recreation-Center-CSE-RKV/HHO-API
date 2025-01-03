import { ActivityDocument } from "../types/activityType";
import activityRepo from "../repository/ActivityRepo";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../exceptions/CustomError";
import { setKey, getKey, deleteKey } from "../config/redisClient";
interface ActivityResponse {
  data: ActivityDocument | null;
  message: string;
}

class ActivityService {
  async createActivity(
    activityData: Partial<ActivityDocument>
  ): Promise<ActivityDocument | null> {
    const { name, description, image } = activityData;
    if (!name || !description || !image) {
      throw new ValidationError("Ensure to enter every field");
    }
    const activity = await activityRepo.findBy({
      name: name,
      description: description,
      image: image,
    });
    if (activity) {
      throw new ConflictError("Activity already exist");
    }
    const activityNew = await activityRepo.create(activityData);
    const cacheExist = await getKey("activities");
    if (cacheExist) {
      await deleteKey("activities");
    }
    return activityNew;
  }

  async getAll(): Promise<ActivityDocument[] | null> {
    let activities = await getKey("activities");
    if (!activities) {
      try {
        const fetchedActivities = await activityRepo.getAll();
        await setKey("activities", JSON.stringify(fetchedActivities), 60);
        return fetchedActivities;
      } catch (error) {
        console.log(
          "Error while reading activities in service layer\nError:",
          error.message
        );
        return null;
      }
    } else {
      return JSON.parse(activities);
    }
  }

  async updateActivity(
    id: string,
    activityData: Partial<ActivityDocument>
  ): Promise<ActivityDocument | null> {
    const activityUpdated = await activityRepo.update(id, activityData);
    if (!activityUpdated) {
      throw new NotFoundError("Activity with given id not found");
    }
    const cacheExist = await getKey("activities");
    if (cacheExist) {
      await deleteKey("activities");
    }
    return activityUpdated;
  }

  async deleteActivity(id: string): Promise<ActivityDocument | null> {
    const result = await activityRepo.delete(id);
    if (!result) {
      throw new NotFoundError("Activity with given Id not found");
    }
    const cacheExist = await getKey("activities");
    if (cacheExist) {
      await deleteKey("activities");
    }
    return result;
  }
}

export default new ActivityService();
