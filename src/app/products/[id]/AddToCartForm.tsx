"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, startTransition } from "react";
import { getSessionId } from "@/lib/checkout";
import { notifyCartUpdated } from "@/lib/cartClient";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/QuantityStepper";

type Props = {
  productId: string;
  /** When set, quantity cannot exceed this (inventory). */
  maxStock?: number;
};

export default function AddToCartForm({ productId, maxStock }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);
  const [error, setError] = useState<string | null>(null);

  const maxQty = useMemo(() => {
    if (maxStock != null && maxStock >= 0) {
      return Math.min(999, maxStock);
    }
    return 99;
  }, [maxStock]);

  const [quantity, setQuantity] = useState(1);

  const outOfStock = maxStock != null && maxStock <= 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (outOfStock) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity,
          sessionId: getSessionId(),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(typeof j.error === "string" ? j.error : "Could not add to cart");
        return;
      }
      notifyCartUpdated();
      startTransition(() => {
        router.push("/cart");
      });
    } finally {
      setLoading(false);
    }
  }

  if (outOfStock) {
    return (
      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-sm text-zinc-600">
        Out of stock
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Quantity</p>
        <div className="mt-2">
          <QuantityStepper
            value={quantity}
            min={1}
            max={maxQty}
            disabled={loading}
            onChange={(n) => setQuantity(Math.max(1, Math.min(maxQty, n)))}
          />
        </div>
        {maxStock != null ? (
          <p className="mt-1.5 text-xs text-zinc-500">{maxStock} available</p>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding…" : "Add to cart"}
      </Button>
    </form>
  );
}
