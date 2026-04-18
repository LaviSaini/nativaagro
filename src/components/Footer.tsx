"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/home/logo.png";

import Honey1 from "../../public/home/Honey1.png";
import Honey2 from "../../public/home/Honey2.png";
import Honey3 from "../../public/home/Honey3.png";

export default function Footer() {
  return (
    <footer className="mt-0">
      {/* Middle */}
      <div
        className="border-t border-[color:var(--accent)]/15 py-14"
        style={{ background: "#EDEBE4" }}
      >
        <div className="mx-auto max-w-[1240px] px-4 sm:px-5">

          {/* TOP SECTION */}
          <div className="grid items-start gap-10 md:grid-cols-2">

            {/* LEFT */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#795900]">
                Our Heritage
              </p>

              <div className="mt-3">
                <Image src={Logo} alt="Nativa Agro" className="h-10 object-contain" />
              </div>

              <p className="mt-5 max-w-md text-[16px] leading-[26px] text-[#3F3F3F]">
                Defined by nature, harvested with integrity. We bridge the gap
                between organic rurality and modern luxury through every jar
                of golden nectar.
              </p>
            </div>

            {/* RIGHT IMAGES */}
            <div className="flex gap-6 md:justify-end">

              {[
                { img: Honey1, label: "Wild Honey" },
                { img: Honey2, label: "Artisan Oils" },
                { img: Honey3, label: "Rare Nectars" },
              ].map((item, i) => (
                <div key={i} className="text-center">

                  <div className="relative h-[140px] w-[110px] overflow-hidden rounded-[16px]">
                    <Image
                      src={item.img}
                      alt={item.label}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#3F3F3F]">
                    {item.label}
                  </p>
                </div>
              ))}

            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            {/* LINKS */}
            <div className="flex gap-10 text-sm font-semibold text-[#1B1B1B]">
              <Link href="/">Home</Link>
              <Link href="/about">About Us</Link>
              <Link href="/products">Shop All</Link>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-4">
              <p className="text-xs uppercase tracking-wide text-[#6B6B6B]">
                Stay Connected
              </p>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="relative"
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-[260px] rounded-xl bg-white px-5 py-3 pr-12 text-sm outline-none"
                />

                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-[#163429] text-white cursor-pointer hover:opacity-90"
                >
                  →
                </button>
              
            </form>
          </div>

        </div>
      </div>
    </div>

      {/* Bottom bar */ }
  <div className="bg-[#54645C] py-5 text-white">
    <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 px-4 sm:px-5 md:flex-row">
      <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-[0.15em]">
        <Link href="/privacy" className="hover:opacity-90">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:opacity-90">
          Terms of Service
        </Link>
        <Link href="/accessibility" className="hover:opacity-90">
          Accessibility
        </Link>
      </div>
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.15em] opacity-80">
        © {new Date().getFullYear()} 2026 Nativa Agro. All rights reserved. Crafted for the Digital Estate.
      </p>
      <div className="flex items-center gap-3">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#54645C] hover:opacity-95"
          aria-label="Facebook"
        >
          <span className="text-sm font-bold">f</span>
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#54645C] hover:opacity-95"
          aria-label="Instagram"
        >
          <span className="text-xs font-bold">in</span>
        </a>
      </div>
    </div>
  </div>
    </footer >
  );
}
