"use client";

import Container from "../ui/Container";
import Link from "next/link";
import ProductCard from "../products/ProductCard";
import HoneyBottle from "../../../public/home/HoneyBottle.png";


type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  image?: any;
};

export default function Featured({ data }: { data: Product[] }) {
  const products = data; 

 const dummyProducts: Product[] = [
    {
      _id: "1",
      name: "Raw Honey 250g",
      price: 299,
      description: "Pure natural honey",
      image: HoneyBottle,
    },
    {
      _id: "2",
      name: "Raw Honey 500g",
      price: 499,
      description: "Rich & smooth taste",
      image: HoneyBottle,
    },
    {
      _id: "3",
      name: "Organic Forest Honey",
      price: 699,
      description: "Wild sourced honey",
      image: HoneyBottle,
    },
  ];

  

  return (
    <section className="border-t border-zinc-200/80 bg-white">
      <Container>
        <div className="py-14 md:py-16">
          
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-4xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
              Featured Products
            </h2>

            {/* <Link
              href="/products"
              className="text-sm font-medium uppercase tracking-[0.2em] text-[color:var(--text)] hover:text-[color:var(--ink)]"
            >
              Shop all
            </Link> */}
          </div>

          {dummyProducts.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-10 text-sm text-zinc-600">
              No products yet. Add products to your database to see them here.
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dummyProducts.slice(0, 3).map((p) => (
                <ProductCard key={p._id} product={p} showQuickView />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}