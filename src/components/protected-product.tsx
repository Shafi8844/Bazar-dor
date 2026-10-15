"use client";

import { LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useAuth } from "./auth-context";

export function ProtectedProduct({ children }: { children: React.ReactNode }) {
  const { ready, user } = useAuth();

  if (!ready) {
    return (
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-72 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 bg-slate-50">
        <section className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4 py-12 text-center sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <LockKeyhole className="mx-auto size-10 text-emerald-700" />
            <h1 className="mt-4 text-3xl font-black text-slate-950">এই পণ্যের বিস্তারিত দেখতে লগ ইন করুন</h1>
            <p className="mt-3 text-slate-600">বাজারভিত্তিক দাম ও সারাংশ শুধুমাত্র সাইন ইন করা ব্যবহারকারীর জন্য।</p>
            <Link href="/signin" className="mt-6 inline-flex h-11 items-center rounded-lg bg-emerald-600 px-5 font-extrabold text-white transition hover:bg-emerald-700">
              সাইন ইন
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return <>{children}</>;
}
