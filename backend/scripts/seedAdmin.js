// scripts/seedAdmin.js
// Script to initialize or reset default administrator account

require("dotenv").config({ path: __dirname + "/../.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const Admin = require("../models/admin");

const DEFAULT_ADMIN = {
  name: "State Legal Administrator",
  email: process.env.ADMIN_EMAIL || "hari333333om@gmail.com",
  password: process.env.ADMIN_PASSWORD || "1234",
  role: "superadmin",
  district: "Bihar State HQ",
  department: "Directorate of Victim Relief & Legal Aid",
};

async function seedAdmin() {
  console.log("⚡ [SEED ADMIN] Connecting to database...");
  await connectDB();

  try {
    const existingAdmin = await Admin.findOne({ email: DEFAULT_ADMIN.email.toLowerCase() });

    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.password, 10);

    if (existingAdmin) {
      console.log(`ℹ️ Admin account already exists: ${existingAdmin.email}. Updating password & role...`);
      existingAdmin.password = hashedPassword;
      existingAdmin.role = DEFAULT_ADMIN.role;
      existingAdmin.department = DEFAULT_ADMIN.department;
      await existingAdmin.save();
      console.log("✅ Admin account credentials updated successfully!");
    } else {
      console.log(`Creating new default admin: ${DEFAULT_ADMIN.email}...`);
      const newAdmin = await Admin.create({
        name: DEFAULT_ADMIN.name,
        email: DEFAULT_ADMIN.email.toLowerCase(),
        password: hashedPassword,
        role: DEFAULT_ADMIN.role,
        district: DEFAULT_ADMIN.district,
        department: DEFAULT_ADMIN.department,
      });
      console.log(`✅ Default Admin created with ID: ${newAdmin._id}`);
    }

    console.log("\n=======================================================");
    console.log("🔐 ADMIN CREDENTIALS INITIALIZED:");
    console.log(`   Email:    ${DEFAULT_ADMIN.email}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log(`   Role:     ${DEFAULT_ADMIN.role}`);
    console.log("=======================================================\n");
  } catch (error) {
    console.error("❌ Failed to seed admin:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 Database connection closed.");
    process.exit(0);
  }
}

seedAdmin();
