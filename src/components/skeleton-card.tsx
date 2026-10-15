export function SkeletonCard() {
  return (
    <div className="h-44 animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="size-14 rounded-lg bg-slate-200" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
      <div className="mt-8 h-px bg-slate-200" />
      <div className="mt-5 flex justify-between">
        <div className="h-7 w-28 rounded bg-slate-200" />
        <div className="h-7 w-20 rounded-full bg-slate-200" />
      </div>
    </div>
  );
}
