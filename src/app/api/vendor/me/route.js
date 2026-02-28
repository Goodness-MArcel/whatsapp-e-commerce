
import { NextResponse } from "next/server";
import { JWT_SECRET } from "@/lib/env.js";
import { verify } from "jsonwebtoken";
// import User from "@/models/User";
// import  Store from "@/models/Store";
import {User, Store} from "@/models/index.js"; // Importing both User and Store models
export async function GET(request) {
  const baseUrl = request.nextUrl.origin; 
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

    // Get vendor/user with their store using Sequelize include
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email'],
      include: [{
        model: Store,
        as: 'store', // Make sure this matches your association alias
        required: false // LEFT JOIN to get user even if no store
      }]
    });

    console.log("Fetched user with store:", user);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const store = user.store;

    if (!store) {
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
          slug: store.slug
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // Error handling remains the same
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