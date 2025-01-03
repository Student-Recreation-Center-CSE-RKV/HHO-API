import mongoose from "mongoose";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../exceptions/CustomError";
import offUserModel from "../models/off_users";
import OffUserRepo from "../repository/OffUserRepo";
import { OffUserDocument } from "../types/offUserType";
import jwt, { Jwt } from "jsonwebtoken";
import { setKey, getKey, deleteKey } from "../config/redisClient";
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

interface IPayload {
  user: {
    id: string;
    name: string;
    role: string;
  };
}

class OffUserService {
  async login(userData: Partial<OffUserDocument>): Promise<String> {
    const { email, password } = userData;
    console.log(userData);
    if (!email || !password) {
      throw new ValidationError("Ensure to enter every field");
    }

    const userExist = (await offUserModel.findOne({
      email,
    })) as OffUserDocument;
    console.log(userExist);
    if (!userExist) {
      throw new NotFoundError("User not found, Enter valid credentials");
    }

    if (password !== userExist.password) {
      throw new ValidationError("Invalid credentials, Re-enter");
    }
    const payload: IPayload = {
      user: {
        id: userExist._id.toString(),
        name: userExist.name,
        role: userExist.role,
      },
    };

    console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);
    if (!JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY is not defined in environment variables");
    }

    // Generate JWT token synchronously
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: "100d" });
    return token;
  }

  async getUserData(id: string): Promise<OffUserDocument> {
    try {
      console.log(id + "hello");
      return await OffUserRepo.get(id);
    } catch (error) {
      console.error("Getting data error :", error);
      throw new Error("Failed in getting user data"); // Pass the error to the controller to handle
    }
  }

  async getAll(): Promise<OffUserDocument[] | null> {
    let users = await getKey("offUsers");
    if (!users) {
      try {
        const fetchedUsers = await OffUserRepo.getAll();
        await setKey("offUsers", JSON.stringify(fetchedUsers), 60);
        return fetchedUsers;
      } catch (error) {
        console.error("Getting data error :", error);
        throw new Error("Failed in getting users data");
      }
    } else {
      return JSON.parse(users);
    }
  }

  async updateById(
    id: string,
    offUserData: Partial<OffUserDocument>
  ): Promise<OffUserDocument | null> {
    const response = await OffUserRepo.update(id, offUserData);
    if (!response) {
      throw new NotFoundError("Transaction with given Id not found");
    }
    const cacheExist = await getKey("offUsers");
    if (cacheExist) {
      await deleteKey("offUsers");
    }
    return response;
  }

  async deleteById(id: string): Promise<OffUserDocument | null> {
    const response = await OffUserRepo.delete(id);
    if (!response) {
      throw new NotFoundError("Transaction with given Id not found");
    }
    const cacheExist = await getKey("offUsers");
    if (cacheExist) {
      await deleteKey("offUsers");
    }
    return response;
  }

  async addUser(
    offUSerData: Partial<OffUserDocument>
  ): Promise<OffUserDocument | null> {
    const { email } = offUSerData;
    const userExist = await OffUserRepo.findBy({ email: email });
    if (userExist) {
      throw new ConflictError("User with given mail already exist");
    }
    const response = await OffUserRepo.create(offUSerData);
    const cacheExist = await getKey("offUsers");
    if (cacheExist) {
      await deleteKey("offUsers");
    }
    return response;
  }
}

export default new OffUserService();
