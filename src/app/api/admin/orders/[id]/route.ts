import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const db = await connectToDatabase();
    const body = await request.json();
    const { status, awb_code } = body;

    const update: Record<string, unknown> = { updatedAt: new Date() };
    const allowedStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (status && allowedStatuses.includes(status)) update.status = status;
    if (awb_code !== undefined) update.awb_code = awb_code;

    if (Object.keys(update).length <= 1) {
      return NextResponse.json(
        { error: "Provide status and/or awb_code" },
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

    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    return NextResponse.json({
      ...order,
      _id: order?._id?.toString(),
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
