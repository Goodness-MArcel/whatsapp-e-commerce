import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { validateEnv, JWT_SECRET } from "./lib/env.js";

validateEnv();

export async function proxy(request) {
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

    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(
        new URL("/user/login", request.url)
      );
    }

    if (isUserProtectedRoute && role !== "user") {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    if (isAdminAuthRoute) {
      return NextResponse.redirect(
        new URL(role === "admin" ? "/admin" : "/user/dashboard", request.url)
      );
    }

    if (isUserAuthRoute) {
      return NextResponse.redirect(
        new URL(role === "user" ? "/user/dashboard" : "/admin", request.url)
      );
    }

  } catch (err) {
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
    "/auth/:path*",
  ],
};

