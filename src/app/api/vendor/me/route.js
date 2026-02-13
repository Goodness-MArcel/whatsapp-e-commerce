import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { sequelize } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env.js";

export async function GET(request) {
  try {
    // Get token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET);

    // Get vendor/user from database
    const userQuery = `SELECT id, name, email, created_at FROM users WHERE id = $1`;
    const userResult = await sequelize.query(userQuery, [decoded.id]);

    if (userResult[0].length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const user = userResult[0][0];

    // Get vendor's store data
    const storeQuery = `SELECT * FROM stores WHERE "userId" = $1`;
    const storeResult = await sequelize.query(storeQuery, [decoded.id]);

    if (storeResult[0].length === 0) {
      return NextResponse.json(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          store: null,
          message: "No store associated with this vendor",
        },
        { status: 200 }
      );
    }

    const store = storeResult[0][0];

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        store: {
          id: store.id,
          storeName: store.storeName,
          whatsappNumber: store.whatsappNumber,
          storecategory: store.storecategory,
          country: store.country,
          city: store.city,
          address: store.address,
          description: store.description,
          logo: store.logo,
          slug: store.slug,
          createdAt: store.createdAt,
          updatedAt: store.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get vendor error:", error.message);
    }

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    if (error.name === "TokenExpiredError") {
      return NextResponse.json(
        { message: "Token expired" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to fetch vendor data" },
      { status: 500 }
    );
  }
}
