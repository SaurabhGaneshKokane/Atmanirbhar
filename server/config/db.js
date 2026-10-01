import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/atmanirbhar';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // In development or when MongoDB is not running locally, log warning rather than hard aborting if offline
    console.warn(`⚠️ Running with mock fallback capability. Ensure MongoDB or MongoDB Atlas URI is active.`);
  }
};

export default connectDB;
