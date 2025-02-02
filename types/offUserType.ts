import { Document } from "mongoose";

export interface OffUserDocument extends Document{
    name: string;
    email: string;
    password: string;
    role: string;
    image:string,
    ID:string,
    linkedin:string,
    mobile:string
  }