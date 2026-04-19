"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Container from "../ui/Container";

import beeImage from "../../../public/home/bee.png";
import bottleImage from "../../../public/home/HoneyBottle.png";

export type HeroSlide = {
  eyebrow: string;
  title: string;
  tagline: string;
  image: string | any;
  specs: Array<{ line1: string; line2?: string }>;
  carouselLabel: string;
  ingredients?: string[];
};

export default function HeroCarousel({ slides }: { slides?: HeroSlide[] }) {
  const safeSlides = useMemo(() => (slides?.length ? slides : fallbackSlides), [slides]);
  const [i, setI] = useState(0);
  const slide = safeSlides[i] ?? safeSlides[0];
  const [animKey, setAnimKey] = useState(0);

  function prev() {
    setAnimKey((k) => k + 1);
    setI((p) => (p - 1 + safeSlides.length) % safeSlides.length);
  }

  function next() {
    setAnimKey((k) => k + 1);
    setI((p) => (p + 1) % safeSlides.length);
  }

  return (
    <div className="relative border-b border-[#EAE3D5] overflow-hidden bg-[#FDF7EA]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFF1DB] via-[#FDF7E9] to-[#FAF4E4] pointer-events-none" />

      {/* decorative dashed circle (top right) */}
      <div className="pointer-events-none absolute right-[-200px] top-[-460px] hidden h-[650px] w-[650px] rounded-full border border-dashed border-[#FFB64C] md:block" />

      {/* bee (top right) */}
      <div className="pointer-events-none absolute right-[5%] top-0 hidden md:block w-34 h-34 opacity-100">
        <Image src={beeImage} alt="Bee" fill className="object-contain rotate-[160deg]" />
      </div>

      {/* bee (bottom left) */}
      <div className="pointer-events-none absolute bottom-15 left-[5%] hidden md:block w-28 h-28 opacity-100">
        <Image src={beeImage} alt="Bee" fill className="object-contain scale-x-[-1] rotate-[130deg]" />
      </div>

      <Container>
        <section className="relative z-10 py-16 md:py-24 min-h-[750px] flex items-center">
          <div className="mx-auto grid w-full items-start gap-6 md:gap-12 lg:grid-cols-12 lg:items-center">

            {/* LEFT */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end text-left lg:text-right order-2 lg:order-1 w-full">
              <div className="flex flex-col w-full text-center lg:text-left">
                <p className="text-[12px] font-bold uppercase tracking-[0.15em] text-[#555]">
                  DISCOVER OUR PRODUCTS
                </p>

                <h1 className="mt-3 text-[40px] font-bold leading-[1.05] text-[#1B1B1B] md:text-[60px] tracking-tight text-center lg:text-left">
                  {slide.title}
                </h1>

                <p className="mt-3 text-[14px] text-[#666] tracking-widest uppercase font-medium">
                  100% PURE RAW HONEY
                </p>
              </div>
              <div className="mt-4 sm:mt-8 md:mt-16 text-[15px] text-[#555] leading-[1.8] font-medium w-full text-left lg:text-right">
                <p className="mb-2 font-bold text-[#1B1B1B] text-[13px] tracking-[0.1em] uppercase">
                  INGREDIENTS
                </p>

                {(slide.ingredients ?? [
                  "No Added Sugar",
                  "No Preservatives",
                  "No Artificial Flavors",
                ]).map((item, idx, arr) => (
                  <p key={item}>
                    {item}
                    {idx !== arr.length - 1 && ","}
                  </p>
                ))}
              </div>

              <button className="mt-12 w-full lg:px-8 cursor-pointer rounded-md bg-[#5E7163] py-4 text-[14px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#4D5E52] transition-colors shadow-lg">
                BUY NOW
              </button>
            </div>

            {/* CENTER */}
            <div className="relative flex flex-col items-center justify-center lg:col-span-4 mt-8 lg:mt-0 order-1 lg:order-2 w-full">

              <div className="relative flex items-center justify-center w-full max-w-[340px] aspect-[3/4]">
                {/* dashed container */}
                <div className="absolute inset-0 rounded-[50px] border border-dashed border-[#C5BBA4] w-[300px] h-[440px] mx-auto top-1/2 -translate-y-1/2" />

                {/* Bottle Image */}
                <div
                  key={animKey}
                  className="relative h-[520px] w-[340px] z-10 drop-shadow-2xl animate-fade-scale"
                >
                  <Image
                    src={slide.image || bottleImage}
                    alt={slide.title}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {/* BOTTOM CONTROLS */}
              <div className="mt-12 flex items-center justify-center gap-8">
                <button
                  onClick={prev}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#C5BBA4] text-[#666] hover:bg-white hover:text-[#111] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div className="text-center min-w-[120px]">
                  <p className="text-[12px] font-bold text-[#888] tracking-widest mb-1.5">{i + 1} / {safeSlides.length}</p>
                  <p className="text-[16px] font-bold text-[#222]">
                    {slide.carouselLabel}
                  </p>
                </div>

                <button
                  onClick={next}
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#C5BBA4] text-[#666] hover:bg-white hover:text-[#111] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-start text-left mt-8 lg:mt-0 order-3 w-full">
              <p className="text-[16px] font-medium leading-[1.7] text-[#444] w-full max-w-full lg:max-w-[320px]">
                {slide.tagline}
              </p>

              <div className="mt-12 flex flex-col w-full max-w-full lg:max-w-[340px]">
                <div className="w-full h-px border-t-[1.5px] border-dotted border-[#C5BBA4]" />

                <div className="flex">
                  <div className="flex-1 py-5 pr-5 border-r-[1.5px] border-dotted border-[#C5BBA4]">
                    <p className="text-[13px] font-medium text-[#777] mb-1.5">{slide.specs[0]?.line1}</p>
                    <p className="font-bold text-[#1B1B1B] text-[16px]">{slide.specs[0]?.line2}</p>
                  </div>
                  <div className="flex-1 py-5 pl-5">
                    <p className="text-[13px] font-medium text-[#777] mb-1.5">{slide.specs[1]?.line1}</p>
                    <p className="font-bold text-[#1B1B1B] text-[16px]">{slide.specs[1]?.line2}</p>
                  </div>
                </div>

                <div className="w-full h-px border-t-[1.5px] border-dotted border-[#C5BBA4]" />

                <div className="flex">
                  <div className="flex-1 py-5 pr-5 border-r-[1.5px] border-dotted border-[#C5BBA4]">
                    <p className="text-[13px] font-medium text-[#777] mb-1.5">{slide.specs[2]?.line1}</p>
                    <p className="font-bold text-[#1B1B1B] text-[16px]">{slide.specs[2]?.line2}</p>
                  </div>
                  <div className="flex-1 py-5 pl-5">
                    <p className="text-[13px] font-medium text-[#777] mb-1.5">{slide.specs[3]?.line1}</p>
                    <p className="font-bold text-[#1B1B1B] text-[16px]">{slide.specs[3]?.line2}</p>
                  </div>
                </div>

                <div className="w-full h-px border-t-[1.5px] border-dotted border-[#C5BBA4]" />
              </div>
            </div>

          </div>
        </section>
      </Container>
      <style jsx>{`
  .animate-fade-scale {
    animation: fadeScale 1s ease;
  }

  @keyframes fadeScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`}</style>
    </div>
  );
}

const fallbackSlides: HeroSlide[] = [
  {
    eyebrow: "Pure and Organic",
    title: "Raw Honey",
    tagline: "Get the best of nature — unprocessed, golden, and full of character.",
    image: bottleImage,
    carouselLabel: "Raw Honey",
    specs: [
      { line1: "Source", line2: "Wild Forest" },
      { line1: "Purity", line2: "100% Natural" },
      { line1: "Processing", line2: "Unprocessed" },
      { line1: "Taste Profile", line2: "Rich & Smooth" },
    ],
    ingredients: [
      "100% Raw Honey",
      "Natural Pollen",
      "Enzymes & Minerals",
    ],
  },
  {
    eyebrow: "Pure and Organic",
    title: "Forest Honey",
    tagline: "Sourced from deep forests with rich natural flavor.",
    image: bottleImage, // ✅ same image
    carouselLabel: "Forest Honey",
    specs: [
      { line1: "Source", line2: "Deep Forests" },
      { line1: "Purity", line2: "100% Pure" },
      { line1: "Processing", line2: "Raw & Natural" },
      { line1: "Taste Profile", line2: "Earthy & Robust" },
    ],
    ingredients: [
      "Wild Forest Honey",
      "Natural Nectar",
      "Trace Minerals",
    ],
  },
  {
    eyebrow: "Pure and Organic",
    title: "Organic Honey",
    tagline: "Crafted for purity and everyday wellness.",
    image: bottleImage, // ✅ same image
    carouselLabel: "Organic Honey",
    specs: [
      { line1: "Source", line2: "Certified Farms" },
      { line1: "Purity", line2: "100% Organic" },
      { line1: "Processing", line2: "Cold-Pressed" },
      { line1: "Taste Profile", line2: "Mild & Sweet" },
    ],
    ingredients: [
      "Certified Organic Honey",
      "No Pesticides",
      "Non-GMO",
    ],
  },
];

