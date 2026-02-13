import dotenv from "dotenv";
import path from "path";
import bcrypt from "bcrypt";

dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

import { sequelize } from "../src/lib/db.js";
import Admin from "../src/models/Admin.js";

async function seedAdmin() {
  try {
    await sequelize.authenticate();

    const existingAdmin = await Admin.findOne({
      where: { email: "admin@platform.com" },
    });

    if (existingAdmin) {
      console.log("⚠️ Admin already exists.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({
      name: "Super Admin",
      email: "admin@platform.com",
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("✅ Super Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
}

seedAdmin();
