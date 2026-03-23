"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSessionId } from "@/lib/checkout";

export default function AddToCartForm({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: 1,
          sessionId: getSessionId(),
        }),
      });
      if (res.ok) router.push("/cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </form>
  );
}
