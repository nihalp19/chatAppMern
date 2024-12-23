import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_CONNECT_URI);
    
    await mongoose.connect(process.env.MONGODB_CONNECT_URI)
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

export default connectDB;
