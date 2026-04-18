"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { clearAuthToken, getAuthUser, type AuthUser } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";
import Logo from "../../public/home/logo.png"

const navLinks: Array<{ href: string; label: string }> = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "Our Story" },
  { href: "/blogs", label: "Blog" },
];

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 3C8 6 5 10 5 14c0 3.5 2.5 6 6 6 1.5 0 3-.4 4.2-1.2C19 16.5 20 12 19 8c-1-3-4-5-7-5z"
        fill="#4E5F57"
      />
      <path
        d="M12 8c2 1.5 3.5 4 3.8 6.5"
        stroke="#697563"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setUser(getAuthUser());
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "ecomapp_token" || e.key === "ecomapp_user") {
        setUser(getAuthUser());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function logout() {
    clearAuthToken();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--accent)]/25 bg-[color:var(--surface)]/95 backdrop-blur-md">
      <div className="relative mx-auto flex h-[72px] max-w-[1240px] items-center px-4 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-[color:var(--ink)]">
          <Image src={Logo} alt="Nativa Agro" className="object-contain" />
        </Link>

        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 md:flex"
          aria-label="Main"
        >
          {navLinks.map((l) => {
            const active = pathname === l.href || (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`text-[15px] font-medium transition ${active ? "text-[color:var(--ink)]" : "text-[#201914]/80 hover:text-[color:var(--ink)]"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto hidden items-center gap-5 md:flex">
          <Link
            href="/search"
            className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--ink)] transition hover:bg-white/70"
            aria-label="Search"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href={user ? "/account" : "/auth/login"}
            className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--ink)] transition hover:bg-white/70"
            aria-label={user ? "My account" : "Sign in"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="9" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M6 20c0-4 3.5-6 6-6s6 2 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </Link>
          <Link
            href="/cart"
            className="grid h-10 w-10 place-items-center rounded-full text-[color:var(--ink)] transition hover:bg-white/70"
            aria-label="Cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6 6h15l-1.5 9H7.5L6 6zm0 0L5 3H2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
          </Link>
          {user ? (
            <button
              type="button"
              onClick={logout}
              className="text-sm font-medium text-[color:var(--text)] hover:text-[color:var(--ink)]"
            >
              Log out
            </button>
          ) : null}
          <ButtonLink href="/products" className="px-7 py-2.5 text-[15px]">
            Buy Now
          </ButtonLink>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden" ref={mobileRef}>
          <ButtonLink href="/products" className="px-4 py-2 text-sm">
            Buy Now
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMobileOpen((s) => !s)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--ink)]/15 bg-white text-[color:var(--ink)]"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {mobileOpen ? (
            <div className="absolute right-4 top-full z-50 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-3 shadow-xl">
              <div className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-[color:var(--surface)]"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/search"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-[color:var(--surface)]"
                >
                  Search
                </Link>
                <Link
                  href="/cart"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-[color:var(--surface)]"
                >
                  Cart
                </Link>
                <Link
                  href={user ? "/account" : "/auth/login"}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-[color:var(--surface)]"
                >
                  {user ? "My account" : "Sign in"}
                </Link>
                {user ? (
                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-zinc-800 hover:bg-[color:var(--surface)]"
                  >
                    Log out
                  </button>
                ) : null}
                <Link
                  href="/contact"
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-800 hover:bg-[color:var(--surface)]"
                >
                  Contact
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
