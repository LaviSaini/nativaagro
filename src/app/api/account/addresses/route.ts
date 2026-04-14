import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

function getUserId(request: Request): string | null {
  return request.headers.get("x-user-id") || null;
}

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "x-user-id header required" }, { status: 401 });
    }
    const db = await connectToDatabase();
    const doc = await db.collection("account_addresses").findOne({ userId });
    return NextResponse.json({ addresses: doc?.addresses || [] });
  } catch {
    return NextResponse.json({ error: "Failed to load addresses" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "x-user-id header required" }, { status: 401 });
    }
    const body = await request.json();
    const { addresses } = body as { addresses: unknown[] };
    if (!Array.isArray(addresses)) {
      return NextResponse.json({ error: "addresses must be an array" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("account_addresses").updateOne(
      { userId },
      { $set: { userId, addresses, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save addresses" }, { status: 500 });
  }
}

