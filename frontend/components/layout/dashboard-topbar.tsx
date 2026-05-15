"use client";

import { useState } from "react";
import { LogIn, Search, UserRound } from "lucide-react";

type DashboardTopbarProps = {
  username: string;
  onLogin: (username: string) => void;
};

export function DashboardTopbar({ username, onLogin }: DashboardTopbarProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [draftName, setDraftName] = useState(username);

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#07090d]/88 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <label className="hidden h-10 w-full max-w-md items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 text-zinc-500 md:flex">
          <Search size={16} />
          <input
            aria-label="Dashboard search"
            placeholder="Search jobs, companies, contacts"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </label>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm text-zinc-400 sm:block">Hi, {username}</span>
          <button
            type="button"
            onClick={() => setIsLoginOpen((current) => !current)}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white transition hover:border-blue-300/60"
          >
            <LogIn size={16} />
            Login
          </button>
          <span className="grid size-10 place-items-center rounded-md bg-white/8 text-zinc-200">
            <UserRound size={18} />
          </span>
        </div>
      </div>

      {isLoginOpen ? (
        <form
          className="absolute right-4 top-[72px] z-50 w-80 rounded-lg border border-white/10 bg-[#11151d] p-4 shadow-2xl"
          onSubmit={(event) => {
            event.preventDefault();
            onLogin(draftName.trim() || "Job Hunter");
            setIsLoginOpen(false);
          }}
        >
          <h2 className="text-lg font-semibold text-white">Dashboard Login</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Demo session persistence. Hubungkan ke Supabase Auth via env.
          </p>
          <label className="mt-4 grid gap-2 text-sm text-zinc-300">
            Username
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="h-10 rounded-md border border-white/10 bg-black/20 px-3 text-white outline-none focus:border-blue-300/60"
              placeholder="yourname"
            />
          </label>
          <button
            type="submit"
            className="mt-4 h-10 w-full rounded-md bg-blue-400 text-sm font-semibold text-black transition hover:bg-blue-300"
          >
            Save Session
          </button>
        </form>
      ) : null}
    </header>
  );
}
