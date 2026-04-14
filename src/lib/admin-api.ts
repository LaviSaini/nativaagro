import { getAuthUser } from "./auth";

export type ImageUploadFolder = "products" | "blogs" | "categories" | "banners" | "other";

/** Upload image to `public/{folder}/` via admin API. Do not set JSON Content-Type. */
export async function adminUploadImage(
  file: File,
  folder: ImageUploadFolder
): Promise<{ url: string }> {
  const user = getAuthUser();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const headers: Record<string, string> = {};
  if (user?._id) headers["X-User-Id"] = user._id;
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers,
    body: fd,
  });
  const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok) {
    throw new Error(data.error || "Upload failed");
  }
  if (!data.url) throw new Error("Upload failed: no URL returned");
  return { url: data.url };
}

export function getAdminHeaders(): Record<string, string> {
  const user = getAuthUser();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (user?._id) {
    headers["X-User-Id"] = user._id;
  }
  return headers;
}

export async function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = {
    ...getAdminHeaders(),
    ...(options.headers as Record<string, string>),
  };
  return fetch(url, { ...options, headers });
}
