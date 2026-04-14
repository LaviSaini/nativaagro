"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  setShippingAddress,
  getShippingAddress,
  getSessionId,
  type ShippingAddress,
} from "@/lib/checkout";
import { Button, ButtonLink } from "@/components/ui/Button";

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
    router.push("/checkout/shipping");
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-8">
        <p className="text-zinc-600">Loading...</p>
      </div>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900">Your cart is empty</h2>
        <p className="mt-2 text-zinc-600">Add items to your cart before checkout.</p>
        <div className="mt-6">
          <ButtonLink href="/products" variant="outline">
            Browse Products
          </ButtonLink>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <StepHeader activeStep={1} />

        <h2 className="mt-8 text-lg font-semibold tracking-wide text-zinc-900">
          Select Address
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Use your default address or add a new one.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium tracking-wide text-zinc-700">
              Full Name
            </label>
            <input
              type="text"
              required
              value={address.fullName}
              onChange={(e) =>
                setAddress((a) => ({ ...a, fullName: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
          <div>
            <label className="text-xs font-medium tracking-wide text-zinc-700">
              Address
            </label>
            <input
              type="text"
              required
              value={address.address}
              onChange={(e) =>
                setAddress((a) => ({ ...a, address: e.target.value }))
              }
              className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium tracking-wide text-zinc-700">
                City
              </label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, city: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-zinc-700">
                State / Province
              </label>
              <input
                type="text"
                required
                value={address.state}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, state: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium tracking-wide text-zinc-700">
                ZIP / Postal Code
              </label>
              <input
                type="text"
                required
                value={address.zip}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, zip: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
            <div>
              <label className="text-xs font-medium tracking-wide text-zinc-700">
                Country
              </label>
              <input
                type="text"
                required
                value={address.country}
                onChange={(e) =>
                  setAddress((a) => ({ ...a, country: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-4">
            <ButtonLink href="/cart" variant="ghost">
              Back
            </ButtonLink>
            <Button type="submit" disabled={submitting}>
              Next
            </Button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
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
            <span>₹{Math.round(subtotal)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}

function StepHeader({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className={`font-medium ${activeStep === 1 ? "text-zinc-900" : "text-zinc-500"}`}>
        Step 1
      </span>
      <span className="text-zinc-400">Address</span>
      <span className="text-zinc-300">•</span>
      <span className={`font-medium ${activeStep === 2 ? "text-zinc-900" : "text-zinc-500"}`}>
        Step 2
      </span>
      <span className="text-zinc-400">Shipping</span>
      <span className="text-zinc-300">•</span>
      <span className={`font-medium ${activeStep === 3 ? "text-zinc-900" : "text-zinc-500"}`}>
        Step 3
      </span>
      <span className="text-zinc-400">Payment</span>
    </div>
  );
}
