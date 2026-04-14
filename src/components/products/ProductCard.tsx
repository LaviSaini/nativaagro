"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";

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
    image?: string;
  };
  onAddToCart?: () => void;
  showQuickView?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100">
        <Image
          src={product.image || "/products/raw-honey-250g.svg"}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/products/${product._id}`} className="block">
            <h3 className="truncate text-sm font-semibold tracking-wide text-zinc-900">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-zinc-500">
            Subscribe &amp; Save 15%:{" "}
            <span className="text-zinc-900">₹{Math.round(product.price * 0.85)}</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Get Once: <span className="text-zinc-900">₹{Math.round(product.price)}</span>
          </p>
        </div>

        {showQuickView ? (
          <Link
            href={`/products/${product._id}`}
            className="shrink-0 rounded-full border border-zinc-300 px-3 py-1 text-[11px] uppercase tracking-widest text-zinc-700 hover:bg-zinc-50"
          >
            Quick view
          </Link>
        ) : null}
      </div>

      <div className="mt-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onAddToCart?.()}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}

