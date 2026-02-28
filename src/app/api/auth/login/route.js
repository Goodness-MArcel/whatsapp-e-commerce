
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Admin from "@/models/Admin";
import { JWT_SECRET } from "@/lib/env.js";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // -------------------------
    // Validation
    // -------------------------
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // -------------------------
    // Find Admin
    // -------------------------
    const admin = await Admin.findOne({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // -------------------------
    // Compare Password
    // -------------------------
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // -------------------------
    // Create JWT
    // -------------------------
    const token = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // -------------------------
    // Create Response
    // -------------------------
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    // -------------------------
    // Set Cookie
    // -------------------------
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Don't cache authentication responses
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

    return response;

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Admin login error:", error.message);
    }

    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login.",
      },
      { status: 500 }
    );
  }
}
