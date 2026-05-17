"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart3, Home, LogIn, Sparkles, UserPlus } from "lucide-react";

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

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  const authButton = (() => {
    if (isLoggedIn) {
      return {
        href: "/dashboard",
        label: "Dashboard",
        icon: BarChart3,
      };
    }

    if (isLoginPage) {
      return {
        href: "/register",
        label: "Daftar",
        icon: UserPlus,
      };
    }

    if (isRegisterPage) {
      return {
        href: "/login",
        label: "Masuk",
        icon: LogIn,
      };
    }

    return {
      href: "/login",
      label: "Masuk",
      icon: LogIn,
    };
  })();

  const AuthIcon = authButton.icon;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Beranda Applytics">
          <span className="grid size-10 place-items-center rounded-xl border border-blue-200 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100/70">
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

          <Link
            href={authButton.href}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 font-semibold text-blue-700 shadow-sm shadow-blue-100/60 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-800"
          >
            <AuthIcon size={16} />
            {authButton.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}