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

    // Get user from database
    const query = `SELECT id, username, email, created_at FROM admin WHERE id = $1`;
    const result = await sequelize.query(query, [decoded.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { user: result.rows[0] },
      { status: 200 }
    );

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get user error:", error.message);
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
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}