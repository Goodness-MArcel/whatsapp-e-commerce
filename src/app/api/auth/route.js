import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { Admin } from "@/models";
import { JWT_SECRET } from "@/lib/env.js";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    // ✅ Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // ✅ Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // ✅ Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // ✅ Check if admin already exists
    const existingAdmin = await Admin.findOne({
      where: {
        [Op.or]: [
          { email },
          { name: username }
        ]
      }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "User with this email or username already exists." },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create admin
    const newAdmin = await Admin.create({
      name: username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    // ✅ Generate JWT
    const token = jwt.sign(
      {
        id: newAdmin.id,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Remove password from response
    const { password: _, ...adminData } = newAdmin.toJSON();

    const response = NextResponse.json(
      {
        message: "Admin registered successfully.",
        admin: adminData,
      },
      { status: 201 }
    );

    // ✅ Set token in HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // ✅ Prevent caching
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );

    return response;

  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Admin registration error:", error);
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
