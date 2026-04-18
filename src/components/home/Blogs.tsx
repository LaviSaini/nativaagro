"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Blog from "../../../public/home/Blog.png";
import Image from "next/image";


export default function Blogs() {


    return (
        <section className="border-t border-zinc-200/80 bg-white">
            <Container>
                <div className="py-14 md:py-16">

                    {/* Header */}
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

                    {/* Cards */}
                    <div className="mt-10 grid gap-8 md:grid-cols-3">
                        {[0, 1, 2].map((i) => (
                            <Link
                                key={i}
                                href="/blogs"
                                className="group flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative aspect-[385/271] w-full overflow-hidden rounded-[20px]">

                                    <Image
                                        src={Blog}
                                        alt=""
                                        fill
                                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                        sizes="33vw"
                                    />

                                    {/* Badge */}
                                    <span className="absolute left-4 top-4 rounded-full bg-[#F4A940] px-4 py-1 text-xs font-medium text-black">
                                        Beekeeping
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="mt-4 flex flex-1 flex-col">

                                    <p className="text-sm text-[#7A7A7A]">
                                        January 5, 2024
                                    </p>

                                    <h3 className="mt-2 text-[18px] font-semibold leading-snug text-[#1F1F1F]">
                                        Our Eco-Friendly Beekeeping Sustainability Practices
                                    </h3>

                                    <p className="mt-3 text-[15px] leading-relaxed text-[#6B6B6B]">
                                        Nestled in the heart of pristine landscapes, our apiary is a haven for honeybees.
                                    </p>

                                    <span className="mt-4 text-sm font-medium text-[#201914] underline underline-offset-4 decoration-[#FFB64C]">
                                        Read full post
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
}

