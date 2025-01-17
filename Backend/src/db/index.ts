import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDb = async (): Promise<boolean> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );

    return true;
  } catch (error) {
    console.log("MONGODB connection failed ", error);
    return false;
  }
};

export default connectDb;
