import { headers } from "next/headers";
import Header from "./Header";

export default async function HeaderGate() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return <Header />;
}
