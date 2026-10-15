import Link from "next/link";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ChangeBadge } from "@/components/change-badge";
import { changeValue, formatTaka, getProductBySlug, getProducts, marketAverage, toBanglaNumber, unitLabel } from "@/lib/products";
import { auth } from "@/lib/auth";

export const instant = false;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    const query = new URLSearchParams({
      callbackURL: `/product/${encodeURIComponent(slug)}`,
      authRequired: "1",
    });
    redirect(`/signin?${query.toString()}`);
  }

  const min = Math.min(...product.markets.map((market) => market.min));
  const max = Math.max(...product.markets.map((market) => market.max));
  const avg = marketAverage(product);

  return (
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/" className="text-sm font-extrabold text-emerald-700">← হোমে ফিরুন</Link>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <span className="grid size-20 place-items-center rounded-lg bg-amber-50 text-5xl ring-1 ring-amber-100">{product.image}</span>
                <div>
                  <h1 className="text-4xl font-black text-slate-950">{product.nameBn}</h1>
                  <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                    {product.categoryNameBn} ক্যাটাগরির এই পণ্যের আজকের বাজারদর {formatTaka(product.today)}। গতকাল ছিল {formatTaka(product.yesterday)}।
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-extrabold text-emerald-700">{product.categoryNameBn}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-extrabold text-slate-700">{unitLabel(product.unit)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["সর্বনিম্ন দাম", min],
                ["সর্বোচ্চ দাম", max],
                ["গড় দাম", avg],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-extrabold text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-black text-rose-600">{formatTaka(Number(value))}</p>
                </div>
              ))}
            </div>
          </div>

          <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-950">বাজারভিত্তিক আজকের দাম</h2>
                <p className="mt-1 text-slate-600">ঢাকার কয়েকটি বাজারের সম্ভাব্য সর্বনিম্ন, সর্বোচ্চ ও গড় দাম।</p>
              </div>
              <ChangeBadge change={changeValue(product)} />
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[680px] border-separate border-spacing-0 text-left">
                <thead>
                  <tr className="bg-slate-100 text-sm text-slate-600">
                    <th className="rounded-l-lg px-4 py-3 font-extrabold">বাজার</th>
                    <th className="px-4 py-3 font-extrabold">সর্বনিম্ন</th>
                    <th className="px-4 py-3 font-extrabold">সর্বোচ্চ</th>
                    <th className="px-4 py-3 font-extrabold">গড়</th>
                    <th className="rounded-r-lg px-4 py-3 font-extrabold">বিভাগ</th>
                  </tr>
                </thead>
                <tbody>
                  {product.markets.map((market, index) => (
                    <tr key={`${market.market}-${market.division}`} className={index !== product.markets.length - 1 ? "border-b border-slate-100" : ""}>
                      <td className="px-4 py-4 font-extrabold text-slate-900">{market.market}</td>
                      <td className="px-4 py-4 text-slate-700">{formatTaka(market.min)}</td>
                      <td className="px-4 py-4 text-slate-700">{formatTaka(market.max)}</td>
                      <td className="px-4 py-4 font-black text-rose-600">{formatTaka(Math.round((market.min + market.max) / 2))}</td>
                      <td className="px-4 py-4 text-slate-600">{market.division}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs font-semibold text-slate-400">শেষ আপডেট: {toBanglaNumber("14 Oct 2026")}</p>
          </section>
        </section>
      </main>
  );
}
