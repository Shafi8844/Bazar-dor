export function SkeletonCard() {
  return (
    <div className="h-44 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <div className="skeleton size-14 rounded-lg" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="skeleton h-4 w-2/3" />
          <div className="skeleton h-3 w-1/3" />
        </div>
      </div>
      <div className="mt-8 h-px bg-slate-200" />
      <div className="mt-5 flex justify-between">
        <div className="skeleton h-7 w-28" />
        <div className="skeleton h-7 w-20 rounded-full" />
      </div>
    </div>
  );
}
