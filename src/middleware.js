
import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { validateEnv, JWT_SECRET } from "./lib/env.js";

validateEnv();

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isAdminRoute = pathname.startsWith("/admin");
  const isUserProtectedRoute =
    pathname.startsWith("/user/dashboard");

  const isUserAuthRoute =
    pathname === "/user/login" ||
    pathname === "/user/register";

  const isAdminAuthRoute =
    pathname === "/auth/login" ||
    pathname === "/auth/register";

  // No token
  if (!token) {
    if (isAdminRoute) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }

    if (isUserProtectedRoute) {
      return NextResponse.redirect(
        new URL("/user/login", request.url)
      );
    }

    return NextResponse.next();
  }

  try {
    const decoded = verify(token, JWT_SECRET);
    const role = decoded.role;

    // USER trying to access admin area
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(
        new URL("/user/login", request.url)
      );
    }

    // ADMIN trying to access user dashboard
    if (isUserProtectedRoute && role !== "user") {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    //Logged in users visiting login/register pages
    if (isAdminAuthRoute) {
      if (role === "admin") {
        return NextResponse.redirect(
          new URL("/admin", request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL("/user/dashboard", request.url)
        );
      }
    }

    if (isUserAuthRoute) {
      if (role === "user") {
        return NextResponse.redirect(
          new URL("/user/dashboard", request.url)
        );
      } else {
        return NextResponse.redirect(
          new URL("/admin", request.url)
        );
      }
    }

  } catch (err) {
    // ❌ Invalid token
    const response = NextResponse.redirect(
      new URL("/user/login", request.url)
    );
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/user/login",
    "/user/register",
    "/auth/login",
    "/auth/register",
  ],
};

export const runtime = "nodejs";
