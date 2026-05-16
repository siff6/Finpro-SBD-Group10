"use client";

import Link from "next/link";
import { LogIn, Search, UserRound, Menu } from "lucide-react";

type DashboardTopbarProps = {
  username: string;
  toggleSidebar: () => void;
};

export function DashboardTopbar({ username, toggleSidebar }: DashboardTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090d]/88 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex w-full max-w-md items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden place-items-center rounded-md border border-white/10 text-zinc-400 transition hover:bg-white/10 hover:text-white lg:grid lg:size-10"
          >
            <Menu size={18} />
          </button>
          <label className="hidden h-10 w-full items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 text-zinc-500 md:flex">
            <Search size={16} />
            <input
              aria-label="Dashboard search"
              placeholder="Search jobs, companies, contacts"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm text-zinc-400 sm:block">Hi, {username}</span>
          
          {/* tombol button diubah jadi Link buat pindah halaman */}
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white transition hover:border-blue-300/60"
          >
            <LogIn size={16} />
            Login
          </Link>
          
          <span className="grid size-10 place-items-center rounded-md bg-white/8 text-zinc-200">
            <UserRound size={18} />
          </span>
        </div>
      </div>
    </header>
  );
}