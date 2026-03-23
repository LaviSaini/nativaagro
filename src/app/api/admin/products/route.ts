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
    const { name, description, price, categoryId, stock, image } = body;

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
      image: image || "",
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
