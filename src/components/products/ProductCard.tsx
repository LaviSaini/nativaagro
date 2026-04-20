"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, startTransition } from "react";
import { getSessionId } from "@/lib/checkout";
import { notifyCartUpdated } from "@/lib/cartClient";
import { normalizeProductImages } from "@/lib/product-images";
import { ProductImageSlider } from "@/components/products/ProductImageSlider";

export default function ProductCard({
  product,
  onAddToCart,
  showQuickView = false,
}: {
  product: {
    _id: string;
    name: string;
    price: number;
    description?: string;
    image?: unknown;
    images?: unknown;
  };
  onAddToCart?: () => void | Promise<void>;
  showQuickView?: boolean;
}) {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const galleryUrls = normalizeProductImages(product);

  useEffect(() => {
    router.prefetch("/cart");
  }, [router]);

  const handleAddToCart = useCallback(async () => {
    if (onAddToCart) {
      await onAddToCart();
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          sessionId: getSessionId(),
        }),
      });
      if (res.ok) {
        notifyCartUpdated();
        startTransition(() => {
          router.push("/cart");
        });
      }
    } finally {
      setAdding(false);
    }
  }, [onAddToCart, product._id, router]);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      
      {/* IMAGE SECTION — slider when multiple images */}
      <div className="relative">
        {showQuickView && (
          <Link
            href={`/products/${product._id}`}
            className="absolute right-4 top-4 z-30 flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-700 underline underline-offset-4 decoration-1"
          >
            QUICK VIEW 👁
          </Link>
        )}
        <ProductImageSlider
          images={galleryUrls}
          alt={product.name}
          variant="card"
        />
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="text-base font-medium">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-[#7D4739]">
          Subscribe & Save 15%: ₹{Math.round(product.price * 0.85)}
        </p>

        <p className="mt-1 text-lg font-semibold text-[#4E5F57]">
          Get Once: ₹{product.price}
        </p>
      </div>

      {/* BUTTON */}
      <button
        type="button"
        disabled={adding}
        onClick={() => void handleAddToCart()}
        className="w-full FeaturedAddtoCartButton py-3 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90 disabled:opacity-60"
      >
        {adding ? "Adding…" : "Add to cart"}
      </button>
    </div>
  );
}