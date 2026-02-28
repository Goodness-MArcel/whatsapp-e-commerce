import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { Product } from "@/models";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get("name");
    const price = formData.get("price");
    const description = formData.get("description");
    const storeId = formData.get("storeId");
    const imageFile = formData.get("image");

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Convert File to buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "products" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    // Save to database
    const product = await Product.create({
      name,
      price,
      description,
      storeId,
      image: uploadResult.secure_url,
    });

    return NextResponse.json(
      { product, message: "Product added successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit"))
      : 10;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page"))
      : 1;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (storeId) {
      whereClause.storeId = storeId;
    }

    // Fetch products with pagination
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]], // Most recent first
    });

    return NextResponse.json(
      {
        products: products.rows,
        total: products.count,
        page,
        totalPages: Math.ceil(products.count / limit),
        message: "Products fetched successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    console.log("Updating product with ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }
    const product = await Product.findByPk(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const updatedData = await request.json();
    await product.update(updatedData);
    return NextResponse.json(
      { product, message: "Product updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// Optional: GET single product by ID
export async function GET_byId(request, { params }) {
  try {
    const { id } = params;

    const product = await Product.findByPk(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
