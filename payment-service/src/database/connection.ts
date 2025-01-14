import mongoose from "mongoose";
import config from "../config";

export const connectDb = async () => {
  try {
    console.info("Connecting to database..." + config.MONGO_URI);
    await mongoose.connect(config.MONGO_URI!);
    console.info("Connected to database");
  } catch (error) {
    console.error("Error connecting to database", error);
    process.exit(1);
  }
}