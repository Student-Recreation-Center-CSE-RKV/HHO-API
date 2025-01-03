import mongoose from "mongoose";
import { Model, Document, FilterQuery } from "mongoose";
import { NotFoundError, ValidationError } from "../exceptions/CustomError";

// const ValidationError = require("../utils/errors/validation-error");
class CrudRepository<T extends Document> {

  private model: Model<T>;

  constructor(model: Model<T>){
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const result = await this.model.create(data);
      return result;
    } catch (error) {
      throw new Error("Failed in creating the document with given id");
    }
  }

  async delete(id: string): Promise<T | null> {
    console.log("Into the crudRepo");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid ID format");
    }

    try {
      const response = await this.model.findByIdAndDelete(id);
      return response;
    } catch (error) {
      throw new Error("Failed in deleting the document with given id");
    }
  }

  async get(id: string): Promise<T | null> {
    if(!mongoose.Types.ObjectId.isValid(id)){
      throw new ValidationError("Invalid ID format");
    }
    try {
      const response = await this.model.findById(id);
      return response;
    } catch (error) {
      throw new Error("Failed in getting the document with given id");
    }
  }
  async findBy(data: FilterQuery<T>): Promise<T | null>{
    try {
      console.log("data", data);
      const response = await this.model.findOne(data);
      return response;
    } catch (error) {
      throw new Error("Failed in getting the document with given data");
    }
  }

  async getAll(): Promise<T[]>  {
    console.log("Into the repo");
    try {
      console.log(this.model.find({}));
      const response = await this.model.find({}).maxTimeMS(5000);
      console.log(response);
      return response;
    } catch (error) {
      throw new Error("Failed in getting all");
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null>{
    console.log("in repo:", id, data);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ValidationError("Invalid ID format");
    }
    try {
      const response = await this.model.findByIdAndUpdate(id, data, {
        new: true,
      });
      console.log("in repo res:", response);
      return response;
    } catch (error) {
      throw new Error("Failed in updating the document with given id");
    }
  }
  // async getMacthed(search: string): Promise<T[]|null>{};
}

export default CrudRepository;