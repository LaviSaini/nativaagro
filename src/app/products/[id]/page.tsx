import Link from "next/link";
import AddToCartForm from "./AddToCartForm";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";

async function getProduct(id: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getRelatedProducts(limit = 3) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return (data || []).slice(0, limit);
  } catch {
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, related] = await Promise.all([
    getProduct(id),
    getRelatedProducts(3),
  ]);

  if (!product) {
    return (
      <main className="bg-white">
        <Container>
          <div className="py-16 text-center">
          <h1 className="text-2xl font-bold text-zinc-900">Product not found</h1>
          <div className="mt-6">
            <ButtonLink href="/products" variant="outline">
              Back to products
            </ButtonLink>
          </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Container>
        <div className="py-10">
          <Link
            href="/products"
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            ← Back to products
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="aspect-[4/3] w-full rounded-[32px] border border-zinc-200 bg-zinc-100" />

              <div className="mt-8 rounded-3xl border border-zinc-200 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900">
                  Details
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  {product.description ||
                    "Our raw honey is perfect for daily consumption, offering natural sweetness along with essential nutrients to support overall well-being."}
                </p>
                <ul className="mt-6 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                  {[
                    "100% Pure & Natural",
                    "Unfiltered & Unprocessed for maximum nutrients",
                    "Sourced directly from trusted beekeepers",
                    "Free from additives and artificial sugars",
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-zinc-900" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-[32px] border border-zinc-200 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">
                  Quick view
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                  {product.name}
                </h1>
                <p className="mt-3 text-sm text-zinc-600">
                  FREE delivery by Tomorrow. Order within 8 hrs, 45 mins.
                </p>

                <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Purchase
                  </p>
                  <div className="mt-3 grid gap-2">
                    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          Subscribe &amp; Save 15%
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                          Pause or cancel your subscription at any time.
                        </p>
                      </div>
                      <input type="radio" name="purchase" defaultChecked />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4">
                      <p className="text-sm font-medium text-zinc-900">Get Once</p>
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-zinc-900">
                          ₹{Math.round(product.price || 300)}
                        </p>
                        <input type="radio" name="purchase" />
                      </div>
                    </label>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {[
                      { label: "Single", suffix: "" },
                      { label: "Bundle of 2", suffix: " (Save 10%)" },
                      { label: "Bundle of 3", suffix: " (Save 20%)" },
                    ].map((b, idx) => (
                      <button
                        key={b.label}
                        type="button"
                        className={`rounded-full px-3 py-2 text-xs tracking-wide transition ${
                          idx === 0
                            ? "bg-zinc-900 text-white"
                            : "border border-zinc-300 text-zinc-700 hover:bg-zinc-50"
                        }`}
                        aria-label={b.label + b.suffix}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <AddToCartForm productId={product._id} />
                    <div className="mt-3">
                      <ButtonLink href="/checkout" variant="outline" className="w-full">
                        Buy now
                      </ButtonLink>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                    Stock
                  </p>
                  <p className="mt-2 text-sm text-zinc-700">
                    {product.stock ?? 0} available
                  </p>
                </div>
              </div>

              <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900">
                  FAQs
                </h2>
                <div className="mt-4 space-y-3 text-sm text-zinc-700">
                  <details className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <summary className="cursor-pointer font-medium text-zinc-900">
                      What is raw honey?
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">
                      Raw honey is natural honey that is unprocessed and unfiltered,
                      retaining its original nutrients and rich flavor.
                    </p>
                  </details>
                  {[
                    "How is raw honey different from regular honey?",
                    "Does raw honey contain added sugar?",
                    "How should I store honey?",
                    "Is crystallization of honey normal?",
                  ].map((q) => (
                    <div
                      key={q}
                      className="rounded-2xl border border-zinc-200 bg-white p-4"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-6">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Related Products
              </h2>
              <Link
                href="/products"
                className="text-sm uppercase tracking-[0.3em] text-zinc-600 hover:text-zinc-900"
              >
                Shop all
              </Link>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(related || [])
                .filter((p: { _id: string }) => p._id !== product._id)
                .slice(0, 3)
                .map((p: { _id: string; name: string; price: number; description?: string }) => (
                  <ProductCard key={p._id} product={p} showQuickView />
                ))}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
