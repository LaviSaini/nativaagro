import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const db = await connectToDatabase();
    const categories = await db
      .collection("categories")
      .find({})
      .sort({ name: 1 })
      .toArray();
    return NextResponse.json(
      categories.map((c) => ({ ...c, _id: c._id.toString() }))
    );
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { name, slug, description, icon } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 }
      );
    }

    const existing = await db.collection("categories").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 }
      );
    }

    const result = await db.collection("categories").insertOne({
      name,
      slug,
      description: description || "",
      icon: icon || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const category = await db.collection("categories").findOne({ _id: result.insertedId });
    return NextResponse.json({
      ...category,
      _id: category?._id?.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
