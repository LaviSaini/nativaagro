"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  getSessionId,
  getShippingAddress,
  getShippingMethod,
  setShippingMethod,
  SHIPPING_METHODS,
  type ShippingMethodId,
} from "@/lib/checkout";

interface CartItem {
  productId: string;
  quantity: number;
  product?: { name: string; price: number };
}

export default function ShippingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ items: CartItem[] } | null>(null);
  const [method, setMethod] = useState<ShippingMethodId>("free");

  useEffect(() => {
    const addr = getShippingAddress();
    if (!addr) {
      router.replace("/checkout");
      return;
    }

    setMethod(getShippingMethod());

    const sessionId = getSessionId();
    fetch(`/api/cart?sessionId=${sessionId}`)
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data) => setCart(data))
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
  }, [router]);

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  const selected = useMemo(
    () => SHIPPING_METHODS.find((m) => m.id === method) || SHIPPING_METHODS[0],
    [method]
  );

  if (loading) {
    return (
      <main className="bg-white">
        <Container>
          <div className="py-14">
            <p className="text-zinc-600">Loading...</p>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Checkout
          </h1>

          <div className="mt-8 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
                <StepHeader activeStep={2} />
                <h2 className="mt-8 text-lg font-semibold tracking-wide text-zinc-900">
                  Shipment Method
                </h2>

                <div className="mt-6 space-y-3">
                  {SHIPPING_METHODS.map((m) => (
                    <label
                      key={m.id}
                      className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-zinc-200 p-4 hover:bg-zinc-50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-zinc-900">{m.label}</p>
                        <p className="mt-1 text-sm text-zinc-600">{m.description}</p>
                      </div>
                      <input
                        type="radio"
                        name="shipping"
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                      />
                    </label>
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <Link
                    href="/checkout"
                    className="rounded-full px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  >
                    Back
                  </Link>
                  <Button
                    onClick={() => {
                      setShippingMethod(method);
                      router.push("/checkout/payment");
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-wide text-zinc-900">
                  Summary
                </h2>
                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-700">
                    <span>Subtotal</span>
                    <span>₹{Math.round(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipment method</span>
                    <span>₹{Math.round(selected.price)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-semibold text-zinc-900">
                    <span>Total</span>
                    <span>₹{Math.round(subtotal + selected.price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
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

