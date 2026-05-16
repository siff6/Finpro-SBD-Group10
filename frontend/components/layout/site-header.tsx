"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, LogIn, Sparkles, UserPlus } from "lucide-react";

export function SiteHeader() {
  const pathname = usePathname();
  // bikin variabel penanda buat ngecek ini lagi di halaman auth apa ngga
  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/verify-email" || pathname === "/forgot-password" || pathname === "/reset-password";
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090d]/88 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Applytics home">
          <span className="grid size-10 place-items-center rounded-md bg-blue-400 text-black">
            <BarChart3 size={20} strokeWidth={2.5} />
          </span>
          <span className="leading-none">
            <span className="block text-base font-semibold text-white">Applytics</span>
            <span className="hidden text-xs text-zinc-400 sm:block">Job application tracker</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-zinc-300 sm:gap-2">
          <Link
            href="/"
            className="hidden h-10 items-center gap-2 rounded-md px-3 transition hover:bg-white/8 hover:text-white sm:inline-flex"
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href="/#features"
            className="hidden h-10 items-center gap-2 rounded-md px-3 transition hover:bg-white/8 hover:text-white md:inline-flex"
          >
            <Sparkles size={16} />
            Features
          </Link>
          {/* tombol dashboardnyaa cuma dimunculin kalo bukan di halaman login atau register */}
          {!isAuthPage && (
            <Link
              href="/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-white/12 px-3 transition hover:border-blue-300/70 hover:text-white"
            >
              <BarChart3 size={16} />
              Dashboard
            </Link>
          )}
          {/* logika penyesuaian tombol berdasarkan rute halaman saat ini */}
          {pathname === "/register" ? (
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-3 font-medium text-black transition hover:bg-blue-100"
            >
              <LogIn size={16} />
              Login
            </Link>
          ) : (
            <Link
              href="/register"
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-3 font-medium text-black transition hover:bg-blue-100"
            >
              <UserPlus size={16} />
              Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}