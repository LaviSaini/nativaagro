import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const limitRaw = searchParams.get("limit");
    let queryLimit = 0;
    if (limitRaw != null && limitRaw !== "") {
      const n = parseInt(limitRaw, 10);
      if (Number.isFinite(n) && n > 0) {
        queryLimit = Math.min(n, 50);
      }
    }

    let cursor = db.collection("blogs").find({}).sort({ createdAt: -1 });
    if (queryLimit > 0) {
      cursor = cursor.limit(queryLimit);
    }
    const blogs = await cursor.toArray();
    return NextResponse.json(
      blogs.map((b) => ({
        ...b,
        _id: b._id.toString(),
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
