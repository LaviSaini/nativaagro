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
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const items = order.items || [];
    const productIds = [...new Set(items.map((i: { productId: string }) => i.productId))].filter(
      (id: unknown): id is string => ObjectId.isValid(id as string)
    );
    const products = productIds.length
      ? await db
          .collection("products")
          .find({ _id: { $in: productIds.map((id: string) => new ObjectId(id)) } })
          .toArray()
      : [];
    const productMap = Object.fromEntries(
      products.map((p) => [p._id.toString(), { name: p.name, price: p.price }])
    );
    const itemsWithProduct = items.map((i: { productId: string; quantity: number }) => ({
      ...i,
      product: productMap[i.productId],
    }));

    return NextResponse.json({
      ...order,
      _id: order._id.toString(),
      items: itemsWithProduct,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const body = await request.json();
    const { status, awb_code } = body as { status?: string; awb_code?: string };

    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (status) update.status = status;
    if (awb_code !== undefined) update.awb_code = awb_code;

    if (Object.keys(update).length <= 1) {
      return NextResponse.json(
        { error: "Provide status and/or awb_code to update" },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (status && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Valid status: pending, processing, shipped, delivered, cancelled" },
        { status: 400 }
      );
    }

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      ...order,
      _id: order?._id?.toString(),
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
