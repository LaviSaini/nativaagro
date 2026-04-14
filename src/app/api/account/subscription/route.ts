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
    const sub = await db.collection("subscriptions").findOne({ userId });
    return NextResponse.json({
      subscription: sub
        ? {
            status: sub.status,
            nextChargeDate: sub.nextChargeDate,
            amount: sub.amount,
            endsOn: sub.endsOn,
          }
        : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to load subscription" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "x-user-id header required" }, { status: 401 });
    }
    const body = await request.json();
    const { subscription } = body as { subscription: Record<string, unknown> };
    if (!subscription || typeof subscription !== "object") {
      return NextResponse.json({ error: "subscription is required" }, { status: 400 });
    }
    const db = await connectToDatabase();
    await db.collection("subscriptions").updateOne(
      { userId },
      { $set: { userId, ...subscription, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
  }
}

