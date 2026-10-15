"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

export function UpdateProfileForm() {
  const router = useRouter();
  const { data: session, isPending, refetch } = authClient.useSession();
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = (name ?? session?.user.name ?? "").trim();
    if (!nextName) {
      toast.error("নাম লিখুন।");
      return;
    }

    setLoading(true);
    try {
      const result = await authClient.updateUser({ name: nextName });
      if (result.error) throw new Error(result.error.message || "তথ্য আপডেট করা যায়নি।");
      await refetch();
      toast.success("প্রোফাইলের তথ্য আপডেট হয়েছে।");
      router.push("/profile");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "তথ্য আপডেট করা যায়নি।");
    } finally {
      setLoading(false);
    }
  }

  if (isPending) {
    return (
      <main className="flex-1 bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-64 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </main>
    );
  }

  if (!session?.user) return null;

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <Link href="/profile" className="text-sm font-extrabold text-emerald-700 hover:text-emerald-800">
            ← আমার প্রোফাইলে ফিরুন
          </Link>
          <h1 className="mt-4 text-3xl font-black text-slate-950">প্রোফাইলের তথ্য আপডেট</h1>

          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">নাম</span>
              <input
                name="name"
                value={name ?? session.user.name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-emerald-500"
                placeholder="আপনার নাম"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-emerald-600 px-5 font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
