import Link from "next/link";

async function getProducts(limit = 8) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.slice(0, limit);
  } catch {
    return [];
  }
}

async function getCategories() {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Hero */}
        <section className="mb-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <h1 className="text-3xl font-bold md:text-4xl">
            Welcome to EcomApp
          </h1>
          <p className="mt-2 text-lg text-blue-100">
            Your one-stop shop for everything. Find products across all categories.
          </p>
          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-600 hover:bg-blue-50"
          >
            Shop All Products
          </Link>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-zinc-900">
            Shop by Category
          </h2>
          {categories.length === 0 ? (
            <p className="rounded-xl border border-zinc-200 bg-white p-6 text-center text-zinc-600">
              No categories yet. Add categories to your database to see them here.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {categories.map(
                (cat: { _id: string; name: string; slug: string; icon?: string }) => (
                  <Link
                    key={cat._id}
                    href={`/products?category=${cat.slug}`}
                    className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
                  >
                    <span className="text-4xl">{cat.icon || "📦"}</span>
                    <span className="font-medium text-zinc-900">{cat.name}</span>
                  </Link>
                )
              )}
            </div>
          )}
        </section>

        {/* Featured Products */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View all →
            </Link>
          </div>
          {products.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center">
              <p className="text-zinc-600">
                No products yet. Add MONGODB_URI and seed your database.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map(
                (product: {
                  _id: string;
                  name: string;
                  price: number;
                  description?: string;
                }) => (
                  <Link
                    key={product._id}
                    href={`/products/${product._id}`}
                    className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                  >
                    <h3 className="font-semibold text-zinc-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
                      {product.description}
                    </p>
                    <p className="mt-4 font-medium text-zinc-900">
                      ${product.price?.toFixed(2)}
                    </p>
                  </Link>
                )
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
