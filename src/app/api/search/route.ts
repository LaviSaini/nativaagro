import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").trim();

    if (!q) {
      return NextResponse.json({
        products: [],
        categories: [],
        blogs: [],
      });
    }

    const regex = { $regex: escapeRegex(q), $options: "i" };

    const [products, categories, blogs] = await Promise.all([
      db
        .collection("products")
        .find({
          $or: [
            { name: regex },
            { description: regex },
          ],
        })
        .limit(20)
        .toArray(),
      db
        .collection("categories")
        .find({
          $or: [
            { name: regex },
            { slug: regex },
          ],
        })
        .limit(10)
        .toArray(),
      db
        .collection("blogs")
        .find({
          $or: [
            { title: regex },
            { excerpt: regex },
            { content: regex },
          ],
        })
        .limit(10)
        .toArray(),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        ...p,
        _id: p._id.toString(),
      })),
      categories: categories.map((c) => ({
        ...c,
        _id: c._id.toString(),
      })),
      blogs: blogs.map((b) => ({
        ...b,
        _id: b._id.toString(),
      })),
    });
  } catch {
    return NextResponse.json(
      {
        error: "Database not configured. Add MONGODB_URI to .env.local",
      },
      { status: 503 }
    );
  }
}
