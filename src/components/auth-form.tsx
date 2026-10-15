"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "signin" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      if (mode === "signup") {
        const result = await authClient.signUp.email({
          name: String(form.get("name") || ""),
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
        });
        if (result.error) throw new Error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
        toast.success("রেজিস্ট্রেশন সফল হয়েছে। এখন সাইন ইন করুন।");
        router.push("/signin");
      } else {
        const result = await authClient.signIn.email({
          email: String(form.get("email") || ""),
          password: String(form.get("password") || ""),
        });
        if (result.error) throw new Error(result.error.message || "সাইন ইন করা যায়নি।");
        toast.success("স্বাগতম, আপনি সাইন ইন করেছেন।");
        router.push("/");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "কিছু ভুল হয়েছে।";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function social(provider: "Google" | "GitHub") {
    setLoading(true);
    setError("");
    try {
      const result = await authClient.signIn.social({
        provider: provider === "Google" ? "google" : "github",
        callbackURL: "/",
      });
      if (result.error) throw new Error(result.error.message || "সোশ্যাল সাইন ইন করা যায়নি।");
    } catch (err) {
      const message = err instanceof Error ? err.message : "কিছু ভুল হয়েছে।";
      setError(message);
      toast.error(message);
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <main className="flex-1 bg-slate-50">
      <section className="mx-auto grid min-h-[70vh] max-w-6xl place-items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-extrabold text-emerald-700">বাজার দর অ্যাকাউন্ট</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{isSignup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</h1>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {isSignup && (
              <label className="block">
                <span className="text-sm font-bold text-slate-700">নাম</span>
                <input name="name" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-emerald-500" placeholder="আপনার নাম" />
              </label>
            )}
            <label className="block">
              <span className="text-sm font-bold text-slate-700">ইমেইল</span>
              <input name="email" type="email" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-emerald-500" placeholder="name@example.com" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-slate-700">পাসওয়ার্ড</span>
              <input name="password" type="password" className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-emerald-500" placeholder="কমপক্ষে ৬ অক্ষর" />
            </label>
            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</p>}
            <button disabled={loading} className="h-11 w-full rounded-lg bg-emerald-600 font-extrabold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? "Loading..." : isSignup ? "রেজিস্টার" : "লগ ইন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-bold text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            অথবা
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => social("Google")} className="h-11 rounded-lg border border-slate-200 font-extrabold text-slate-700 transition hover:bg-slate-50" type="button">
              G Google
            </button>
            <button onClick={() => social("GitHub")} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 font-extrabold text-slate-700 transition hover:bg-slate-50" type="button">
              GH
              GitHub
            </button>
          </div>

          <p className="mt-5 text-center text-sm font-semibold text-slate-600">
            {isSignup ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "নতুন ব্যবহারকারী?"}{" "}
            <Link className="font-extrabold text-emerald-700" href={isSignup ? "/signin" : "/signup"}>
              {isSignup ? "লগ ইন করুন" : "রেজিস্টার করুন"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
