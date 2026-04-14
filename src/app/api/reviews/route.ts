import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

type DbReview = {
  _id: unknown;
  name?: string;
  rating?: number;
  text?: string;
  createdAt?: Date;
};

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limitRaw = searchParams.get("limit");
    const limit = Math.max(1, Math.min(10, Number(limitRaw || 3) || 3));

    const reviews = (await db
      .collection("reviews")
      .find({ hidden: { $ne: true } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray()) as DbReview[];

    return NextResponse.json(
      reviews.map((r) => ({
        _id: String(r._id),
        name: r.name || "Anonymous",
        rating: typeof r.rating === "number" ? r.rating : 5,
        text: r.text || "",
        createdAt: r.createdAt ? r.createdAt.toISOString() : null,
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "Database not configured. Add MONGODB_URI to .env.local" },
      { status: 503 }
    );
  }
}

