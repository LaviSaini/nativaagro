"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getShippingAddress,
  getSessionId,
  clearShippingAddress,
} from "@/lib/checkout";
import { getAuthToken } from "@/lib/auth";

interface CartItem {
  productId: string;
  quantity: number;
  product?: { name: string; price: number };
}

export default function PaymentPage() {
  const router = useRouter();
  const [shipping, setShipping] = useState<ReturnType<typeof getShippingAddress>>(null);
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    const addr = getShippingAddress();
    if (!addr) {
      router.replace("/checkout");
      return;
    }
    setShipping(addr);

    const sessionId = getSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setCart(data))
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
  }, [router]);

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPlacing(true);

    if (!shipping || !cart?.items?.length) {
      setError("Missing shipping or cart data. Please try again from checkout.");
      setPlacing(false);
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: getAuthToken() ? "user" : getSessionId(),
          items: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          shippingAddress: shipping,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order");
        setPlacing(false);
        return;
      }

      clearShippingAddress();
      await fetch(`/api/cart?sessionId=${getSessionId()}`, { method: "DELETE" });
      router.push(`/order-confirmation/${data._id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setPlacing(false);
    }
  }

  if (loading || !shipping) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900">Payment</h1>

        <div className="space-y-8">
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-zinc-900">
              Shipping to
            </h2>
            <p className="text-sm text-zinc-600">
              {shipping.fullName}
              <br />
              {shipping.address}
              <br />
              {shipping.city}, {shipping.state} {shipping.zip}
              <br />
              {shipping.country}
            </p>
            <Link
              href="/checkout"
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              Edit address
            </Link>
          </div>

          <form
            onSubmit={handlePlaceOrder}
            className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm"
          >
            <h2 className="mb-6 text-lg font-semibold text-zinc-900">
              Payment Details
            </h2>
            {error && (
              <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Name on Card
                </label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  maxLength={19}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="12/25"
                    maxLength={5}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-zinc-200 pt-6">
              <div className="flex justify-between text-lg font-semibold text-zinc-900">
                <span>Order Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                type="submit"
                disabled={placing}
                className="mt-6 w-full rounded-lg bg-zinc-900 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>

        <Link
          href="/checkout"
          className="mt-6 inline-block text-sm text-blue-600 hover:underline"
        >
          ← Back to checkout
        </Link>
      </div>
    </div>
  );
}
