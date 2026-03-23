import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();
    return NextResponse.json(
      categories.map((c) => ({
        ...c,
        _id: c._id.toString(),
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
