import { NextResponse } from "next/server";
import { JWT_SECRET } from "@/lib/env.js";
import { verify } from "jsonwebtoken";
import { User, Store, Product } from "@/models/index.js";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const decoded = verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Store,
          as: "store",
          required: false,
          include: [
            {
              model: Product,
              required: false,
            },
          ],
        },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const store = user.store;

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        store: store
          ? {
              id: store.id,
              storeName: store.storeName,
              whatsappNumber: store.whatsappNumber,
              storecategory: store.storecategory,
              country: store.country,
              city: store.city,
              address: store.address,
              description: store.description,
              logo: store.logo,
              slug: store.slug,
              products: store.Products || [], // 👈 IMPORTANT
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
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
