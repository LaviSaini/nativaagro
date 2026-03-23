"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/admin"
      ? pathname === "/admin"
      : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`rounded-lg px-4 py-2 text-sm font-medium ${
        isActive ? "bg-zinc-100 text-zinc-900" : "text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {children}
    </Link>
  );
}
