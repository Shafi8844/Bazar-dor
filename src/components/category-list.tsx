"use client";

import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "./product-card";
import { type Product } from "@/lib/products";

type SortMode = "default" | "asc" | "desc";

export function CategoryList({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortMode>("default");

  const sorted = useMemo(() => {
    const next = [...products];
    if (sort === "asc") next.sort((a, b) => a.today - b.today);
    if (sort === "desc") next.sort((a, b) => b.today - a.today);
    return next;
  }, [products, sort]);

  return (
    <>
      <div className="mt-6 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-slate-700">
          <SlidersHorizontal className="size-4" />
          সাজান:
        </span>
        <div className="flex flex-wrap gap-2">
          {[
            ["default", "ডিফল্ট"],
            ["asc", "দাম: কম থেকে বেশি"],
            ["desc", "দাম: বেশি থেকে কম"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setSort(value as SortMode)}
              className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                sort === value ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-emerald-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((product) => <ProductCard key={product.slug} product={product} />)}
      </div>
    </>
  );
}
