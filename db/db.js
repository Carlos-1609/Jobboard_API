import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI; // stored in your .env file
  const clientOptions = {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  };
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectDB;
