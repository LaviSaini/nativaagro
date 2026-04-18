"use client";
import Image from "next/image";
import Container from "../ui/Container";
import { ButtonLink } from "../ui/Button";
import HoneyComb from "../../../public/home/honeycomb.png";
import HC1 from "../../../public/home/HC1.png";
import HC2 from "../../../public/home/HC2.png";
import HC3 from "../../../public/home/HC3.png";
import HC4 from "../../../public/home/HC4.png";

export default function HoneyHome() {

  const galleryImages = [
    HC1,
    HC2,
    HC3,
    HC4
  ];
  return (
    <section className="bg-white py-14 md:py-20">
      <Container>
        <div className="HoneyCombParentWrapper">
          <div className="HoneyCombWrapper">
            <div className="HoneyCombText" >
              <h2 className="text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.07] tracking-[-0.03em] text-[color:var(--ink)] HoneyCombTextHeading">
                From Hive to Home – Pure by Nature
              </h2>
              <div className="HoneyCombTextPara" >
                <p className=" text-base leading-[1.45] text-[color:var(--ink)] md:text-lg ">
                  At Nativa Agro, we believe that purity begins at the source. Our journey started
                  with a simple goal — to bring authentic, unprocessed honey directly from nature to
                  your home.
                </p>
                <p className=" text-base leading-[1.45] text-[color:var(--ink)] md:text-lg">
                  Sourced from carefully selected farms and natural beehives, our honey is collected
                  with minimal human interference to preserve its natural nutrients, rich taste, and
                  golden texture.
                </p>
                <p className=" text-base leading-[1.45] text-[color:var(--ink)] md:text-lg">
                  In a market filled with processed and diluted products, we focus on transparency, quality, and trust. Every drop of our honey reflects our commitment to keeping things simple, natural, and real.
                </p>
              </div>
              <div className="HoneyCombTextButton">
                <ButtonLink href="/about" className="min-w-[200px] px-10 py-3 text-base">
                  Learn More
                </ButtonLink>
              </div>
            </div>
            <div className=" HoneyCombTextPicture relative aspect-[525/505] w-full overflow-hidden rounded-[10px] bg-[color:var(--muted)] shadow-sm ring-1 ring-black/5">
              <Image
                src={HoneyComb}
                alt="Honey dripping from honeycomb"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6 lg:gap-10">
            {galleryImages.map((src) => (
              <div
                
                className="relative aspect-[277/380] w-full overflow-hidden rounded-xl bg-zinc-100 shadow-sm ring-1 ring-black/5"
              >
                <Image src={src} alt="Beekeeping and honey" fill className="object-cover" sizes="25vw" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}