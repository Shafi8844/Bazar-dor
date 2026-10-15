import { SkeletonCard } from "@/components/skeleton-card";

export default function Loading() {
  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="skeleton h-12 w-12 rounded-lg" />
        <div className="skeleton mt-4 h-9 w-44" />
        <div className="skeleton mt-3 h-4 w-72 max-w-full" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
