import { SkeletonCard } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-16 lg:px-8">
          <div className="space-y-4">
            <div className="skeleton h-7 w-48 rounded-full" />
            <div className="skeleton h-12 w-full max-w-xl" />
            <div className="skeleton h-5 w-full max-w-lg" />
            <div className="skeleton h-5 w-4/5 max-w-lg" />
            <div className="skeleton mt-4 h-12 w-40 rounded-lg" />
          </div>
          <div className="skeleton mx-auto h-64 w-64 rounded-full" />
        </div>
      </section>
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-6xl gap-3 overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="skeleton h-12 w-32 shrink-0 rounded-lg" />
          ))}
        </div>
      </section>
      <section className="bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="skeleton h-8 w-56" />
          <div className="skeleton mt-3 h-4 w-80 max-w-full" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
