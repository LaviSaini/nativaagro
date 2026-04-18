import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";
import { parseFaqs, parseHighlights } from "@/lib/product-fields";
import { parseProductImagesBody } from "@/lib/product-images";

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const db = await connectToDatabase();
    const products = await db.collection("products").find({}).toArray();
    return NextResponse.json(
      products.map((p) => ({ ...p, _id: p._id.toString() }))
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
    const images = parseProductImagesBody(body as Record<string, unknown>);

    if (!name || price == null) {
      return NextResponse.json(
        { error: "name and price are required" },
        { status: 400 }
      );
    }

    const result = await db.collection("products").insertOne({
      name,
      description: description || "",
      price: Number(price),
      categoryId: categoryId || "",
      stock: Number(stock) || 0,
      images,
      image: images[0] || "",
      packSize: typeof packSize === "string" ? packSize.trim() : "",
      promoLine: typeof promoLine === "string" ? promoLine.trim() : "",
      highlights: parseHighlights(highlights),
      faqs: parseFaqs(faqs),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const product = await db.collection("products").findOne({ _id: result.insertedId });
    return NextResponse.json({
      ...product,
      _id: product?._id?.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
