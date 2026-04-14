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
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role || "user",
      phone: user.phone || "",
    });
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = getUserId(request);
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "x-user-id header required" }, { status: 401 });
    }
    const body = await request.json();
    const { name, phone } = body as { name?: string; phone?: string };
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof name === "string") update.name = name;
    if (typeof phone === "string") update.phone = phone;
    await (await connectToDatabase())
      .collection("users")
      .updateOne({ _id: new ObjectId(userId) }, { $set: update });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

