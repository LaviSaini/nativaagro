import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({
      ...blog,
      _id: blog._id.toString(),
      publishedAt: blog.publishedAt
        ? new Date(blog.publishedAt as Date).toISOString()
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.excerpt !== undefined) updates.excerpt = String(body.excerpt).trim();
    if (body.category !== undefined) updates.category = String(body.category).trim();
    if (body.coverImage !== undefined) updates.coverImage = String(body.coverImage).trim();
    if (body.author !== undefined) updates.author = String(body.author).trim();
    if (body.content !== undefined) updates.content = String(body.content).trim();
    if (body.publishedAt !== undefined) {
      updates.publishedAt = body.publishedAt
        ? new Date(String(body.publishedAt))
        : new Date();
    }

    const db = await connectToDatabase();
    const result = await db
      .collection("blogs")
      .updateOne({ _id: new ObjectId(id) }, { $set: updates });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    const blog = await db.collection("blogs").findOne({ _id: new ObjectId(id) });
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid blog ID" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("blogs").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
