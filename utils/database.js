import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log("✅ Using existing database connection");
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined");
    return;
  }

  try {
    console.log("🔄 Establishing new database connection...");
    const { connection } = await mongoose.connect(process.env.MONGODB_URI);

    if (connection.readyState === 1) {
      isConnected = true;
      console.log("✅ Database connected successfully");
    }
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
  }
};
