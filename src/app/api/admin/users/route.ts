import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin";
import { connectToDatabase } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") || "").trim();
    const db = await connectToDatabase();
    const filter =
      search.length > 0
        ? {
            $or: [
              { email: { $regex: search, $options: "i" } },
              { name: { $regex: search, $options: "i" } },
            ],
          }
        : {};

    const users = await db
      .collection("users")
      .find(filter, {
        projection: {
          passwordHash: 0,
        },
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json(
      users.map((u) => ({
        _id: u._id.toString(),
        email: u.email,
        name: u.name,
        role: u.role || "user",
        disabled: Boolean(u.disabled),
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      }))
    );
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
