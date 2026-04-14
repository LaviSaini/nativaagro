import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Math.min(100, Number(searchParams.get("limit") || 50) || 50));
    const skip = Math.max(0, Number(searchParams.get("skip") || 0) || 0);

    const db = await connectToDatabase();
    const [items, total] = await Promise.all([
      db
        .collection("reviews")
        .find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      db.collection("reviews").countDocuments({}),
    ]);

    return NextResponse.json({
      total,
      items: items.map((r) => ({
        _id: r._id.toString(),
        name: r.name || "Anonymous",
        rating: typeof r.rating === "number" ? r.rating : 5,
        text: r.text || "",
        hidden: Boolean(r.hidden),
        createdAt: r.createdAt ? new Date(r.createdAt as Date).toISOString() : null,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
