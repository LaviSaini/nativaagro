import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const blog = await db
      .collection("blogs")
      .findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...blog,
      _id: blog._id.toString(),
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
