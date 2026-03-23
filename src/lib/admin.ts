import { connectToDatabase } from "./db";
import { ObjectId } from "mongodb";
import { DEV_ADMIN_ID } from "./admin-constants";

export async function verifyAdmin(request: Request): Promise<{
  ok: boolean;
  userId?: string;
  error?: string;
}> {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return { ok: false, error: "Unauthorized" };
    }
    // Dev bypass: fixed admin credentials
    if (userId === DEV_ADMIN_ID) {
      return { ok: true, userId };
    }
    if (!ObjectId.isValid(userId)) {
      return { ok: false, error: "Unauthorized" };
    }
    const db = await connectToDatabase();
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!user || user.role !== "admin") {
      return { ok: false, error: "Forbidden" };
    }
    return { ok: true, userId };
  } catch {
    return { ok: false, error: "Unauthorized" };
  }
}
