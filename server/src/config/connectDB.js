import mongoose from "mongoose"; // Changed from import to const
const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error", error);
  }
};
export default connectDB;
