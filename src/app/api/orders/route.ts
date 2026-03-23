import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "guest";
    const status = searchParams.get("status") || "";

    const filter: Record<string, unknown> = { userId };
    if (status === "active" || status === "in_transit") {
      filter.status = { $in: ["pending", "processing", "shipped"] };
    } else if (status === "delivered") {
      filter.status = "delivered";
    }

    const orders = await db
      .collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
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

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const body = await request.json();
    const { userId = "guest", items, shippingAddress } = body;

    if (!items?.length || !shippingAddress) {
      return NextResponse.json(
        { error: "items and shippingAddress are required" },
        { status: 400 }
      );
    }

    const products = await db.collection("products").find({}).toArray();
    const productMap = Object.fromEntries(
      products.map((p) => [p._id.toString(), p])
    );

    let total = 0;
    for (const item of items) {
      const p = productMap[item.productId];
      if (p) total += (p.price || 0) * (item.quantity || 0);
    }

    const result = await db.collection("orders").insertOne({
      userId,
      items,
      total,
      status: "pending",
      shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const order = await db
      .collection("orders")
      .findOne({ _id: result.insertedId });

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
