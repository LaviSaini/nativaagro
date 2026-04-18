"use client";

import Link from "next/link";
import Image from "next/image";

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
    image?: any;
  };
  onAddToCart?: () => void;
  showQuickView?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      
      {/* IMAGE SECTION */}
      <div className="relative h-[260px] w-full bg-[#f3f3f3]">
        
        {/* split background */}
        {/* <div className="absolute inset-0 grid grid-cols-2">
          <div className="bg-[#F4F4F4]" />
        </div> */}

        {/* Quick View */}
        {showQuickView && (
          <Link
            href={`/products/${product._id}`}
            className="absolute underline underline-offset-4 decoration-1 right-4 top-4 z-20 flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-700"
          >
            QUICK VIEW 👁
          </Link>
        )}

        {/* Product Image */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative h-[200px] w-[140px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
        </div>

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
        onClick={() => onAddToCart?.()}
        className="w-full FeaturedAddtoCartButton py-3 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
      >
        Add to cart
      </button>
    </div>
  );
}