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
    const db = await connectToDatabase();
    const blogs = await db
      .collection("blogs")
      .find({})
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    return NextResponse.json(
      blogs.map((b) => ({
        ...b,
        _id: b._id.toString(),
        publishedAt: b.publishedAt
          ? new Date(b.publishedAt as Date).toISOString()
          : null,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      category,
      coverImage,
      author,
      publishedAt,
      content,
    } = body as Record<string, string | undefined>;

    if (!title?.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const now = new Date();
    const doc = {
      title: title.trim(),
      excerpt: (excerpt || "").trim(),
      category: (category || "General").trim(),
      coverImage: (coverImage || "").trim(),
      author: (author || "Nativa Agro").trim(),
      publishedAt: publishedAt ? new Date(publishedAt) : now,
      content: (content || "").trim(),
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("blogs").insertOne(doc);
    const blog = await db.collection("blogs").findOne({ _id: result.insertedId });
    return NextResponse.json({
      ...blog,
      _id: blog?._id?.toString(),
      publishedAt: blog?.publishedAt
        ? new Date(blog.publishedAt as Date).toISOString()
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
