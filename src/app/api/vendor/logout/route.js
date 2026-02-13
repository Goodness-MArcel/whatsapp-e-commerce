import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Create response with cleared cookie
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Clear the auth token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Logout error:", error.message);
    }

    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}
