import Link from "next/link";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import HeroCarousel, { type HeroSlide } from "@/components/home/HeroCarousel";
import { ButtonLink } from "@/components/ui/Button";
import Image from "next/image";
import LandingReviewsFaq from "@/components/home/LandingReviewsFaq";

async function getProducts(limit = 8) {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products`, { cache: "no-store" });
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
  const [products] = await Promise.all([getProducts()]);
  const heroSlides = buildHeroSlides(products);

  return (
    <main className="bg-white">
      {/* 1 — Hero carousel (first section, full cream + gold wash) */}
      <div
        className="border-b border-[color:var(--accent)]/20"
        style={{
          background:
            "linear-gradient(158.44deg, rgba(255, 182, 76, 0.28) -17.89%, rgba(255, 182, 76, 0) 38%), var(--surface)",
        }}
      >
        <Container>
          <HeroCarousel slides={heroSlides} />
        </Container>
      </div>

      {/* 2 — From Hive to Home */}
      <section className="bg-white py-14 md:py-20">
        <Container>
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-6">
              <h2 className="text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.07] tracking-[-0.03em] text-[color:var(--ink)]">
                From Hive to Home – Pure by Nature
              </h2>
              <p className="mt-6 text-base leading-[1.45] text-[color:var(--ink)] md:text-lg">
                At Nativa Agro, we believe that purity begins at the source. Our journey started
                with a simple goal — to bring authentic, unprocessed honey directly from nature to
                your home.
              </p>
              <p className="mt-4 text-base leading-[1.45] text-[color:var(--ink)] md:text-lg">
                Sourced from carefully selected farms and natural beehives, our honey is collected
                with minimal human interference to preserve its natural nutrients, rich taste, and
                golden texture.
              </p>
              <div className="mt-10">
                <ButtonLink href="/about" className="min-w-[200px] px-10 py-3 text-base">
                  Learn More
                </ButtonLink>
              </div>
            </div>
            <div className="md:col-span-6">
              <div className="relative aspect-[525/505] w-full overflow-hidden rounded-[10px] bg-[color:var(--muted)] shadow-sm ring-1 ring-black/5">
                <Image
                  src="/home/honeycomb-story.svg"
                  alt="Honey dripping from honeycomb"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3 — Four-image gallery row */}
      <section
        className="border-y border-[color:var(--accent)]/15 py-12 md:py-16"
        style={{
          background:
            "linear-gradient(180deg, var(--surface) 0%, #fffefb 50%, var(--surface) 100%)",
        }}
      >
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:gap-10">
            {galleryImages.map((src) => (
              <div
                key={src}
                className="relative aspect-[277/380] w-full overflow-hidden rounded-xl bg-zinc-100 shadow-sm ring-1 ring-black/5"
              >
                <Image src={src} alt="Beekeeping and honey" fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4 — Transparency / video block */}
      <section className="bg-[color:var(--surface)] py-14 md:py-20">
        <Container>
          <h2 className="mx-auto max-w-[700px] text-center text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-tight text-[#201914]">
            Complete transparency about our beekeeping practices
          </h2>
          <p className="mx-auto mt-5 max-w-[754px] text-center text-lg leading-relaxed text-[color:var(--text)]">
            Nestled in the heart of pristine landscapes, our apiary is a haven for honeybees,
            where they thrive, pollinate, and produce the finest honey you&apos;ll ever taste.
          </p>

          <Link
            href="/about"
            className="relative mx-auto mt-10 block max-w-[1170px] overflow-hidden rounded-[20px] shadow-md ring-1 ring-black/10"
            aria-label="Watch our beekeeping story"
          >
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(38.23deg, rgba(255, 182, 76, 0.35) 0%, rgba(255, 182, 76, 0) 52%)",
              }}
            />
            <Image
              src="/home/transparency-banner.svg"
              alt="Jars of honey on wooden shelves"
              width={1600}
              height={900}
              className="aspect-[16/9] w-full object-cover"
              priority={false}
            />
            <div className="absolute inset-0 z-20 grid place-items-center">
              <div
                className="grid h-20 w-20 place-items-center rounded-full shadow-lg"
                style={{
                  background:
                    "linear-gradient(66deg, rgba(255, 182, 76, 0.85) 0%, rgba(255, 182, 76, 0) 72%), rgba(255,255,255,0.25)",
                  backdropFilter: "blur(3px)",
                }}
              >
                <span className="pl-1 text-2xl font-semibold text-white">▶</span>
              </div>
            </div>
          </Link>
        </Container>
      </section>

      {/* Featured Products */}
      <section className="border-t border-zinc-200/80 bg-white">
        <Container>
          <div className="py-14 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl md:leading-[0.95]">
                Featured Products
              </h2>
              <Link
                href="/products"
                className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--text)] hover:text-[color:var(--ink)]"
              >
                Shop all
              </Link>
            </div>

            {products.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
                No products yet. Add products to your database to see them here.
              </div>
            ) : (
              <FeaturedGrid products={products} />
            )}
          </div>
        </Container>
      </section>

      <LandingReviewsFaq />

      <section className="border-t border-zinc-200/80 bg-white">
        <Container>
          <div className="py-14 md:py-16">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
                  Featured Blogs
                </h2>
                <p className="mt-3 max-w-xl text-base text-[color:var(--text)]">
                  Stories from nature—your go-to resource for wellness wisdom and industry updates.
                </p>
              </div>
              <Link
                href="/blogs"
                className="inline-flex min-h-[44px] items-center rounded-md bg-gradient-to-r from-[color:var(--brand)] to-[color:var(--brand-2)] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:brightness-[0.98]"
              >
                View all
              </Link>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Link
                  key={i}
                  href="/blogs"
                  className="group flex flex-col overflow-hidden rounded-[21px] border border-zinc-200/90 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[385/271] w-full bg-zinc-100">
                    <Image
                      src="/blogs/eco-friendly-beekeeping.svg"
                      alt=""
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5 pt-6">
                    <span className="inline-flex w-fit rounded-full bg-[color:var(--accent)] px-4 py-1.5 text-sm text-[#201914]">
                      Beekeeping
                    </span>
                    <p className="mt-3 text-sm text-[color:var(--text)]">January 5, 2024</p>
                    <p className="mt-2 text-xl font-semibold leading-snug text-[#201914]">
                      Our Eco-Friendly Beekeeping Sustainability Practices
                    </p>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-[color:var(--text)]">
                      Nestled in the heart of pristine landscapes, our apiary is a haven for
                      honeybees.
                    </p>
                    <p className="mt-4 text-base font-medium text-[#201914] underline decoration-[color:var(--accent)] underline-offset-4">
                      Read full post
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

function FeaturedGrid({
  products,
}: {
  products: Array<{ _id: string; name: string; price: number; description?: string }>;
}) {
  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.slice(0, 3).map((p) => (
        <ClientProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}

function ClientProductCard({
  product,
}: {
  product: { _id: string; name: string; price: number; description?: string };
}) {
  return <ProductCard product={product} showQuickView />;
}
