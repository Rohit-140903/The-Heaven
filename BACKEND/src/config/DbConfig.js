const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://shawadharsh:${process.env.DATABASE_SECRET}-commerce@cluster0.si5qwdm.mongodb.net/e-commerce`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
