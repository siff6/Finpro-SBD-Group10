"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BarChart3, UserPlus } from "lucide-react";

export function LandingHeroActions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("applytics-token");

      setIsLoggedIn(Boolean(token));
      setHasCheckedAuth(true);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, []);

  if (!hasCheckedAuth) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100 sm:w-44" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-slate-100 sm:w-36" />
      </div>
    );
  }

  if (isLoggedIn) {
    return (
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-5 font-semibold text-white shadow-sm shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
        >
          Buka Dashboard
          <BarChart3 size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link
        href="/login"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-5 font-semibold text-white shadow-sm shadow-blue-100 transition hover:-translate-y-0.5 hover:bg-blue-700"
      >
        Mulai Sekarang
        <ArrowRight size={18} />
      </Link>

      <Link
        href="/register"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      >
        Buat Akun
        <UserPlus size={18} />
      </Link>
    </div>
  );
}