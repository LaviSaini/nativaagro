"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSessionId } from "@/lib/checkout";
import { Button } from "@/components/ui/Button";

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
    <form onSubmit={handleSubmit} className="mt-6">
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Adding..." : "Add to cart"}
      </Button>
    </form>
  );
}
