// src/lib/sync.js
import { sequelize } from "./db.js";
import "../models/Store.js";
import "../models/User.js";
import "../models/Product.js";
import "../models/Admin.js";

export async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully.");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
}
