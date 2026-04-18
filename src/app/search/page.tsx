import Link from "next/link";
import { headers } from "next/headers";

async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto =
      h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

async function getSearchResults(q: string) {
  const base = await getRequestOrigin();
  try {
    const res = await fetch(
      `${base}/api/search?q=${encodeURIComponent(q)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { products: [], categories: [], blogs: [] };
    return res.json();
  } catch {
    return { products: [], categories: [], blogs: [] };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const results = query
    ? await getSearchResults(query)
    : { products: [], categories: [], blogs: [] };

  const { products, categories, blogs } = results;
  const hasResults =
    products.length > 0 || categories.length > 0 || blogs.length > 0;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 text-3xl font-bold text-zinc-900">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>

        <form
          action="/search"
          method="get"
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          role="search"
        >
          <label htmlFor="global-search-q" className="sr-only">
            Search query
          </label>
          <input
            id="global-search-q"
            key={query || "empty"}
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search products, categories, and blog posts…"
            className="min-h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-zinc-900 shadow-sm outline-none ring-zinc-400 placeholder:text-zinc-400 focus:border-zinc-300 focus:ring-2"
            autoComplete="off"
            enterKeyHint="search"
          />
          <button
            type="submit"
            className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 px-6 font-medium text-white transition hover:bg-zinc-800"
          >
            Search
          </button>
        </form>

        {!query ? (
          <p className="text-zinc-600">
            Enter a search term to find products, categories, and blog posts.
          </p>
        ) : !hasResults ? (
          <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
            <p className="text-zinc-600">
              No results found for &quot;{query}&quot;. Try different keywords.
            </p>
            <Link
              href="/products"
              className="mt-4 inline-block text-blue-600 hover:underline"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {categories.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-zinc-900">
                  Categories
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {categories.map(
                    (cat: {
                      _id: string;
                      name: string;
                      slug: string;
                      icon?: string;
                    }) => (
                      <Link
                        key={cat._id}
                        href={`/products?category=${cat.slug}`}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <span className="text-2xl">{cat.icon || "📦"}</span>
                        <span className="font-medium text-zinc-900">
                          {cat.name}
                        </span>
                      </Link>
                    )
                  )}
                </div>
              </section>
            )}

            {products.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-zinc-900">
                  Products
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {products.map(
                    (p: {
                      _id: string;
                      name: string;
                      price: number;
                      description?: string;
                    }) => (
                      <Link
                        key={p._id}
                        href={`/products/${p._id}`}
                        className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <h3 className="font-medium text-zinc-900">{p.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                          {p.description}
                        </p>
                        <p className="mt-2 font-medium text-zinc-900">
                          ${p.price?.toFixed(2)}
                        </p>
                      </Link>
                    )
                  )}
                </div>
              </section>
            )}

            {blogs.length > 0 && (
              <section>
                <h2 className="mb-4 text-lg font-semibold text-zinc-900">
                  Blog Posts
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {blogs.map(
                    (b: {
                      _id: string;
                      title: string;
                      excerpt?: string;
                      slug?: string;
                    }) => (
                      <Link
                        key={b._id}
                        href={`/blogs/${b._id}`}
                        className="block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                      >
                        <h3 className="font-medium text-zinc-900">
                          {b.title}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                          {b.excerpt}
                        </p>
                      </Link>
                    )
                  )}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
