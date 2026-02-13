// Environment variable validator
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
});

const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
  "DB_PORT",
  "JWT_SECRET",
];

export function validateEnv() {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    const isProd = process.env.NODE_ENV === "production";
    const message = `Missing required environment variables: ${missing.join(", ")}`;

    if (isProd) {
      throw new Error(message);
    } else {
      console.warn(`⚠️ ${message}`);
    }
  }
}

export const JWT_SECRET = process.env.JWT_SECRET;
