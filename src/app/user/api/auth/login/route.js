// import {NextResponse} from "next/server";
// import {sequelize} from "@/lib/db";
// import User from "@/models/User";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import {JWT_SECRET} from "@/lib/env.js";


// export async function POST(req) {
//   try {
//     const {email, password} = await req.json();
//     console.log({email, password})
//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json({message: "Email and password are required"}, {status: 400});
//     }

// }catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json({message: "Login failed"}, {status: 500});
//   }
//     // Here you would normally check the credentials against the database
//     // For demonstration, we'll just check against hardcoded values
// }
import { NextResponse } from "next/server";
import '@/models/index.js';
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/env.js";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

   
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // important for admin/user
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

  
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );

   
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Login failed" },
      { status: 500 }
    );
  }
}
