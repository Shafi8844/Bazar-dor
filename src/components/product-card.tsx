import Link from "next/link";
import { changeValue, formatTaka, type Product, unitLabel } from "@/lib/products";
import { ChangeBadge } from "./change-badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-amber-50 text-3xl ring-1 ring-amber-100">
          {product.image}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-extrabold text-slate-950 group-hover:text-emerald-700">{product.nameBn}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">{unitLabel(product.unit)}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">আজকের দাম</p>
          <p className="mt-1 text-2xl font-black text-rose-600">{formatTaka(product.today)}</p>
        </div>
        <ChangeBadge change={changeValue(product)} />
      </div>
    </Link>
  );
}
