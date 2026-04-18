import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import HeaderGate from "@/components/HeaderGate";
import FooterGate from "@/components/FooterGate";

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
        <HeaderGate />
        <div className="min-h-[calc(100vh-72px)]">{children}</div>
        <FooterGate />
      </body>
    </html>
  );
}
