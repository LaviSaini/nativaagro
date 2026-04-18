import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/lib/db";
import { normalizeProductImages } from "@/lib/product-images";

export async function GET(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "guest";

    const cart = await db.collection("carts").findOne({ sessionId });

    if (!cart) {
      return NextResponse.json({
        items: [],
        sessionId,
      });
    }

    const items = cart.items || [];
    const productIds = [...new Set(items.map((i: { productId: string }) => i.productId))].filter(
      (id: unknown): id is string => ObjectId.isValid(id as string)
    );
    const products = productIds.length
      ? await db
          .collection("products")
          .find({ _id: { $in: productIds.map((id) => new ObjectId(id)) } })
          .toArray()
      : [];

    const productMap = Object.fromEntries(
      products.map((p) => {
        const imgs = normalizeProductImages(p);
        return [
          p._id.toString(),
          {
            name: p.name,
            price: p.price,
            image: imgs[0] || "",
            packSize: typeof p.packSize === "string" ? p.packSize : "",
          },
        ];
      })
    );

    const itemsWithProduct = items.map((i: { productId: string; quantity: number }) => ({
      ...i,
      product: productMap[i.productId],
    }));

    return NextResponse.json({
      ...cart,
      _id: cart._id?.toString(),
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

export async function DELETE(request: Request) {
  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId") || "guest";

    await db.collection("carts").deleteOne({ sessionId });

    return NextResponse.json({
      success: true,
      items: [],
      sessionId,
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

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const contentType = request.headers.get("content-type") || "";
    let body: Record<string, string | number>;
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData) as Record<string, string>;
      body.quantity = parseInt(String(body.quantity || 1), 10);
    }
    const { sessionId = "guest", productId, quantity = 1 } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const carts = db.collection("carts");
    let cart = await carts.findOne({ sessionId });

    if (!cart) {
      const result = await carts.insertOne({
        sessionId,
        items: [{ productId, quantity }],
        updatedAt: new Date(),
      });
      cart = await carts.findOne({ _id: result.insertedId });
    } else {
      const existingIndex = cart.items.findIndex(
        (i: { productId: string }) => i.productId === productId
      );
      const items = [...(cart.items || [])];

      if (existingIndex >= 0) {
        items[existingIndex].quantity += quantity;
      } else {
        items.push({ productId, quantity });
      }

      await carts.updateOne(
        { sessionId },
        { $set: { items, updatedAt: new Date() } }
      );
      cart = await carts.findOne({ sessionId });
    }

    return NextResponse.json({
      ...cart,
      _id: cart?._id?.toString(),
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
