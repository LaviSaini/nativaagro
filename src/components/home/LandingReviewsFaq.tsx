"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import Container from "@/components/ui/Container";

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
          className={`text-base leading-none ${
            i < safe ? "text-[#F6973F]" : "text-[#F6973F]/30"
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
    <section className="bg-[color:var(--muted)]">
      <Container>
      <div className="py-16">
        <div className="grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="relative rounded-[20px] bg-white/80 p-7 shadow-sm ring-1 ring-black/5">
              <div className="h-16 w-16 rounded-full bg-zinc-100" />
              <div className="mt-4">
                <Stars rating={r.rating} />
              </div>
              <p className="mt-3 text-[18px] leading-[180%] text-[color:var(--ink)]/60">
                “{r.text}”
              </p>
              <p className="mt-6 text-[24px] font-semibold leading-7 text-[color:var(--ink)]">
                {r.name}
              </p>

              <div className="absolute left-6 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() =>
                    setReviewIndex((p) => (p - 1 + reviews.length) % reviews.length)
                  }
                  className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--ink)] bg-white text-[color:var(--ink)]"
                  aria-label="Previous review"
                >
                  ←
                </button>
              </div>
              <div className="absolute left-6 top-1/2 translate-y-[calc(-50%+72px)]">
                <button
                  type="button"
                  onClick={() => setReviewIndex((p) => (p + 1) % reviews.length)}
                  className="grid h-12 w-12 place-items-center rounded-full border border-[color:var(--ink)] bg-white text-[color:var(--ink)]"
                  aria-label="Next review"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <h2 className="text-[60px] font-semibold leading-[72px] text-[color:var(--ink)]">
              Reviews
            </h2>
            <p className="mt-5 text-[18px] leading-[27px] text-[#212224]">
              Creating a sustainable and environmentally conscious impact on the world is vital
              to everything we do. We ensure our choices not only protect, but allow ecosystems
              to flourish.
            </p>
            {reviewsError ? (
              <p className="mt-4 text-sm text-red-700">{reviewsError}</p>
            ) : loadingReviews ? (
              <p className="mt-4 text-sm text-[color:var(--text)]">Loading latest reviews…</p>
            ) : null}
            <div className="mt-10">
              <ButtonLink href="/products" className="w-full max-w-[349px]">
                View All
              </ButtonLink>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-center text-[60px] font-semibold leading-[72px] text-[color:var(--ink)]">
            FAQs
          </h2>

          <div className="mt-10 space-y-4">
            {faqs.map((f, idx) => {
              const isOpen = idx === open;
              return (
                <div
                  key={f.q}
                  className={`rounded-[0px] ${
                    isOpen ? "bg-[color:var(--brand)] text-white" : "bg-transparent"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen((p) => (p === idx ? -1 : idx))}
                    className="flex w-full items-center gap-4 px-8 py-6 text-left"
                  >
                    <span
                      className={`text-[24px] leading-[29px] ${
                        isOpen ? "text-white" : "text-[color:var(--ink)]"
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`ml-auto hidden h-px flex-1 border-t ${
                        isOpen ? "border-white/80 border-dashed" : "border-[#97A7AE] border-dashed"
                      } md:block`}
                    />
                    <span
                      className={`ml-auto grid h-7 w-7 place-items-center rounded border ${
                        isOpen ? "border-white text-white" : "border-[color:var(--ink)] text-[color:var(--ink)]"
                      }`}
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen ? (
                    <div className="px-8 pb-7">
                      <p className="max-w-[1176px] text-[18px] leading-[26px] tracking-[0.715px] text-white">
                        {f.a}{" "}
                        <Link href="/contact" className="underline underline-offset-4">
                          Contact us
                        </Link>{" "}
                        if you have more questions.
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </Container>
    </section>
  );
}

