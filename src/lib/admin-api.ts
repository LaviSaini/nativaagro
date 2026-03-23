import { getAuthUser } from "./auth";

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
