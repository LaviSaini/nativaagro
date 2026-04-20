"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getShippingAddress,
  getSessionId,
  clearShippingAddress,
  clearShippingMethod,
  getShippingMethod,
  SHIPPING_METHODS,
} from "@/lib/checkout";
import { getAuthedUserId } from "@/lib/auth";
import { notifyCartUpdated } from "@/lib/cartClient";
import Container from "@/components/ui/Container";
import { Button, ButtonLink } from "@/components/ui/Button";

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
          userId: getAuthedUserId() || getSessionId(),
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
      clearShippingMethod();
      await fetch(`/api/cart?sessionId=${getSessionId()}`, { method: "DELETE" });
      notifyCartUpdated();
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
  const methodId = getShippingMethod();
  const method = SHIPPING_METHODS.find((m) => m.id === methodId) || SHIPPING_METHODS[0];
  const tax = 0;
  const total = subtotal + method.price + tax;

  return (
    <main className="bg-white">
      <Container>
        <div className="py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">
            Checkout
          </h1>

          <div className="mt-8 grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <form
                onSubmit={handlePlaceOrder}
                className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
              >
                <StepHeader activeStep={3} />

                <h2 className="mt-8 text-lg font-semibold tracking-wide text-zinc-900">
                  Payment
                </h2>

                {error && (
                  <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="mt-6 grid gap-4">
                  <div className="flex gap-2">
                    {["Credit Card", "PayPal", "PayPal Credit"].map((t, idx) => (
                      <span
                        key={t}
                        className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                          idx === 0
                            ? "bg-zinc-900 text-white"
                            : "border border-zinc-300 text-zinc-700"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div>
                    <label className="text-xs font-medium tracking-wide text-zinc-700">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium tracking-wide text-zinc-700">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4085 9536 8475 9530"
                      maxLength={19}
                      className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium tracking-wide text-zinc-700">
                        Exp.Date
                      </label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="12/25"
                        maxLength={5}
                        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium tracking-wide text-zinc-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="mt-2 w-full rounded-2xl border border-zinc-300 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-zinc-900/20"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-xs leading-5 text-zinc-500">
                  Your personal data will be used to process your order, support your
                  experience throughout this website, and for other purposes described
                  in our privacy policy.
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <ButtonLink href="/checkout/shipping" variant="ghost">
                    Back
                  </ButtonLink>
                  <Button type="submit" disabled={placing}>
                    {placing ? "Paying..." : "Pay"}
                  </Button>
                </div>
              </form>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold tracking-wide text-zinc-900">
                  Summary
                </h2>
                <div className="mt-6 space-y-2 text-sm text-zinc-700">
                  {items.map((i) => (
                    <div key={i.productId} className="flex justify-between">
                      <span className="truncate pr-3">
                        {i.product?.name || "Product"} × {i.quantity}
                      </span>
                      <span>₹{Math.round((i.product?.price || 0) * i.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-3 border-t border-zinc-200 pt-6 text-sm">
                  <div className="flex justify-between text-zinc-700">
                    <span>Subtotal</span>
                    <span>₹{Math.round(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Estimated Tax</span>
                    <span>₹{Math.round(tax)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Shipment method</span>
                    <span>₹{Math.round(method.price)}</span>
                  </div>
                  <div className="flex justify-between pt-2 text-base font-semibold text-zinc-900">
                    <span>Total</span>
                    <span>₹{Math.round(total)}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
                  <p className="font-medium text-zinc-900">Address</p>
                  <p className="mt-2 text-sm text-zinc-600">
                    {shipping.fullName}
                    <br />
                    {shipping.address}
                    <br />
                    {shipping.city}, {shipping.state} {shipping.zip}
                    <br />
                    {shipping.country}
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/checkout"
                      className="text-sm text-zinc-600 hover:text-zinc-900"
                    >
                      Edit address
                    </Link>
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
