"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";

export type HeroSlide = {
  eyebrow: string;
  title: string;
  tagline: string;
  image: string;
  specs: Array<{ line1: string; line2?: string }>;
  /** Label shown between carousel arrows */
  carouselLabel: string;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const safeSlides = useMemo(() => (slides?.length ? slides : [fallbackSlide]), [slides]);
  const [i, setI] = useState(0);
  const slide = safeSlides[i] ?? safeSlides[0];

  function prev() {
    setI((p) => (p - 1 + safeSlides.length) % safeSlides.length);
  }
  function next() {
    setI((p) => (p + 1) % safeSlides.length);
  }

  return (
    <section className="relative overflow-hidden bg-transparent pb-6 pt-8 md:pb-10 md:pt-12">
      {/* Decorative dashed arc (top-left, like PDF) */}
      <div
        className="pointer-events-none absolute -left-24 -top-16 hidden h-[420px] w-[420px] rounded-full border border-dashed border-[color:var(--accent)] opacity-70 md:block"
        aria-hidden
      />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-6">
        {/* Left: copy + CTA */}
        <div className="lg:col-span-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[color:var(--text)]">
            {slide.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight tracking-tight text-[color:var(--ink)] md:text-5xl lg:text-[56px] lg:leading-[1.05]">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-[color:var(--text)] md:text-lg">
            {slide.tagline}
          </p>
          <div className="mt-8">
            <ButtonLink href="/products" className="min-w-[140px] px-8 py-3 text-base">
              Shop Now
            </ButtonLink>
          </div>
        </div>

        {/* Center: hero product */}
        <div className="relative flex min-h-[320px] items-center justify-center lg:col-span-6 lg:min-h-[480px]">
          <div
            className="pointer-events-none absolute inset-[8%] rounded-full border border-dashed border-[color:var(--accent)]/80"
            aria-hidden
          />
          <div className="relative z-10 aspect-square w-[min(100%,420px)] md:w-[min(100%,520px)]">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 1024px) 90vw, 520px"
              priority
            />
          </div>
        </div>

        {/* Right: specs */}
        <div className="flex flex-col justify-center gap-8 lg:col-span-3">
          {slide.specs.map((s) => (
            <div key={s.line1} className="flex items-start gap-4 border-b border-dashed border-[color:var(--ink)]/15 pb-6 last:border-0 last:pb-0">
              <span
                className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[color:var(--brand)]/10 text-lg text-[color:var(--brand)]"
                aria-hidden
              >
                ✦
              </span>
              <div>
                <p className="text-lg font-semibold text-[color:var(--ink)]">{s.line1}</p>
                {s.line2 ? (
                  <p className="mt-0.5 text-sm text-[color:var(--text)]">{s.line2}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel controls — bottom center */}
      <div className="relative z-10 mx-auto mt-8 flex max-w-xl items-center justify-center gap-6 md:mt-10">
        <button
          type="button"
          onClick={prev}
          className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--ink)] bg-white text-[color:var(--ink)] shadow-sm transition hover:bg-[color:var(--surface)]"
          aria-label="Previous slide"
        >
          <span className="text-lg leading-none">‹</span>
        </button>
        <p className="min-w-[120px] text-center text-lg font-semibold capitalize text-[color:var(--ink)]">
          {slide.carouselLabel}
        </p>
        <button
          type="button"
          onClick={next}
          className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--ink)] bg-white text-[color:var(--ink)] shadow-sm transition hover:bg-[color:var(--surface)]"
          aria-label="Next slide"
        >
          <span className="text-lg leading-none">›</span>
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/products"
          className="text-xs font-medium uppercase tracking-[0.25em] text-[color:var(--text)] underline-offset-4 hover:text-[color:var(--ink)] hover:underline"
        >
          View all products
        </Link>
      </div>
    </section>
  );
}

const fallbackSlide: HeroSlide = {
  eyebrow: "Pure and Organic",
  title: "Raw Honey",
  tagline: "Get the best of nature — unprocessed, golden, and full of character.",
  image: "/products/raw-honey-250g.svg",
  carouselLabel: "Raw Honey",
  specs: [
    { line1: "Pure Honey", line2: "Single-origin harvest" },
    { line1: "Raw Honey", line2: "Never heated or ultra-filtered" },
    { line1: "500g", line2: "Net weight" },
    { line1: "100% Organic", line2: "From hive to jar" },
  ],
};
