import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { verifyAdmin } from "@/lib/admin";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = ["products", "blogs", "categories", "banners", "other"] as const;
type Folder = (typeof ALLOWED_FOLDERS)[number];

const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["image/svg+xml", ".svg"],
]);

const MAX_BYTES = 8 * 1024 * 1024;

function safeBasename(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._-]/g, "_");
  return base.slice(0, 120) || "upload";
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === "Forbidden" ? 403 : 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderRaw = String(formData.get("folder") || "other");

    if (!(ALLOWED_FOLDERS as readonly string[]).includes(folderRaw)) {
      return NextResponse.json(
        { error: `folder must be one of: ${ALLOWED_FOLDERS.join(", ")}` },
        { status: 400 }
      );
    }
    const folder = folderRaw as Folder;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 8MB)" }, { status: 400 });
    }

    const mime = file.type || "application/octet-stream";
    const ext = ALLOWED_TYPES.get(mime);
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, GIF, and SVG images are allowed" },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const stamp = Date.now();
    const base = safeBasename(file.name).replace(/\.[^.]+$/, "");
    const filename = `${stamp}-${base}${ext}`;

    const publicDir = path.join(process.cwd(), "public", folder);
    await mkdir(publicDir, { recursive: true });
    const absPath = path.join(publicDir, filename);
    await writeFile(absPath, buf);

    const url = `/${folder}/${filename}`;
    return NextResponse.json({ url, folder, filename });
  } catch (e) {
    console.error("admin upload", e);
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 });
  }
}
