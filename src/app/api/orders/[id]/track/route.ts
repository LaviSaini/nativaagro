import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";
import { trackShipment } from "@/lib/shiprocket";

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

    const awbCode = order.awb_code || order.trackingNumber;

    if (!awbCode) {
      return NextResponse.json({
        orderId: order._id.toString(),
        status: order.status,
        hasTracking: false,
        message:
          "Order not yet shipped. Live tracking will be available once the shipment is dispatched.",
      });
    }

    const trackingData = await trackShipment(awbCode);

    return NextResponse.json({
      orderId: order._id.toString(),
      awbCode,
      hasTracking: true,
      ...trackingData,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tracking failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
