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
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { role, disabled } = body as { role?: string; disabled?: boolean };

    if (role === undefined && disabled === undefined) {
      return NextResponse.json(
        { error: "Provide role and/or disabled" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (role !== undefined) {
      if (role !== "user" && role !== "admin") {
        return NextResponse.json({ error: "role must be user or admin" }, { status: 400 });
      }
      updates.role = role;
    }
    if (disabled !== undefined) {
      updates.disabled = Boolean(disabled);
    }

    const db = await connectToDatabase();
    const result = await db.collection("users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await db.collection("users").findOne(
      { _id: new ObjectId(id) },
      { projection: { passwordHash: 0 } }
    );
    return NextResponse.json({
      _id: user?._id?.toString(),
      email: user?.email,
      name: user?.name,
      role: user?.role || "user",
      disabled: Boolean(user?.disabled),
    });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  const { id } = await params;
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  if (auth.userId === id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
  }

  try {
    const db = await connectToDatabase();
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 503 });
  }
}
