"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, Home, LogIn, Sparkles } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("applytics-token");
      setIsLoggedIn(Boolean(token));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("focus", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("focus", checkAuth);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Beranda Applytics">
          <span className="grid size-10 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
            <BarChart3 size={20} strokeWidth={2.5} />
          </span>

          <span className="leading-none">
            <span className="block text-base font-semibold text-slate-950">
              Applytics
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">
              Pelacak lamaran kerja
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-slate-600 sm:gap-2">
          <Link
            href="/"
            className="hidden h-10 items-center gap-2 rounded-xl px-3 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
          >
            <Home size={16} />
            Beranda
          </Link>

          <Link
            href="/#features"
            className="hidden h-10 items-center gap-2 rounded-xl px-3 transition hover:bg-slate-100 hover:text-slate-950 md:inline-flex"
          >
            <Sparkles size={16} />
            Fitur
          </Link>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <BarChart3 size={16} />
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              <LogIn size={16} />
              Masuk
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}