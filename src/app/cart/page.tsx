"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSessionId } from "@/lib/checkout";

interface CartItem {
  productId: string;
  quantity: number;
  product?: { name: string; price: number };
}

interface CartData {
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = getSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setCart(data))
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <p className="text-zinc-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Your Cart</h1>
        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
          {isEmpty ? (
            <>
              <p className="text-zinc-600">
                Your cart is empty. Add MONGODB_URI to .env.local and add
                products to see them here.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
              >
                Browse Products
              </Link>
            </>
          ) : (
            <>
              <ul className="divide-y divide-zinc-200">
                {items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium text-zinc-900">
                        {item.product?.name || "Product"}
                      </p>
                      <p className="text-sm text-zinc-500">
                        Qty: {item.quantity} × $
                        {item.product?.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <p className="font-medium text-zinc-900">
                      $
                      {(
                        (item.product?.price || 0) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-zinc-200 pt-6">
                <div className="flex justify-between text-lg font-semibold text-zinc-900">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <Link
                  href="/products"
                  className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 hover:bg-zinc-100"
                >
                  Continue Shopping
                </Link>
                <Link
                  href="/checkout"
                  className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
                >
                  Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
