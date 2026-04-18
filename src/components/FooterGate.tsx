import { headers } from "next/headers";
import Footer from "./Footer";

export default async function FooterGate() {
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return <Footer />;
}
