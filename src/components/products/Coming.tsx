import React from "react";
import Container from "@/components/ui/Container";
import Image from "next/image";
import Image1 from "../../../public/products/CS1.png";
import Image2 from "../../../public/products/CS2.png";
import Image3 from "../../../public/products/CS3.png";

export default function Coming({heading}: {heading?: string}) {
  const products = [
    {
      id: 1,
      name: "Product 1",
      image: Image1,
    },
    {
      id: 2,
      name: "Product 2",
      image: Image2,
    },
    {
      id: 3,
      name: "Product 3",
      image: Image3,
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <Container>
        <h2 className="text-center text-[36px] md:text-[42px] font-semibold text-[#1a1a1a] mb-10 tracking-tight">
          {heading ? heading : "Coming Soon"}
        </h2>

        <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center group cursor-pointer">
              <div className="relative w-full aspect-square rounded-[6px] overflow-hidden bg-[#f9f9f9] mb-4 shadow-sm border border-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
              </div>
              <h3 className="text-[17px] md:text-[19px] font-medium text-[#111] mt-2">
                {product.name}
              </h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
