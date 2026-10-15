import Link from "next/link";
import { CategoryList } from "@/components/category-list";
import { getCategories, getCategory, getProducts } from "@/lib/products";

export const instant = false;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, categoryProducts] = await Promise.all([
    getCategory(slug).catch(() => null),
    getProducts(slug).catch(() => []),
  ]);

  if (!category || categoryProducts.length === 0) {
    return (
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-12 text-center sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-6xl">404</p>
            <h1 className="mt-4 text-3xl font-black text-slate-950">এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি</h1>
            <p className="mt-3 text-slate-600">ক্যাটাগরি লিংকটি ভুল হতে পারে অথবা এখনো পণ্য যোগ করা হয়নি।</p>
            <Link href="/" className="mt-6 inline-flex h-11 items-center rounded-lg bg-emerald-600 px-5 font-extrabold text-white transition hover:bg-emerald-700">
              হোম পেজে ফিরে যান
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-5xl">{category.icon}</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">{category.nameBn}</h1>
        <p className="mt-2 text-slate-600">এই ক্যাটাগরির পণ্যগুলো দাম অনুযায়ী সাজিয়ে দেখুন।</p>
        <CategoryList products={categoryProducts} />
      </section>
    </main>
  );
}
