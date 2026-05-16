"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, LogIn, Sparkles, UserPlus } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-email" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Beranda Applytics">
          <span className="grid size-10 place-items-center rounded-md bg-blue-500 text-white">
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
            className="hidden h-10 items-center gap-2 rounded-md px-3 transition hover:bg-slate-100 hover:text-slate-950 sm:inline-flex"
          >
            <Home size={16} />
            Beranda
          </Link>

          <Link
            href="/#features"
            className="hidden h-10 items-center gap-2 rounded-md px-3 transition hover:bg-slate-100 hover:text-slate-950 md:inline-flex"
          >
            <Sparkles size={16} />
            Fitur
          </Link>

          {!isAuthPage && (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <BarChart3 size={16} />
              Dashboard
            </Link>
          )}

          {pathname === "/register" ? (
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-500 px-3 font-medium text-white transition hover:bg-blue-600"
            >
              <LogIn size={16} />
              Masuk
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-blue-500 px-3 font-medium text-white transition hover:bg-blue-600"
            >
              <UserPlus size={16} />
              Daftar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}