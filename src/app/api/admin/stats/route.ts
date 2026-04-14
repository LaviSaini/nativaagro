import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { DEV_ADMIN_ID } from "@/lib/admin-constants";

const emptyStats = {
  products: 0,
  categories: 0,
  orders: 0,
  users: 0,
  revenue: 0,
  pendingOrders: 0,
  orderStatusBreakdown: [] as { status: string; count: number }[],
};

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  try {
    const { connectToDatabase } = await import("@/lib/db");
    const db = await connectToDatabase();

    const [productsCount, categoriesCount, ordersCount, usersCount] =
      await Promise.all([
        db.collection("products").countDocuments(),
        db.collection("categories").countDocuments(),
        db.collection("orders").countDocuments(),
        db.collection("users").countDocuments(),
      ]);

    const orders = await db.collection("orders").find({}).toArray();
    const totalRevenue = orders.reduce((sum: number, o: { total?: number } & Record<string, unknown>) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o: { status?: string } & Record<string, unknown>) =>
      ["pending", "processing", "shipped"].includes(o.status || "")
    ).length;

    const breakdownAgg = await db
      .collection("orders")
      .aggregate<{ _id: string | null; count: number }>([
        { $group: { _id: { $ifNull: ["$status", "unknown"] }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray();
    const orderStatusBreakdown = breakdownAgg.map((d) => ({
      status: d._id == null ? "unknown" : String(d._id),
      count: d.count,
    }));

    return NextResponse.json({
      products: productsCount,
      categories: categoriesCount,
      orders: ordersCount,
      users: usersCount,
      revenue: totalRevenue,
      pendingOrders,
      orderStatusBreakdown,
    });
  } catch {
    // Dev admin bypass: return empty stats when DB is unavailable
    if (auth.userId === DEV_ADMIN_ID) {
      return NextResponse.json(emptyStats);
    }
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }
}
