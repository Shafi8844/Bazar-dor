
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { changeValue, getCategories, getProducts, type Product } from "@/lib/products";

export default async function Home() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  const risers = [...products].sort((a, b) => changeValue(b) - changeValue(a)).slice(0, 6);
  const fallers = [...products].sort((a, b) => changeValue(a) - changeValue(b)).slice(0, 6);

  return (
    <main className="flex-1">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-16 lg:px-8">
          <div>
            <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-extrabold text-amber-800">
              আজকের তাজা বাজার আপডেট
            </p>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              নিত্যপ্রয়োজনীয় পণ্যের দাম এখন এক জায়গায়
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              চাল, ডাল, তেল, সবজি, মাছ-মাংস ও মসলার সর্বশেষ বাজারদর দেখে দ্রুত সিদ্ধান্ত নিন।
            </p>
            <a
              href="#সব-পণ্য"
              className="mt-7 inline-flex h-12 items-center rounded-lg bg-emerald-600 px-6 font-extrabold text-white shadow-sm transition hover:bg-emerald-700"
            >
              সব পণ্য দেখুন
            </a>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-x-10 bottom-4 h-12 rounded-full bg-emerald-200 blur-2xl" />
            <Image
              src="/bazar-hero.png"
              alt="বাজারের ঝুড়িতে ফল ও সবজি"
              width={315}
              height={263}
              priority
              className="relative mx-auto h-auto w-full max-w-[315px]"
            />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-x-auto px-4 py-5 sm:px-6 lg:px-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`} className="flex shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-extrabold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-emerald-700">
              <span>{category.icon}</span>
              {category.nameBn}
            </Link>
          ))}
        </div>
      </section>

      <ProductSection title="আজ দাম বেড়েছে ▲" subtitle="সর্বোচ্চ ঊর্ধ্বমুখী ৬টি পণ্যের দ্রুত তালিকা" products={risers} />
      <ProductSection title="আজ দাম কমেছে ▼" subtitle="আজ যেসব পণ্যে বাজারে কিছুটা স্বস্তি" products={fallers} muted />

      <section id="সব-পণ্য" className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-black text-slate-950">সব পণ্য</h2>
            <p className="mt-2 text-slate-600">প্রতিদিনের প্রয়োজনীয় পণ্যের বর্তমান বাজারদর, একক ও পরিবর্তনের হার।</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ProductSection({
  title,
  subtitle,
  products,
  muted = false,
}: {
  title: string;
  subtitle: string;
  products: Product[];
  muted?: boolean;
}) {
  return (
    <section className={muted ? "bg-slate-50 py-12" : "bg-white py-12"}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black text-slate-950">{title}</h2>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
