import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectToDatabase();
    const { id: productId } = await params;
    const body = await request.json();
    const { sessionId = "guest", quantity } = body;

    if (quantity === undefined || quantity < 0) {
      return NextResponse.json(
        { error: "quantity must be a non-negative number" },
        { status: 400 }
      );
    }

    const carts = db.collection("carts");
    const cart = await carts.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const items = (cart.items || []).map((i: { productId: string; quantity: number }) =>
      i.productId === productId ? { ...i, quantity } : i
    ).filter((i: { quantity: number }) => i.quantity > 0);

    await carts.updateOne(
      { sessionId },
      { $set: { items, updatedAt: new Date() } }
    );

    const updated = await carts.findOne({ sessionId });
    return NextResponse.json({
      ...updated,
      _id: updated?._id?.toString(),
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const db = await connectToDatabase();
    const { id: productId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "guest";

    const carts = db.collection("carts");
    const cart = await carts.findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const items = (cart.items || []).filter(
      (i: { productId: string }) => i.productId !== productId
    );

    await carts.updateOne(
      { sessionId },
      { $set: { items, updatedAt: new Date() } }
    );

    const updated = await carts.findOne({ sessionId });
    return NextResponse.json({
      ...updated,
      _id: updated?._id?.toString(),
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
