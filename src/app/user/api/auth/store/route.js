


import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { sequelize } from "@/lib/db";
import Store from "@/models/Store";

// import User from "@/models/User";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data;

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();
      data = {};
      for (const [key, value] of form.entries()) {
        if (typeof value === "string") data[key] = value;
        else data[key] = value; // File object
      }
      // Upload file to Cloudinary (if provided)
      if (data.logo && typeof data.logo !== "string") {
        const file = data.logo;
        const buffer = Buffer.from(await file.arrayBuffer());

        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ folder: "stores" }, (err, result) => {
            if (err) return reject(err);
            resolve(result);
          });
          stream.end(buffer);
        });

        data.logo = uploadResult.secure_url;
      }
    } else {
      data = await req.json();
    }
    // generate a slug from storeName
    const baseSlug = (data.storeName || "store").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36).slice(-6)}`;

    // Now save store in database
    const store = await Store.create({
      logo: data.logo || null,
      storeName: data.storeName,
      userId: data.userId,
      storecategory: data.storeCategory,
      whatsappNumber: data.whatsappNumber,
      country: data.country,
      city: data.city,
      address: data.address,
      description: data.description,
      slug
    });

    return NextResponse.json({ ok: true, storeId: store.id });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
