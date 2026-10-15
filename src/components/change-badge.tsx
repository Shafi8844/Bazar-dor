import { changeLabel } from "@/lib/products";

export function ChangeBadge({ change }: { change: number }) {
  const color =
    change > 0
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : change < 0
        ? "border-rose-200 bg-rose-50 text-rose-700"
        : "border-slate-200 bg-slate-100 text-slate-600";

  return (
    <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-bold ${color}`}>
      {changeLabel(change)}
    </span>
  );
}
