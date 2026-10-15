"use client";

import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function ProfileView() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-extrabold text-emerald-700">বাজার দর অ্যাকাউন্ট</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">আমার প্রোফাইল</h1>

          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50 text-emerald-800">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={`${user.name} প্রোফাইল ছবি`}
                  width={96}
                  height={96}
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-4xl font-black">
                  {user.name.charAt(0).toUpperCase() || <UserRound className="size-10" />}
                </span>
              )}
            </div>

            <dl className="min-w-0 flex-1 space-y-4">
              <div>
                <dt className="text-sm font-bold text-slate-500">নাম</dt>
                <dd className="mt-1 break-words text-lg font-extrabold text-slate-900">{user.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-bold text-slate-500">ইমেইল</dt>
                <dd className="mt-1 break-words text-slate-700">{user.email}</dd>
              </div>
            </dl>
          </div>

          <Link
            href="/profile/update"
            className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 font-extrabold text-white transition hover:bg-emerald-700"
          >
            তথ্য আপডেট করুন
          </Link>
        </div>
      </section>
    </main>
  );
}
