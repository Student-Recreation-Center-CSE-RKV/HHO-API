import { NotFoundError, ValidationError } from "../exceptions/CustomError";
import testimonialRepository from "../repository/testimonialRepo";
import { TestimonialDocument } from "../types/testimonialType";
import { setKey, getKey, deleteKey } from "../config/redisClient";

class TestimonialService {
  async createTestimonial(
    testimonialData: Partial<TestimonialDocument>
  ): Promise<TestimonialDocument | null> {
    const { name, message, rating, discipline } = testimonialData;
    if (!name || !message || !rating || !discipline) {
      throw new ValidationError("Insufficinet paramters");
    }
    const cacheExist = await getKey("testimonials");
    if (cacheExist) {
      await deleteKey("testimonials");
    }
    return await testimonialRepository.create(testimonialData);
  }

  async deleteTestimonial(id: string): Promise<TestimonialDocument | null> {
    const response = await testimonialRepository.delete(id);
    if (!response) {
      throw new NotFoundError("Transaction with given Id not found");
    }
    const cacheExist = await getKey("testimonials");
    if (cacheExist) {
      await deleteKey("testimonials");
    }
    return response;
  }

  async updateTestimonial(
    id: string,
    testimonialData: Partial<TestimonialDocument>
  ): Promise<TestimonialDocument | null> {
    const response = await testimonialRepository.update(id, testimonialData);
    if (!response) {
      throw new NotFoundError("Transaction with given Id not found");
    }
    const cacheExist = await getKey("testimonials");
    if (cacheExist) {
      await deleteKey("testimonials");
    }
    return response;
  }

  async getAllTestimonials(): Promise<TestimonialDocument[] | null> {
    console.log("Fetching all testimonials in service");
    try {
      let testimonials = await getKey("testimonials");
      if (!testimonials) {
        console.log("Miss on redis");
        const fetchedTestimonials = await testimonialRepository.getAll();
        await setKey(
          "testimonials",
          JSON.stringify(fetchedTestimonials),
          5 * 60
        );
        return fetchedTestimonials;
      } else {
        console.log("Hit on redis");
        return JSON.parse(testimonials);
      }
    } catch (err) {
      console.error("Error getting all testimonials:", err);
      throw new Error("Failed in getting all testimonials");
    }
  }

  async getMatchedTestimonials(
    searchTerm: string
  ): Promise<TestimonialDocument[] | null> {
    console.log("Searching testimonials in service");
    try {
      return await testimonialRepository.getMatched(searchTerm);
    } catch (err) {
      console.error("Error in getting matched testimonials:", err);
      throw new Error("Failed in getting matched testimonials");
    }
  }
}

export default new TestimonialService();
