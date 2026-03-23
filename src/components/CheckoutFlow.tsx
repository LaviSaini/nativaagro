"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  setShippingAddress,
  getShippingAddress,
  getSessionId,
  type ShippingAddress,
} from "@/lib/checkout";

const INITIAL_ADDRESS: ShippingAddress = {
  fullName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  country: "",
};

interface CartItem {
  productId: string;
  quantity: number;
  product?: { name: string; price: number };
}

interface CartData {
  items: CartItem[];
}

export default function CheckoutFlow() {
  const router = useRouter();
  const [address, setAddress] = useState<ShippingAddress>(INITIAL_ADDRESS);
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = getShippingAddress();
    if (saved) setAddress(saved);

    const sessionId = getSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setCart(data))
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setShippingAddress(address);
    router.push("/checkout/payment");
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Your cart is empty</h2>
        <p className="mt-2 text-zinc-600">
          Add items to your cart before checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-zinc-900">
          Shipping Address
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={address.fullName}
              onChange={(e) =>
                setAddress((a) => ({ ...a, fullName: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Address
            </label>
            <input
              type="text"
              required
              value={address.address}
              onChange={(e) =>
                setAddress((a) => ({ ...a, address: e.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                City
              </label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, city: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                State / Province
              </label>
              <input
                type="text"
                required
                value={address.state}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, state: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                required
                value={address.zip}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, zip: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Country
              </label>
              <input
                type="text"
                required
                value={address.country}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, country: e.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-zinc-900">
          Order Summary
        </h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex justify-between text-sm text-zinc-600"
            >
              <span>
                {item.product?.name || "Product"} × {item.quantity}
              </span>
              <span>
                $
                {(
                  (item.product?.price || 0) * item.quantity
                ).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-zinc-200 pt-4">
          <div className="flex justify-between font-semibold text-zinc-900">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Link
        href="/cart"
        className="inline-block text-sm text-blue-600 hover:underline"
      >
        ← Back to cart
      </Link>
    </div>
  );
}
