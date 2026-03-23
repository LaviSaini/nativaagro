import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";
import { DEV_ADMIN_ID } from "@/lib/admin-constants";

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
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "monthly";

    let groupId: object;
    if (period === "daily") {
      groupId = {
        $dateToString: {
          format: "%Y-%m-%d",
          date: "$createdAt",
          timezone: "UTC",
        },
      };
    } else if (period === "quarterly") {
      groupId = {
        $concat: [
          { $toString: { $year: "$createdAt" } },
          "-Q",
          {
            $toString: {
              $ceil: { $divide: [{ $month: "$createdAt" }, 3] },
            },
          },
        ],
      };
    } else {
      groupId = {
        $dateToString: {
          format: "%Y-%m",
          date: "$createdAt",
          timezone: "UTC",
        },
      };
    }

    const pipeline = [
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: groupId,
          orders: { $sum: 1 },
          revenue: { $sum: "$total" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const result = await db
      .collection("orders")
      .aggregate(pipeline)
      .toArray();

    const data = (result as { _id: string; orders: number; revenue: number }[]).map(
      (r) => ({
        period: r._id,
        orders: r.orders,
        revenue: r.revenue,
      })
    );

    return NextResponse.json({ data, period });
  } catch {
    if (auth.userId === DEV_ADMIN_ID) {
      const period = new URL(request.url).searchParams.get("period") || "monthly";
      return NextResponse.json({ data: [], period });
    }
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}
