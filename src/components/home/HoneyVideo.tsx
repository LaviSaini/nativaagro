"use client";
import Image from "next/image";
import Container from "../ui/Container";
import { ButtonLink } from "../ui/Button";
import VideoImage from "../../../public/home/VideoImage.png";

import Link from "next/link";

export default function HoneyVideo() {

  return (
      <section className="bg-surface py-14 md:py-20">
        <Container>
          <h2 className="mx-auto VideoSectionHeading text-[clamp(1.75rem,3.5vw,3rem)] font-semibold leading-tight text-[#201914]">
            Complete transparency about our beekeeping practices
          </h2>
          <p className="mx-auto VideoSectionSubheading mt-5 text-center text-lg leading-relaxed text-text">
            Nestled in the heart of pristine landscapes, our apiary is a haven for honeybees,
            where they thrive, pollinate, and produce the finest honey you&apos;ll ever taste.
          </p>

          <Link
            href="/about"
            className="relative mx-auto mt-10 block max-w-[1000px] overflow-hidden rounded-[20px] shadow-md ring-1 ring-black/10"
            aria-label="Watch our beekeeping story"
          >
            <div
              className="pointer-events-none absolute inset-0 z-10"

            />
            <Image
              src={VideoImage}
              alt="Jars of honey on wooden shelves"
              width={1000}
              height={600}
              className="w-full object-cover"
              priority={false}
            />
          </Link>
        </Container>
      </section>
  );
}