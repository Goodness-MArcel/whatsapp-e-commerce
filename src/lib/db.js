// import { Sequelize } from "sequelize";
// import { validateEnv, JWT_SECRET } from "./env.js";

// // Validate environment variables on startup
// validateEnv();

// export const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres",
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000,
//     },
//     dialectOptions: {
//       ssl: {
//         require: true,
//         rejectUnauthorized: false, // Required for Aiven
//       },
//     },
//   },
// );

// let connectionTested = false;

// // Lazy-load connection test - only runs on first use
// export async function ensureConnection() {
//   if (connectionTested) return;

//   try {
//     await sequelize.authenticate();
//     if (process.env.NODE_ENV === "development") {
//       console.log("✅ Database connection established");
//     }
//     connectionTested = true;
//   } catch (error) {
//     console.error("❌ Database connection failed:", error.message);
//     throw error;
//   }
// }


// lib/db.js or wherever your config is
import { Sequelize } from "sequelize";
import { validateEnv, JWT_SECRET } from "./env.js";

// Validate environment variables on startup
validateEnv();

// Create a connection pool that works with serverless
const createSequelizeInstance = () => {
  return new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: "postgres",
      dialectModule: require('pg'), // Explicitly require pg
      logging: false,
      pool: {
        max: 2, // Reduce for serverless
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Required for Aiven
        },
        // Add keepAlive for serverless
        keepAlive: true,
      },
    }
  );
};

// Use global to preserve connection across serverless warm starts
let sequelize;

if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), create new instance per request
  sequelize = createSequelizeInstance();
} else {
  // In development, reuse instance
  if (!global._sequelize) {
    global._sequelize = createSequelizeInstance();
  }
  sequelize = global._sequelize;
}

export { sequelize };

let connectionTested = false;

// Lazy-load connection test - only runs on first use
export async function ensureConnection() {
  if (connectionTested && process.env.NODE_ENV !== 'production') return;

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
