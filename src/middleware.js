import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { validateEnv, JWT_SECRET } from "./lib/env.js";

// Validate environment on startup
validateEnv();

const protectedRoutes = ["/admin", "/dashboard", "/profile"];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.includes(pathname);

  // Protected route without token → redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Handle token verification
  if (token) {
    try {
      verify(token, JWT_SECRET);

      // Authenticated user trying to access login/register → redirect to admin
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      // Invalid token on protected route → clear cookie and redirect
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL("/auth/login", request.url));
        response.cookies.delete("token");
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};

export const runtime = 'nodejs';