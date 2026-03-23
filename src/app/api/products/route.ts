import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

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
        filter.categoryId = cat._id.toString();
      }
    }
    if (filter.$or && filter.categoryId) {
      filter.$and = [{ $or: filter.$or }, { categoryId: filter.categoryId }];
      delete filter.$or;
      delete filter.categoryId;
    } else if (!filter.$or) {
      delete filter.$or;
    }

    const products = await db.collection("products").find(filter).toArray();
    return NextResponse.json(
      products.map((p) => ({
        ...p,
        _id: p._id.toString(),
      }))
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
