import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const db = await connectToDatabase();
    const contentType = request.headers.get("content-type") || "";
    const body =
      contentType.includes("application/json")
        ? await request.json()
        : Object.fromEntries(await request.formData());
    const { email, password, name } = body as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "email, password, and name are required" },
        { status: 400 }
      );
    }

    const existing = await db.collection("users").findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // TODO: Hash password with bcrypt
    const result = await db.collection("users").insertOne({
      email,
      password, // TODO: hash before storing
      name,
      role: "user",
      createdAt: new Date(),
    });

    const user = await db.collection("users").findOne({ _id: result.insertedId });

    return NextResponse.json({
      user: {
        _id: user?._id?.toString(),
        email: user?.email,
        name: user?.name,
        role: user?.role || "user",
      },
      token: "placeholder-token", // TODO: JWT
    });
  } catch {
    return NextResponse.json(
      {
        error: "Database not configured. Add MONGODB_URI to .env.local",
      },
      { status: 503 }
    );
  }
}
