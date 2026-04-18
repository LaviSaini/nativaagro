import HeroCarousel, { type HeroSlide } from "@/components/home/HeroCarousel";
import LandingReviewsFaq from "@/components/home/LandingReviewsFaq";
import HoneyHome from "@/components/home/HoneyHome";
import HoneyVideo from "@/components/home/HoneyVideo";
import Featured from "@/components/home/Featured";
import Blogs from "@/components/home/Blogs";

type FetchProductsOpts = { limit?: number; category?: string };

async function getProducts(opts: FetchProductsOpts | number = {}) {
  const o: FetchProductsOpts = typeof opts === "number" ? { limit: opts } : opts;
  const limit = o.limit ?? 8;
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const url = new URL(`${base}/api/products`);
    if (o.category) {
      url.searchParams.set("category", o.category);
    }
    if (limit > 0) {
      url.searchParams.set("limit", String(limit));
    }
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

async function getBlogs(limit = 3) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const url = new URL(`${base}/api/blogs`);
    if (limit > 0) {
      url.searchParams.set("limit", String(limit));
    }
    const res = await fetch(url.toString(), {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

function buildHeroSlides(
  products: Array<{ image?: string; name?: string; price?: number; description?: string }>,
): HeroSlide[] {
  const safe = (products || []).slice(0, 3);
  const fallback = [
    {
      name: "Raw Honey 250g",
      description: "Bringing pure, unprocessed honey straight from nature to your home, naturally.",
      image: "/products/raw-honey-250g.svg",
      price: 300,
    },
    {
      name: "Raw Honey 500g",
      description: "Unfiltered and unprocessed for maximum nutrients—rich, smooth taste.",
      image: "/products/raw-honey-500g.svg",
      price: 520,
    },
    {
      name: "Featured Product",
      description: "Curated for daily wellness—pure ingredients, honest sourcing.",
      image: "/banners/honey-hero-1.svg",
      price: 0,
    },
  ];

  return (safe.length ? safe : fallback).slice(0, 3).map((p, idx) => {
    const title = p.name || fallback[idx]?.name || "Raw Honey";
    const tagline = p.description || fallback[idx]?.description || "Pure, unprocessed honey.";
    const image = p.image || fallback[idx]?.image || "/products/raw-honey-250g.svg";
    const price = typeof p.price === "number" ? p.price : fallback[idx]?.price || 0;

    return {
      eyebrow: "Pure and Organic",
      title,
      tagline,
      image,
      carouselLabel: "Raw Honey",
      specs: [
        { line1: "Get Once", line2: price ? `₹ ${price}` : "See details" },
        { line1: "No Added Sugar", line2: "Pure & natural" },
        { line1: "No Preservatives", line2: "Clean label" },
        { line1: "Sustainably Sourced", line2: "From hive to home" },
      ],
    } satisfies HeroSlide;
  });
}

export default async function Home() {
  const [heroProducts, featuredHoney, homeBlogs] = await Promise.all([
    getProducts({ limit: 8 }),
    getProducts({ limit: 3, category: "honey" }),
    getBlogs(3),
  ]);

  const heroSlides = heroProducts.length ? buildHeroSlides(heroProducts) : undefined;

  return (
    <main className="bg-white">
      <HeroCarousel slides={heroSlides} />

      <HoneyHome />
      <HoneyVideo />
      <Featured products={featuredHoney} />
      <LandingReviewsFaq />
      <Blogs posts={homeBlogs} />
    </main>
  );
}
