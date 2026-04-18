import Link from "next/link";
import AddToCartForm from "./AddToCartForm";
import ProductImageGallery from "./ProductImageGallery";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { parseFaqs, parseHighlights } from "@/lib/product-fields";
import { normalizeProductImages } from "@/lib/product-images";
import { getStoreProductById, getStoreRelatedProducts } from "@/lib/server-products";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, related] = await Promise.all([
    getStoreProductById(id),
    getStoreRelatedProducts(id, 3),
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

  const highlights = parseHighlights(product.highlights);
  const faqs = parseFaqs(product.faqs);
  const galleryImages = normalizeProductImages(product);
  const promoLine =
    (typeof product.promoLine === "string" && product.promoLine.trim()) ||
    "FREE delivery by Tomorrow. Order within 8 hrs, 45 mins.";

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
              <ProductImageGallery images={galleryImages} productName={product.name} />

              <div className="mt-8 rounded-3xl border border-zinc-200 p-6">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900">
                  Details
                </h2>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  {product.description ||
                    "Our raw honey is perfect for daily consumption, offering natural sweetness along with essential nutrients to support overall well-being."}
                </p>
                {highlights.length > 0 ? (
                  <ul className="mt-6 grid gap-2 text-sm text-zinc-700 sm:grid-cols-2">
                    {highlights.map((t) => (
                      <li key={t} className="flex gap-2">
                        <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-zinc-900" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
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
                <p className="mt-3 text-sm text-zinc-600">{promoLine}</p>

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
                    <AddToCartForm
                      productId={product._id}
                      maxStock={typeof product.stock === "number" ? product.stock : undefined}
                    />
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

              {faqs.length > 0 ? (
                <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-6">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-900">
                    FAQs
                  </h2>
                  <div className="mt-4 space-y-3 text-sm text-zinc-700">
                    {faqs.map((faq, idx) => (
                      <details
                        key={`${idx}-${faq.question.slice(0, 48)}`}
                        className="rounded-2xl border border-zinc-200 bg-white p-4"
                      >
                        <summary className="cursor-pointer font-medium text-zinc-900">
                          {faq.question}
                        </summary>
                        {faq.answer ? (
                          <p className="mt-3 text-sm leading-6 text-zinc-600">{faq.answer}</p>
                        ) : null}
                      </details>
                    ))}
                  </div>
                </div>
              ) : null}
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
