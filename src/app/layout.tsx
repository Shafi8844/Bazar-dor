import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";
import { getCategories, getProducts } from "@/lib/products";
import "react-toastify/dist/ReactToastify.css";
import "react-marquee-text/dist/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "বাজার দর",
  description: "প্রয়োজনীয় পণ্যের দাম এক নজরে",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <html
      lang="bn"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-36 border-b border-emerald-100 bg-white" />}>
              <Navbar categories={categories} products={products} />
            </Suspense>
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
