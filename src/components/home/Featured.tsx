import Container from "../ui/Container";
import ProductCard from "../products/ProductCard";

export type FeaturedProduct = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  images?: string[];
};

export default function Featured({ products }: { products: FeaturedProduct[] }) {
  const list = products.slice(0, 3);

  return (
    <section className="border-t border-zinc-200/80 bg-white">
      <Container>
        <div className="py-14 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
              Featured Products
            </h2>
          </div>

          {list.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
              No honey products yet. Check back soon!
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p._id} product={p} showQuickView />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
