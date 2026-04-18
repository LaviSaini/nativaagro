"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getSessionId } from "@/lib/checkout";
import Container from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/QuantityStepper";

const FALLBACK_PRODUCT_IMAGE = "/products/raw-honey-250g.svg";

function CartLineImage({ image, name }: { image?: string; name: string }) {
  const src = (typeof image === "string" && image.trim()) || FALLBACK_PRODUCT_IMAGE;
  const remote = src.startsWith("http://") || src.startsWith("https://");
  return (
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 ring-1 ring-zinc-200/80">
      {remote ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-contain p-1.5" />
      ) : (
        <Image src={src} alt={name} fill className="object-contain p-1.5" sizes="80px" />
      )}
    </div>
  );
}

interface CartItem {
  productId: string;
  quantity: number;
  product?: { name: string; price: number; image?: string; packSize?: string };
}

interface CartData {
  items: CartItem[];
}

async function fetchCart(sessionId: string): Promise<CartData> {
  const r = await fetch(`/api/cart?sessionId=${sessionId}`);
  if (!r.ok) return { items: [] };
  return r.json();
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    const sessionId = getSessionId();
    const data = await fetchCart(sessionId);
    setCart(data);
  }, []);

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, [refreshCart]);

  async function removeLine(productId: string) {
    const sessionId = getSessionId();
    setUpdatingId(productId);
    try {
      await fetch(`/api/cart/${productId}?sessionId=${encodeURIComponent(sessionId)}`, {
        method: "DELETE",
      });
      await refreshCart();
    } finally {
      setUpdatingId(null);
    }
  }

  async function setLineQuantity(productId: string, nextQty: number) {
    const sessionId = getSessionId();
    setUpdatingId(productId);
    try {
      await fetch(`/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, quantity: nextQty }),
      });
      await refreshCart();
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <main className="bg-white">
        <Container>
          <div className="py-14">
            <p className="text-zinc-600">Loading cart...</p>
          </div>
        </Container>
      </main>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Shopping Cart
          </h1>

          {isEmpty ? (
            <div className="mt-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-10">
              <p className="text-sm text-zinc-600">Your cart is empty.</p>
              <div className="mt-6">
                <ButtonLink href="/products" variant="outline">
                  Browse products
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 md:grid-cols-12">
              <div className="md:col-span-7">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <ul className="divide-y divide-zinc-200">
                    {items.map((item) => (
                      <li key={item.productId} className="py-5 first:pt-0 last:pb-0">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                          <div className="flex gap-4">
                            <CartLineImage
                              image={item.product?.image}
                              name={item.product?.name || "Product"}
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold tracking-wide text-zinc-900">
                                {item.product?.name || "Product"}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                                {item.product?.packSize?.trim() ? (
                                  <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs">
                                    {item.product.packSize.trim()}
                                  </span>
                                ) : null}
                              </div>
                              <div className="mt-3 flex flex-wrap items-center gap-3">
                                <QuantityStepper
                                  value={item.quantity}
                                  min={1}
                                  max={999}
                                  compact
                                  disabled={updatingId === item.productId}
                                  onChange={(n) => void setLineQuantity(item.productId, n)}
                                />
                                <button
                                  type="button"
                                  disabled={updatingId === item.productId}
                                  onClick={() => void removeLine(item.productId)}
                                  className="text-xs font-medium text-red-600 underline-offset-2 hover:underline disabled:opacity-40"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-zinc-900 sm:ml-auto sm:shrink-0 sm:text-right">
                            ₹{Math.round((item.product?.price || 0) * item.quantity)}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                  <h2 className="text-lg font-semibold tracking-wide text-zinc-900">
                    Order Summary
                  </h2>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
                      Discount code / Promo code
                    </p>
                    <div className="mt-3 flex gap-2">
                      <input
                        value={promo}
                        onChange={(e) => setPromo(e.target.value)}
                        placeholder="Enter Code"
                        className="w-full rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          // placeholder: promo logic can be added later
                        }}
                        className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
                      >
                        Apply
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm">
                    <div className="flex justify-between text-zinc-700">
                      <span>Subtotal</span>
                      <span>₹{Math.round(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Estimated Tax</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Estimated shipping &amp; Handling</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between pt-2 text-base font-semibold text-zinc-900">
                      <span>Total</span>
                      <span>₹{Math.round(subtotal)}</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <ButtonLink href="/checkout" className="w-full">
                      Checkout
                    </ButtonLink>
                    <div className="mt-3 text-center">
                      <Link
                        href="/products"
                        className="text-sm text-zinc-600 hover:text-zinc-900"
                      >
                        Continue shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
