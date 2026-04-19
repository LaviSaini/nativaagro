"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function buildQuery(params: URLSearchParams, updates: Record<string, string | null>) {
  const next = new URLSearchParams(params.toString());
  for (const [k, v] of Object.entries(updates)) {
    if (v === null || v === "") next.delete(k);
    else next.set(k, v);
  }
  return next.toString();
}

export function ProductsToolbar({
  categories,
  activeCategory,
  search,
  sort,
  totalProducts = 0,
}: {
  categories: Array<{ _id: string; name: string; slug: string }>;
  activeCategory: string;
  search: string;
  sort: string;
  totalProducts?: number;
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  const qs = params ? new URLSearchParams(params.toString()) : new URLSearchParams();

  const activeCategoryName = useMemo(() => {
    if (!activeCategory) return "Shop All";
    const cat = categories.find((c) => c.slug === activeCategory);
    return cat ? cat.name : "Shop All";
  }, [activeCategory, categories]);

  return (
    <div className="w-full">
      <h1 className="mb-10 text-[40px] md:text-[56px] font-semibold text-zinc-900 tracking-tight cursor-default">
        {activeCategoryName}
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-300 mb-8 gap-4">
        <div className="text-[14.5px] font-bold text-zinc-800 cursor-default">
          {totalProducts} Products
        </div>
        
        <div className="flex flex-row items-center gap-4">
          
          {/* Filters Dropdown */}
          <div className="relative">
            <select
              className="appearance-none border border-zinc-400 rounded-[4px] pl-4 pr-10 py-2 text-[14.5px] text-zinc-600 hover:bg-zinc-50 transition outline-none cursor-pointer bg-white"
              value={activeCategory || ""}
              onChange={(e) => {
                const nextQs = buildQuery(qs, { category: e.target.value || null, search: search || null });
                window.location.href = pathname + (nextQs ? "?" + nextQs : "");
              }}
            >
              <option value="" className="cursor-pointer">Filters</option>
              {(categories || []).map((c) => (
                <option key={c.slug} value={c.slug} className="cursor-pointer">
                  {c.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          {/* Sorting Dropdown */}
          <div className="relative">
            <select
              className="appearance-none border border-zinc-400 rounded-[4px] pl-4 pr-10 py-2 text-[14.5px] text-zinc-600 hover:bg-zinc-50 transition outline-none cursor-pointer bg-white"
              value={sort}
              onChange={(e) => {
                const next = buildQuery(qs, { sort: e.target.value || null });
                window.location.href = pathname + (next ? "?" + next : "");
              }}
            >
              <option value="" className="cursor-pointer">Default Sorting</option>
              <option value="price_asc" className="cursor-pointer">Price Low to High</option>
              <option value="price_desc" className="cursor-pointer">Price High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-600">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

