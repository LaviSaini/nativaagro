"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { FALLBACK_PRODUCT_IMAGE } from "@/lib/product-images";

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

function MainSlide({
  src,
  alt,
  variant,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  variant: "card" | "detail";
  sizes: string;
  priority?: boolean;
}) {
  if (variant === "detail") {
    if (isRemote(src)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 m-auto max-h-full max-w-full object-contain p-6 md:p-8"
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain p-6 md:p-8"
        sizes={sizes}
        priority={priority}
        unoptimized={src.endsWith(".svg")}
      />
    );
  }

  /* card: fixed frame like original ProductCard */
  return (
    <div className="relative flex h-[200px] w-[140px] items-center justify-center">
      {isRemote(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes={sizes}
          unoptimized={src.endsWith(".svg")}
        />
      )}
    </div>
  );
}

export type ProductImageSliderProps = {
  images: string[];
  alt: string;
  variant?: "card" | "detail";
  priority?: boolean;
  className?: string;
};

export function ProductImageSlider({
  images,
  alt,
  variant = "card",
  priority = false,
  className = "",
}: ProductImageSliderProps) {
  const list = images.length > 0 ? images : [FALLBACK_PRODUCT_IMAGE];
  const multi = list.length > 1;
  const [index, setIndex] = useState(0);
  const safe = Math.min(Math.max(0, index), list.length - 1);
  const src = list[safe] || FALLBACK_PRODUCT_IMAGE;
  const swipeRef = useRef<{ x: number } | null>(null);

  const go = useCallback(
    (dir: -1 | 1) => {
      if (!multi) return;
      setIndex((i) => {
        const n = i + dir;
        if (n < 0) return list.length - 1;
        if (n >= list.length) return 0;
        return n;
      });
    },
    [list.length, multi]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (!multi) return;
    swipeRef.current = { x: e.clientX };
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!multi || !swipeRef.current) return;
    const dx = e.clientX - swipeRef.current.x;
    swipeRef.current = null;
    if (dx > 48) go(-1);
    else if (dx < -48) go(1);
  };

  const isDetail = variant === "detail";
  const sizes = isDetail ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 50vw, 280px";

  const mainBox = isDetail
    ? "relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-zinc-200 bg-zinc-100"
    : `relative h-[260px] w-full overflow-hidden bg-[#f3f3f3] ${className}`;

  const mainInner = isDetail ? "absolute inset-0" : "absolute inset-0 z-10 flex items-center justify-center";

  const sliderCore = (
    <div
      className={mainBox}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={() => {
        swipeRef.current = null;
      }}
    >
      <div className={mainInner}>
        {isDetail ? (
          <div className="relative h-full w-full">
            <MainSlide src={src} alt={alt} variant="detail" sizes={sizes} priority={priority && safe === 0} />
          </div>
        ) : (
          <MainSlide src={src} alt={alt} variant="card" sizes={sizes} priority={false} />
        )}
      </div>

      {multi ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(-1);
            }}
            className={
              isDetail
                ? "absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-200/80 bg-white/90 p-2.5 text-zinc-800 shadow-sm backdrop-blur hover:bg-white"
                : "absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-300/90 bg-white/95 p-1.5 text-zinc-800 shadow-sm hover:bg-white"
            }
          >
            <ChevronLeft sm={!isDetail} />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              go(1);
            }}
            className={
              isDetail
                ? "absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-200/80 bg-white/90 p-2.5 text-zinc-800 shadow-sm backdrop-blur hover:bg-white"
                : "absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-zinc-300/90 bg-white/95 p-1.5 text-zinc-800 shadow-sm hover:bg-white"
            }
          >
            <ChevronRight sm={!isDetail} />
          </button>
        </>
      ) : null}

      {multi ? (
        <div className="absolute bottom-2 left-0 right-0 z-20 flex justify-center gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Image ${i + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className={
                i === safe
                  ? isDetail
                    ? "h-2 w-6 rounded-full bg-zinc-900 transition-all"
                    : "h-1.5 w-4 rounded-full bg-zinc-900"
                  : isDetail
                    ? "h-2 w-2 rounded-full bg-white/90 ring-1 ring-zinc-300 hover:bg-white"
                    : "h-1.5 w-1.5 rounded-full bg-zinc-400/90 hover:bg-zinc-500"
              }
            />
          ))}
        </div>
      ) : null}
    </div>
  );

  if (!isDetail) {
    return sliderCore;
  }

  return (
    <div className={`space-y-3 ${className}`.trim()}>
      {sliderCore}
      {multi ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((thumb, i) => (
            <button
              key={`${i}-${thumb.slice(0, 32)}`}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                i === safe
                  ? "border-zinc-900 ring-2 ring-zinc-900/20"
                  : "border-zinc-200 opacity-80 hover:opacity-100"
              }`}
              aria-label={`Show image ${i + 1}`}
            >
              {isRemote(thumb) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="h-full w-full object-cover" />
              ) : (
                <Image
                  src={thumb}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized={thumb.endsWith(".svg")}
                />
              )}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ChevronLeft({ sm }: { sm: boolean }) {
  const c = sm ? "h-4 w-4" : "h-5 w-5";
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ sm }: { sm: boolean }) {
  const c = sm ? "h-4 w-4" : "h-5 w-5";
  return (
    <svg className={c} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
