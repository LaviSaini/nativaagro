"use client";

import Link from "next/link";

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3C8 6 5 10 5 14c0 3.5 2.5 6 6 6 1.5 0 3-.4 4.2-1.2C19 16.5 20 12 19 8c-1-3-4-5-7-5z"
        fill="#4E5F57"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-0">
      {/* Middle */}
      <div
        className="border-t border-[color:var(--accent)]/15 py-14"
        style={{ background: "rgba(119, 140, 110, 0.1)" }}
      >
        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-5 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#795900]">
              Our Heritage
            </p>
            <div className="mt-3 flex items-center gap-2">
              <LeafIcon />
              <span className="text-2xl font-semibold text-[color:var(--ink)]">Native</span>
            </div>
            <p className="mt-5 max-w-md text-lg font-light leading-relaxed text-[#010101]">
              Defined by nature, harvested with integrity. We bridge the gap between organic
              rurality and modern luxury through every jar of golden nectar.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[color:var(--ink)]">
              Explore
            </h3>
            <ul className="mt-5 space-y-3 text-base font-medium text-[color:var(--ink)]">
              <li>
                <Link className="hover:underline" href="/">
                  Home
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/about">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/products">
                  Shop All
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/blogs">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="hover:underline" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#414845]">
              Stay connected
            </p>
            <form
              className="relative mt-4"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="overflow-hidden rounded-2xl bg-[#F9F9F9] shadow-sm ring-1 ring-black/5">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-transparent px-5 py-4 pr-14 text-sm text-[color:var(--ink)] placeholder:text-[#414845]/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-2xl bg-[#163429] text-white hover:opacity-95"
                aria-label="Subscribe"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
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
            © {new Date().getFullYear()} Nativa Agro. All rights reserved.
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
    </footer>
  );
}
