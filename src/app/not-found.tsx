import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-6xl font-black text-emerald-700">৪০৪</p>
        <h1 className="mt-4 text-3xl font-black text-slate-950">পাতাটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-3 text-slate-600">লিংকটি ভুল হতে পারে অথবা পাতাটি সরানো হয়েছে।</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-emerald-600 px-5 font-extrabold text-white transition hover:bg-emerald-700"
        >
          হোম পেজে ফিরে যান
        </Link>
      </section>
    </main>
  );
}
