"use client";

import { ProductImageSlider } from "@/components/products/ProductImageSlider";

type Props = {
  images: string[];
  productName: string;
};

/** PDP hero: arrows, swipe, dot indicators, and thumbnail strip when multiple images. */
export default function ProductImageGallery({ images, productName }: Props) {
  return (
    <ProductImageSlider
      images={images}
      alt={productName}
      variant="detail"
      priority
    />
  );
}
