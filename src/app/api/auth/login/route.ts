import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import {
  DEV_ADMIN_EMAIL,
  DEV_ADMIN_PASSWORD,
  DEV_ADMIN_ID,
} from "@/lib/admin-constants";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const body =
      contentType.includes("application/json")
        ? await request.json()
        : Object.fromEntries(await request.formData());
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "email and password are required" },
        { status: 400 }
      );
    }

    // Dev bypass: fixed admin credentials
    if (email === DEV_ADMIN_EMAIL && password === DEV_ADMIN_PASSWORD) {
      return NextResponse.json({
        user: {
          _id: DEV_ADMIN_ID,
          email: DEV_ADMIN_EMAIL,
          name: "Admin",
          role: "admin",
        },
        token: "dev-admin-token",
      });
    }

    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash || "");
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    if (user.disabled) {
      return NextResponse.json(
        { error: "This account has been disabled" },
        { status: 403 }
      );
    }
    return NextResponse.json({
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      token: `user:${user._id.toString()}`,
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
