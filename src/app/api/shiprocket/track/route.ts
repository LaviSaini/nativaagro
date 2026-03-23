import { NextResponse } from "next/server";
import { trackShipment } from "@/lib/shiprocket";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const awb = searchParams.get("awb");

  if (!awb?.trim()) {
    return NextResponse.json(
      { error: "awb (tracking number) is required" },
      { status: 400 }
    );
  }

  try {
    const data = await trackShipment(awb.trim());
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tracking failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
