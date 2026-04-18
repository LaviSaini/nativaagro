import Link from "next/link";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import HeroCarousel, { type HeroSlide } from "@/components/home/HeroCarousel";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";
import LandingReviewsFaq from "@/components/home/LandingReviewsFaq";
import HoneyHome from "@/components/home/HoneyHome";
import HoneyVideo from "@/components/home/HoneyVideo";
import Featured from "@/components/home/Featured";
import Blogs from "@/components/home/Blogs";

async function getProducts(limit = 8) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${base}/api/products`, {
      next: { revalidate: 60 }, // ✅ caching (important)
    });

    if (!res.ok) return [];
    const data = await res.json();

    return data.slice(0, limit);
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

const galleryImages = [
  "/home/photo-1.svg",
  "/home/photo-2.svg",
  "/home/photo-3.svg",
  "/home/photo-4.svg",
];

export default async function Home() {
  const products = await getProducts(); // ✅ clean
const heroSlides = products.length ? buildHeroSlides(products) : undefined;
  return (
    <main className="bg-white">

      <HeroCarousel slides={heroSlides} />


      {/* 2 — From Hive to Home */}
      <HoneyHome />
      <HoneyVideo />
      <Featured data={products} />
      <LandingReviewsFaq />
      <Blogs />


    </main>
  );
}
