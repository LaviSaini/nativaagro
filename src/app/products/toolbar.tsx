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
}: {
  categories: Array<{ _id: string; name: string; slug: string }>;
  activeCategory: string;
  search: string;
  sort: string;
}) {
  const pathname = usePathname();
  const params = useSearchParams();

  const qs = params ? new URLSearchParams(params.toString()) : new URLSearchParams();

  const chips = useMemo(() => {
    const base = [{ label: "Shop All", slug: "" }];
    return base.concat(
      (categories || []).slice(0, 6).map((c) => ({ label: c.name, slug: c.slug }))
    );
  }, [categories]);

  return (
    <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => {
            const active = (activeCategory || "") === (c.slug || "");
            const nextQs = buildQuery(qs, { category: c.slug || null, search: search || null });
            return (
              <Link
                key={c.slug || "all"}
                href={`${pathname}${nextQs ? `?${nextQs}` : ""}`}
                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                  active
                    ? "bg-zinc-900 text-white"
                    : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Filters
            </span>
            <span className="text-xs text-zinc-400">(coming soon)</span>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-full border border-zinc-300 px-4 py-2">
            <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">
              Sorting
            </span>
            <select
              className="bg-transparent text-sm text-zinc-900 outline-none"
              value={sort}
              onChange={(e) => {
                const next = buildQuery(qs, { sort: e.target.value || null });
                window.location.href = `${pathname}${next ? `?${next}` : ""}`;
              }}
            >
              <option value="">Default</option>
              <option value="price_asc">Price Low to High</option>
              <option value="price_desc">Price High to Low</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

