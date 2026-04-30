// seedAdmin.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../domain/models/Admin.model.js";


const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@ex.com" });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash("Password123%", 10);

    // Create the admin user
    const admin = await Admin.create({
      firstname: "Admin",
      lastname: "User",
      email: "admin@ex.com",
      password_hash: hashedPassword,
      phoneNumber: "1234567890",
    });

    console.log("Admin created successfully:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
