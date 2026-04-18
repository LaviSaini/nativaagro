"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";
import Trustpilot from "../../../public/home/Trustpilot.png";
import Image from "next/image";



type Review = {
  name: string;
  text: string;
  rating: number; // 0..5
};

type Faq = {
  q: string;
  a: string;
};

function Stars({ rating }: { rating: number }) {
  const safe = Math.max(0, Math.min(5, rating));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`text-base leading-none ${i < safe ? "text-[#F6973F]" : "text-[#F6973F]/30"
            }`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="sr-only">{safe} out of 5 stars</span>
    </div>
  );
}

export default function LandingReviewsFaq() {
  const fallbackReviews: Review[] = useMemo(
    () => [
      {
        name: "Umar V",
        rating: 4,
        text:
          "After frequent use every morning I feel more relaxed and anxious free. The quality is incredible and the taste is so pure.",
      },
      {
        name: "Aisha K",
        rating: 5,
        text:
          "The flavor is rich and smooth. It feels like a premium product and the packaging is great too.",
      },
      {
        name: "Rahul S",
        rating: 4,
        text:
          "Crystallized naturally after a while which reassured me it’s real raw honey. Highly recommended.",
      },
    ],
    []
  );

  const [reviews, setReviews] = useState<Review[]>(fallbackReviews);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const faqs: Faq[] = useMemo(
    () => [
      {
        q: "1. What is raw honey?",
        a: "Raw honey is honey in its most natural form—minimally processed and typically unfiltered, retaining more enzymes, pollen, and nutrients.",
      },
      {
        q: "How is raw honey different from regular honey?",
        a: "Regular honey is often heated and filtered for appearance and shelf stability, which can reduce some naturally occurring enzymes and micronutrients.",
      },
      {
        q: "Does raw honey contain added sugar?",
        a: "Pure raw honey should not contain added sugar. Always check the label and source transparency.",
      },
      {
        q: "How should I store honey?",
        a: "Store it tightly sealed at room temperature away from direct sunlight. Avoid refrigeration to prevent speeding up crystallization.",
      },
      {
        q: "Is crystallization of honey normal?",
        a: "Yes—crystallization is natural and common in raw honey. Gently warm the jar in lukewarm water to return it to a liquid state.",
      },
      {
        q: "Can honey expire?",
        a: "Honey has a very long shelf life when stored properly. Over time it may darken or crystallize, but it remains safe to consume.",
      },
      {
        q: "Is raw honey safe for daily consumption?",
        a: "For most people, yes—moderation is key. If you have specific health conditions, consult your doctor.",
      },
      {
        q: "Can children consume honey?",
        a: "Honey should not be given to children under 12 months. For older children, it’s generally fine in moderation.",
      },
    ],
    [],
  );

  const [reviewIndex, setReviewIndex] = useState(0);
  const [open, setOpen] = useState(0);

  const r = reviews[reviewIndex] || reviews[0];

  // “Real time” refresh (simple polling). Keeps UI responsive with fallback.
  useEffect(() => {
    let active = true;
    let t: number | null = null;

    async function load() {
      setLoadingReviews(true);
      setReviewsError(null);
      try {
        const res = await fetch("/api/reviews?limit=6", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load reviews");
        const data = (await res.json()) as Array<{
          name?: string;
          rating?: number;
          text?: string;
        }>;
        const next = (data || [])
          .filter((x) => (x?.text || "").trim().length > 0)
          .map((x) => ({
            name: x.name || "Anonymous",
            rating: typeof x.rating === "number" ? x.rating : 5,
            text: x.text || "",
          }));
        if (active && next.length) {
          setReviews(next);
          setReviewIndex((idx) => (idx >= next.length ? 0 : idx));
        }
      } catch (e) {
        if (active) setReviewsError(e instanceof Error ? e.message : "Failed to load reviews");
      } finally {
        if (active) setLoadingReviews(false);
      }
    }

    void load();
    t = window.setInterval(load, 15000); // refresh every 15s
    return () => {
      active = false;
      if (t) window.clearInterval(t);
    };
  }, []);

  return (
    <>
      <section className="bg-[#F5EFE6]">
        <Container>
          <div className="py-20">
            <div className="grid items-center gap-6 sm:gap-16 md:grid-cols-12">

              {/* LEFT - REVIEW CARD */}
              <div className="relative md:col-span-6 overflow-visible">

                {/* Arrows */}
                {/* Arrows */}
                <div
                  className="
                  absolute -left-16 top-1/2 hidden -translate-y-1/2 flex-col gap-4 
                  md:flex
                  DesktopNavigation
                "
                >
                  <button
                    onClick={() =>
                      setReviewIndex((p) => (p - 1 + reviews.length) % reviews.length)
                    }
                    className="grid h-12 w-12 place-items-center cursor-pointer rounded-full border border-[#2B2B2B] text-[#2B2B2B] hover:bg-white"
                  >
                    ↑
                  </button>

                  <button
                    onClick={() =>
                      setReviewIndex((p) => (p + 1) % reviews.length)
                    }
                    className="grid h-12 w-12 place-items-center cursor-pointer rounded-full border border-[#2B2B2B] text-[#2B2B2B] hover:bg-white"
                  >
                    ↓
                  </button>
                </div>

                {/* Card */}
                <div className="relative rounded-[20px] bg-white/90 p-8 shadow-sm">

                  {/* Trustpilot badge */}
                  <div className="absolute -top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                    <Image
                      src={Trustpilot}
                      alt="Trustpilot"
                      className="object-contain"
                    />
                  </div>

                  {/* Name */}
                  <h3 className="text-[20px] font-semibold text-[#1F1F1F]">
                    {r.name}
                  </h3>

                  {/* Stars */}
                  <div className="mt-2">
                    <Stars rating={r.rating} />
                  </div>

                  {/* Text */}
                  <p className="mt-4 text-[16px] leading-7 text-[#5F5F5F]">
                    “{r.text}”
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4 md:hidden mobileNavigation">
                  <button
                    onClick={() =>
                      setReviewIndex((p) => (p - 1 + reviews.length) % reviews.length)
                    }
                    className="grid h-12 w-12 place-items-center rounded-full border cursor-pointer border-[#2B2B2B] text-[#2B2B2B] hover:bg-white"
                  >
                    ←
                  </button>

                  <button
                    onClick={() =>
                      setReviewIndex((p) => (p + 1) % reviews.length)
                    }
                    className="grid h-12 w-12 place-items-center cursor-pointer rounded-full border border-[#2B2B2B] text-[#2B2B2B] hover:bg-white"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="md:col-span-6">
                <h2 className="text-[56px] text-center md:text-left font-semibold leading-[64px] text-[#1F1F1F]">
                  Reviews
                </h2>

                <p className="mt-6 text-[18px] leading-[30px] text-[#4A4A4A]">
                  Creating a sustainable and environmentally conscious impact on the world is vital
                  to everything we do. In the built environment, we have a responsibility to our
                  communities and ecosystems to ensure our choices not only protect, but allow them
                  to flourish.
                </p>

                {/* Button */}
                <div className="mt-10">
                  <button className="rounded-md bg-[#5C6F63] px-10 cursor-pointer py-4 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90">
                    READ MORE
                  </button>
                </div>
              </div>

            </div>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          <div className="py-16">
            <div className="mt-16">

              {/* Heading */}
              <h2 className="text-center md:text-left text-[clamp(2.5rem,4vw,3.75rem)] font-semibold leading-tight tracking-[-0.02em] text-[color:var(--ink)]">
                FAQs
              </h2>

              {/* List */}
              <div className="mt-10 space-y-4">
                {faqs.map((f, idx) => {
                  const isOpen = idx === open;

                  return (
                    <div
                      key={f.q}
                      className={`
                  rounded-xl transition-all duration-300
                  ${isOpen
                          ? "bg-[color:var(--brand)] text-white shadow-md"
                          : "bg-transparent hover:bg-black/5"}
                `}
                    >
                      {/* Question */}
                      <button
                        type="button"
                        onClick={() => setOpen((p) => (p === idx ? -1 : idx))}
                        className="flex w-full items-center cursor-pointer gap-4 px-6 md:px-8 py-5 text-left"
                      >
                        <span
                          className={`
                      text-[20px] md:text-[22px] leading-snug font-medium
                      ${isOpen ? "text-white" : "text-[color:var(--ink)]"}
                    `}
                        >
                          {f.q}
                        </span>

                        {/* Divider */}
                        <span
                          className={`
                      ml-auto hidden h-px flex-1 border-t border-dashed
                      ${isOpen ? "border-white/70" : "border-[#97A7AE]"}
                      md:block
                    `}
                        />

                        {/* Icon */}
                        <span
                          className={`
                      ml-auto grid h-8 w-8 place-items-center rounded-md border text-sm transition
                      ${isOpen
                              ? "border-white text-white"
                              : "border-[color:var(--ink)] text-[color:var(--ink)]"}
                    `}
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>

                      {/* Answer */}
                      {isOpen && (
                        <div className="px-6 md:px-8 pb-6 md:pb-7">
                          <p className="max-w-[1100px] text-[16px] md:text-[17px] leading-relaxed tracking-[0.3px] text-white/90">
                            {f.a}{" "}
                            <Link
                              href="/contact"
                              className="underline underline-offset-4 hover:opacity-80"
                            >
                              Contact us
                            </Link>{" "}
                            if you have more questions.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

