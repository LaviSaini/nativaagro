import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { normalizeProductImages } from "@/lib/product-images";

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const limitRaw = searchParams.get("limit");
    let queryLimit = 0;
    if (limitRaw != null && limitRaw !== "") {
      const n = parseInt(limitRaw, 10);
      if (Number.isFinite(n) && n > 0) {
        queryLimit = Math.min(n, 100);
      }
    }

    const filter: Record<string, unknown> = {};
    if (search.trim()) {
      filter.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }
    if (category.trim()) {
      const cat = await db.collection("categories").findOne({ slug: category.trim() });
      if (cat) {
        const idStr = cat._id.toString();
        const catMatch = {
          $or: [{ categoryId: idStr }, { categoryId: cat._id }],
        };
        if (filter.$or) {
          filter.$and = [{ $or: filter.$or as unknown[] }, catMatch];
          delete filter.$or;
        } else {
          Object.assign(filter, catMatch);
        }
      }
    } else if (!filter.$or) {
      delete filter.$or;
    }

    let cursor = db.collection("products").find(filter).sort({ createdAt: -1 });
    if (queryLimit > 0) {
      cursor = cursor.limit(queryLimit);
    }
    const products = await cursor.toArray();
    return NextResponse.json(
      products.map((p) => {
        const images = normalizeProductImages(p);
        return {
          ...p,
          _id: p._id.toString(),
          images,
          image: images[0] || "",
        };
      })
    );
  } catch {
    return NextResponse.json(
      {
        error: "Database not configured. Add MONGODB_URI to .env.local",
      },
      { status: 503 }
    );
  }
}
