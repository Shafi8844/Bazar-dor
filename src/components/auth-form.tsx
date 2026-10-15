"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type AuthFormProps = {
  mode: "signin" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    if (currentUrl.searchParams.get("authRequired") !== "1") return;

    toast.error("এই পৃষ্ঠাটি দেখতে আগে সাইন ইন করুন।");
    currentUrl.searchParams.delete("authRequired");
    window.history.replaceState(null, "", `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
  }, []);

  function getCallbackURL() {
    const callbackURL = new URLSearchParams(window.location.search).get("callbackURL");
    if (!callbackURL?.startsWith("/") || callbackURL.startsWith("//")) return "/";

    const callback = new URL(callbackURL, window.location.origin);
    return callback.origin === window.location.origin ? `${callback.pathname}${callback.search}${callback.hash}` : "/";
  }

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
        router.push(getCallbackURL());
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
        callbackURL: getCallbackURL(),
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
        <div className="card w-full max-w-md border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          <div className="card-body gap-0 p-6 sm:p-8">
            <p className="text-sm font-extrabold text-emerald-700">বাজার দর অ্যাকাউন্ট</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-slate-950">{isSignup ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "সাইন ইন করুন"}</h1>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {isSignup && (
              <fieldset className="fieldset gap-1">
                <legend className="fieldset-legend text-sm font-bold text-slate-700">নাম</legend>
                <input name="name" autoComplete="name" required className="input input-bordered h-12 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none" placeholder="আপনার নাম" />
              </fieldset>
            )}
            <fieldset className="fieldset gap-1">
              <legend className="fieldset-legend text-sm font-bold text-slate-700">ইমেইল</legend>
              <input name="email" type="email" autoComplete="email" required className="input input-bordered h-12 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none" placeholder="name@example.com" />
            </fieldset>
            <fieldset className="fieldset gap-1">
              <legend className="fieldset-legend text-sm font-bold text-slate-700">পাসওয়ার্ড</legend>
              <input name="password" type="password" autoComplete={isSignup ? "new-password" : "current-password"} minLength={6} required className="input input-bordered h-12 w-full border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none" placeholder="কমপক্ষে ৬ অক্ষর" />
            </fieldset>
            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700">{error}</p>}
            <button disabled={loading} className="btn mt-2 h-12 w-full border-0 bg-emerald-600 text-base font-extrabold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {loading && <span className="loading loading-spinner loading-sm" />}
              {loading ? "অপেক্ষা করুন..." : isSignup ? "রেজিস্টার" : "লগ ইন"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-bold text-slate-500">
            <span className="h-px flex-1 bg-slate-200" />
            অথবা
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => social("Google")} className="btn btn-outline h-11 border-slate-300 bg-white font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50" type="button" disabled={loading}>
              <span className="font-black text-rose-600">G</span>
              Google
            </button>
            <button onClick={() => social("GitHub")} className="btn btn-outline h-11 border-slate-300 bg-white font-bold text-slate-700 hover:border-slate-400 hover:bg-slate-50" type="button" disabled={loading}>
              <span className="text-xs font-black">GH</span>
              GitHub
            </button>
          </div>

          <p className="mt-6 text-center text-sm font-medium text-slate-600">
            {isSignup ? "আগে থেকেই অ্যাকাউন্ট আছে?" : "নতুন ব্যবহারকারী?"}{" "}
            <Link className="font-extrabold text-emerald-700" href={isSignup ? "/signin" : "/signup"}>
              {isSignup ? "লগ ইন করুন" : "রেজিস্টার করুন"}
            </Link>
          </p>
          </div>
        </div>
      </section>
    </main>
  );
}
