"use client";

import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => (r.ok ? r.json() : []))
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const currentCategory = searchParams?.get("category") || "";
  const isProductsPage = pathname === "/products";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/search");
    }
  }

  const isHome = pathname === "/";

  function isCategoryActive(cat: { slug: string }) {
    if (isHome && !cat.slug) return true;
    if (isProductsPage && currentCategory === cat.slug) return true;
    return false;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white shadow-sm">
      {/* Top row: Search + Actions */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="shrink-0 text-xl font-bold text-blue-600">
          EcomApp
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex flex-1 max-w-xl"
        >
          <div className="relative flex w-full items-center rounded-lg border border-zinc-300 bg-zinc-50 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <svg
              className="ml-3 h-5 w-5 text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for Products, Brands and More"
              className="w-full border-0 bg-transparent py-2.5 pl-2 pr-4 text-zinc-900 placeholder-zinc-500 focus:outline-none focus:ring-0"
            />
          </div>
        </form>

        <div className="flex shrink-0 items-center gap-6">
          <Link
            href="/auth/login"
            className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-blue-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Login
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-medium text-zinc-700 hover:text-blue-600"
          >
            Sign up
          </Link>

          <div className="relative" ref={moreRef}>
            <button
              type="button"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-blue-600"
            >
              More
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
                <Link
                  href="/track-order"
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setMoreOpen(false)}
                >
                  Track Order
                </Link>
                <Link
                  href="/account/orders/in-transit"
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setMoreOpen(false)}
                >
                  Orders in Transit
                </Link>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setMoreOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/blogs"
                  className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50"
                  onClick={() => setMoreOpen(false)}
                >
                  Blog
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/cart"
            className="flex items-center gap-1 text-sm font-medium text-zinc-700 hover:text-blue-600"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart
          </Link>
        </div>
      </div>

      {/* Category row */}
      <div className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-2">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            <Link
              href="/products"
              className={`flex shrink-0 flex-col items-center gap-1 rounded-lg px-4 py-2 transition ${
                isCategoryActive({ slug: "" })
                  ? "bg-blue-50 text-blue-600"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <span className="text-2xl">🎁</span>
              <span className="text-xs font-medium whitespace-nowrap">All</span>
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/products?category=${cat.slug}`}
                className={`flex shrink-0 flex-col items-center gap-1 rounded-lg px-4 py-2 transition ${
                  isCategoryActive(cat)
                    ? "bg-blue-50 text-blue-600"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <span className="text-2xl">{cat.icon || "📦"}</span>
                <span className="text-xs font-medium whitespace-nowrap">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
