import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

const ALLOWED_KEYS = new Set([
  "homepageFeaturedProductIds",
  "shippingMethodsJson",
  "couponsJson",
]);

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  try {
    const db = await connectToDatabase();
    const docs = await db.collection("settings").find({}).toArray();
    const settings: Record<string, string> = {};
    for (const d of docs) {
      const k = d.key as string;
      if (typeof k === "string" && ALLOWED_KEYS.has(k)) {
        settings[k] = typeof d.value === "string" ? d.value : JSON.stringify(d.value ?? "");
      }
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  try {
    const body = await request.json();
    const updates = body?.settings as Record<string, unknown> | undefined;
    if (!updates || typeof updates !== "object") {
      return NextResponse.json({ error: "settings object required" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const now = new Date();

    for (const [key, raw] of Object.entries(updates)) {
      if (!ALLOWED_KEYS.has(key)) continue;
      const value = raw == null ? "" : String(raw);
      await db.collection("settings").updateOne(
        { key },
        { $set: { key, value, updatedAt: now } },
        { upsert: true }
      );
    }

    const docs = await db.collection("settings").find({ key: { $in: [...ALLOWED_KEYS] } }).toArray();
    const settings: Record<string, string> = {};
    for (const d of docs) {
      const k = d.key as string;
      settings[k] = typeof d.value === "string" ? d.value : JSON.stringify(d.value ?? "");
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
