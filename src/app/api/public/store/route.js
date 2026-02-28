// app/api/public/store/route.js
import { NextResponse } from "next/server";
import { Store, Product, User } from "@/models/index.js";

export async function GET(request) {
  try {
    // Get slug from query params
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    console.log("Fetching store with slug:", slug);

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Get base URL for full store link
    const baseUrl = request.nextUrl.origin;

    // Fetch store including its user and products
    const store = await Store.findOne({
      where: { slug },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: Product,
          // attributes: ["id", "name", "price", "description" , "image"],
        },
      ],
      attributes: [
        "id",
        "storeName",
        "slug",
        "whatsappNumber",
        "storecategory",
        "country",
        "city",
        "address",
        "description",
        "logo",
      ],
    });

    console.log("Fetched store data:", store);

    if (!store) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    // Convert Sequelize instance to plain JSON
    const plainStore = store.toJSON();

    // Prepare response JSON with properly structured data
    const response = {
      id: plainStore.id,
      storeName: plainStore.storeName,
      slug: plainStore.slug,
      whatsappNumber: plainStore.whatsappNumber,
      storecategory: plainStore.storecategory,
      country: plainStore.country,
      city: plainStore.city,
      address: plainStore.address,
      description: plainStore.description,
      logo: plainStore.logo,
      user: plainStore.user,
      Products: plainStore.Products || [], // Ensure Products is always an array
      storeUrl: `${baseUrl}/${plainStore.slug}`,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching store:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}