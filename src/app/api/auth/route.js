import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { sequelize } from "@/lib/db";
import { JWT_SECRET } from "@/lib/env.js";


export async function POST(req) {
  const formData = await req.json();
  const { username, email, password } = formData;
  try {
 
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (password.length < 9) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 },
      );
    }
    // Check if user already exists
    const checkQuery = `SELECT id FROM admin WHERE email = $1 OR username = $2`;
    const existingUser = await sequelize.query(checkQuery, {email , username});

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { message: "User with this email or username already exists." },
        { status: 409 },
      );
    }

    let salt = bcrypt.genSaltSync(10);
    let hashedPassword = bcrypt.hashSync(password, salt);
    const query = `INSERT INTO admin (username, email, password, created_at, updated_at) 
            VALUES ($1, $2, $3, NOW(), NOW()) 
            RETURNING id, username, email, created_at`;
    const values = [username, email, hashedPassword];

    const result = await sequelize.query(query, values);

    const response = NextResponse.json(
      {
        message: "User registered successfully.",
        admin: result.rows[0],
      },
      { status: 201 }
    );

    // Don't cache registration responses
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");

    return response;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("User registration error:", error.message);
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
