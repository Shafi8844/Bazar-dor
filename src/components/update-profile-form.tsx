"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
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
        <div className="card border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="card-body p-6 sm:p-8">
          <Link href="/profile" className="text-sm font-extrabold text-emerald-700 hover:text-emerald-800">
            ← আমার প্রোফাইলে ফিরুন
          </Link>
          <h1 className="mt-4 text-3xl font-black text-slate-950">প্রোফাইলের তথ্য আপডেট</h1>

          <form className="mt-6 space-y-5" onSubmit={onSubmit}>
            <fieldset className="fieldset gap-1">
              <legend className="fieldset-legend text-sm font-bold text-slate-700">নাম</legend>
              <input
                name="name"
                value={name ?? session.user.name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                className="input input-bordered h-12 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
                placeholder="আপনার নাম"
              />
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="btn h-12 border-0 bg-emerald-600 px-5 text-base font-extrabold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <span className="loading loading-spinner loading-sm" />}
              {loading ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>
          </form>
          </div>
        </div>
      </section>
    </main>
  );
}
