import mongoose from "mongoose";
import config from "../config";

export const connectDb = async () => {
  try {
    await mongoose.connect(config.MONGO_URI!);
    console.info("Connected to database: " + config.MONGO_URI);
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}