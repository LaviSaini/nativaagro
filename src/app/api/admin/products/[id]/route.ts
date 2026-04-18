import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";
import { parseFaqs, parseHighlights } from "@/lib/product-fields";
import { parseProductImagesBody } from "@/lib/product-images";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const body = await request.json();
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      packSize,
      promoLine,
      highlights,
      faqs,
    } = body;

    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (price !== undefined) update.price = Number(price);
    if (categoryId !== undefined) update.categoryId = categoryId;
    if (stock !== undefined) update.stock = Number(stock);
    if (body.images !== undefined || body.image !== undefined) {
      const images = parseProductImagesBody(body as Record<string, unknown>);
      update.images = images;
      update.image = images[0] || "";
    }
    if (packSize !== undefined) {
      update.packSize = typeof packSize === "string" ? packSize.trim() : "";
    }
    if (promoLine !== undefined) {
      update.promoLine = typeof promoLine === "string" ? promoLine.trim() : "";
    }
    if (highlights !== undefined) {
      update.highlights = parseHighlights(highlights);
    }
    if (faqs !== undefined) {
      update.faqs = parseFaqs(faqs);
    }

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = await db.collection("products").findOne({ _id: new ObjectId(id) });
    return NextResponse.json({
      ...product,
      _id: product?._id?.toString(),
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
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
