
import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add MONGODB_URI to your environment variables');
}

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default clientPromise;
// import mongoose from "mongoose";

// let isConnected = false;

// export const connectToDatabase = async () => {
//   if (isConnected) {
//     console.log("✅ Using existing database connection");
//     return;
//   }

//   if (!process.env.MONGODB_URI) {
//     console.error("❌ MONGODB_URI is not defined");
//     return;
//   }

//   try {
//     console.log("🔄 Establishing new database connection...");
//     const { connection } = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 5000, // Timeout after 5 sec
//       connectTimeoutMS: 10000, // Increase connection timeout
//     });

//     if (connection.readyState === 1) {
//       isConnected = true;
//       console.log("✅ Database connected successfully");
//     }
//   } catch (error) {
//     console.error("❌ Error connecting to database:", error);
//   }
// };
