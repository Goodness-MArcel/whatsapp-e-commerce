import { Sequelize } from "sequelize";
import { validateEnv, JWT_SECRET } from "./env.js";

// Validate environment variables on startup
validateEnv();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Required for Aiven
      },
    },
  },
);

let connectionTested = false;

// Lazy-load connection test - only runs on first use
export async function ensureConnection() {
  if (connectionTested) return;

  try {
    await sequelize.authenticate();
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Database connection established");
    }
    connectionTested = true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    throw error;
  }
}
