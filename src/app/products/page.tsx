import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { ProductsToolbar } from "./toolbar";
import { getStoreCategories, getStoreProductsList } from "@/lib/server-products";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const { search, category, sort } = await searchParams;
  const [products, categories] = await Promise.all([
    getStoreProductsList({ search, categorySlug: category }),
    getStoreCategories(),
  ]);

  const sorted = [...products];
  if (sort === "price_asc") sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sort === "price_desc") sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            Get To Know
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">
            The Range
          </h1>

          <ProductsToolbar
            categories={categories}
            activeCategory={category || ""}
            search={search || ""}
            sort={sort || ""}
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((product) => (
              <ProductCard key={product._id} product={product} showQuickView />
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
              No products found.
            </div>
          ) : null}
        </div>
      </Container>
    </main>
  );
}
