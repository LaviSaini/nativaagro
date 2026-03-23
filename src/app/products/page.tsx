import Link from "next/link";

async function getProducts(search?: string, category?: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  const qs = params.toString();
  try {
    const res = await fetch(`${base}/api/products${qs ? `?${qs}` : ""}`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const products = await getProducts(search, category);

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">
          {search ? `Search: "${search}"` : category ? `Category: ${category}` : "Products"}
        </h1>
        {products.length === 0 ? (
          <p className="rounded-lg bg-amber-50 p-4 text-amber-800">
            No products yet. Add MONGODB_URI to .env.local and seed your
            database to see products here.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: { _id: string; name: string; price: number; description?: string }) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <h2 className="font-semibold text-zinc-900">{product.name}</h2>
                <p className="mt-1 text-sm text-zinc-600 line-clamp-2">
                  {product.description}
                </p>
                <p className="mt-4 font-medium text-zinc-900">
                  ${product.price?.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
