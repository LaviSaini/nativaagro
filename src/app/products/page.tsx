import Image from "next/image";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/products/ProductCard";
import { ProductsToolbar } from "./toolbar";
import { getStoreCategories, getStoreProductsList } from "@/lib/server-products";
import HeroImage from "../../../public/products/banner2.png"; // 👈 apni image use karo
import LandingReviewsFaq from "@/components/home/LandingReviewsFaq";
import Coming from "@/components/products/Coming";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; sort?: string }>;
}) {
  const { search, category, sort } = await searchParams;

  const [products, categories] = await Promise.all([
    getStoreProductsList({ search, categorySlug: category }),
    getStoreCategories(),
  ]);

  const sorted = [...products];
  if (sort === "price_asc") sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sort === "price_desc") sorted.sort((a, b) => (b.price || 0) - (a.price || 0));

  return (
    <main className="bg-white">

      {/* 🔥 HERO SECTION */}
      <div className="relative h-[400px] md:h-400px] w-full overflow-hidden">
        <Image
          src={HeroImage}
          alt="Products Hero"
          fill
          priority
          className="object-cover"
        />

        {/* Text */}
        <div className="absolute inset-0 flex items-center">
          <Container>
            <div className="text-white mt-[40px] md:mt-[60px] lg:mt-[160px] ">
              <h1 className="text-[40px] md:text-[52px] font-semibold leading-[1.1]">
                Get To Know <br /> The Range
              </h1>
            </div>
          </Container>
        </div>
      </div>

      {/* 🔽 EXISTING CONTENT (UNCHANGED) */}
      <Container>
        <div className="py-12">

          <ProductsToolbar
            categories={categories}
            activeCategory={category || ""}
            search={search || ""}
            sort={sort || ""}
            totalProducts={sorted.length}
          />

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((product) => (
              <ProductCard key={product._id} product={product} showQuickView />
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
              No products found.
            </div>
          ) : null}

        </div>
      </Container>
      <Coming heading="Coming Soon" />
      <LandingReviewsFaq />
    </main>
  );
}