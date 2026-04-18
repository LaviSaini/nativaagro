import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import FooterWrapper from "@/components/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nativa Agro",
  description: "Nativa Agro is a family-owned business dedicated to providing high-quality, natural honey products sourced directly from local beekeepers. Our mission is to promote sustainable beekeeping practices and support the health of our pollinators while delivering pure, delicious honey to our customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense fallback={<div className="h-[120px] border-b border-zinc-200 bg-white" />}>
          <HeaderWrapper />
        </Suspense>
        <div className="min-h-[calc(100vh-72px)]">{children}</div>
        <Suspense fallback={null}>
          <FooterWrapper />
        </Suspense>
      </body>
    </html>
  );
}
