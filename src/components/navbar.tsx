"use client";

import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import MarqueeText from "react-marquee-text";
import { compactUnitLabel, formatTaka, type Category, type Product, toBanglaNumber } from "@/lib/products";
import { useAuth } from "./auth-context";

export function Navbar({ categories, products }: { categories: Category[]; products: Product[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, ready, signOut } = useAuth();
  const tickerItems = products.slice(0, 8);

  async function handleLogout() {
    try {
      await signOut();
      toast.success("সফলভাবে সাইন আউট হয়েছে।");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "সাইন আউট করা যায়নি।");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-emerald-600 text-xl text-white shadow-sm">🛒</span>
            <span>
              <span className="block text-2xl font-black text-slate-950">বাজার দর</span>
              <span className="block text-sm font-semibold text-emerald-700">২৯ আশ্বিন, ১৪৩৩ বঙ্গাব্দ</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {!ready ? (
              <div className="h-10 w-40 animate-pulse rounded-lg bg-slate-100" />
            ) : user ? (
              <>
                <span className="inline-flex max-w-44 items-center gap-2 truncate rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700">
                  <UserRound className="size-4 shrink-0" />
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-bold text-white transition hover:bg-slate-800"
                >
                  <LogOut className="size-4" />
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link className="rounded-lg border border-emerald-200 px-4 py-2 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50" href="/signin">
                  সাইন ইন
                </Link>
                <Link className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700" href="/signup">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 md:justify-center">
          {categories.map((category) => {
            const active = pathname === `/category/${category.slug}`;
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className={`flex shrink-0 items-center gap-2 rounded-lg px-4 py-2 text-sm font-extrabold transition ${
                  active ? "bg-amber-400 text-slate-950 shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                }`}
              >
                <span>{category.icon}</span>
                {category.nameBn}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="ticker overflow-hidden border-t border-emerald-100 bg-white py-2 text-slate-900">
        <MarqueeText className="text-sm font-bold" duration={32} pauseOnHover>
          {tickerItems.map((product) => (
            <span key={product.slug}>
              {product.image} {product.nameBn} {formatTaka(product.today)}/{compactUnitLabel(product.unit)}{" "}
              <span className={product.change.pct >= 0 ? "text-emerald-700" : "text-rose-700"}>
                {product.change.pct >= 0 ? "▲" : "▼"} {toBanglaNumber(Math.abs(product.change.pct).toFixed(1))}%
              </span>
            </span>
          ))}
        </MarqueeText>
      </div>
    </header>
  );
}
