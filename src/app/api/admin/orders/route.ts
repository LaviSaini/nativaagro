import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

function getDateRange(period: string): { start: Date; end: Date } | null {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === "daily") {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "monthly") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth() + 1, 0);
    end.setHours(23, 59, 59, 999);
  } else if (period === "quarterly") {
    const q = Math.floor(now.getMonth() / 3) + 1;
    start.setMonth((q - 1) * 3, 1);
    start.setHours(0, 0, 0, 0);
    end.setMonth(q * 3, 0);
    end.setHours(23, 59, 59, 999);
  } else {
    return null;
  }

  return { start, end };
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const db = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "";
    const period = searchParams.get("period") || "";

    const filter: Record<string, unknown> = {};
    if (status === "active" || status === "in_transit") {
      filter.status = { $in: ["pending", "processing", "shipped"] };
    } else if (status) {
      filter.status = status;
    }

    const dateRange = getDateRange(period);
    if (dateRange) {
      filter.createdAt = { $gte: dateRange.start, $lte: dateRange.end };
    }

    const orders = await db
      .collection("orders")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      orders.map((o) => ({ ...o, _id: o._id.toString() }))
    );
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
