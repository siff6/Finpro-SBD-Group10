"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, UserRound, Menu, LogOut } from "lucide-react";

type DashboardTopbarProps = {
  username: string;
  toggleSidebar: () => void;
};

export function DashboardTopbar({
  username,
  toggleSidebar,
}: DashboardTopbarProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("applytics-token");
    localStorage.removeItem("applytics-user");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex w-full max-w-md items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 lg:grid lg:size-10"
            aria-label="Buka atau tutup sidebar"
          >
            <Menu size={18} />
          </button>

          <label className="hidden h-10 w-full items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-blue-400 focus-within:bg-white md:flex">
            <Search size={16} />
            <input
              aria-label="Pencarian dashboard"
              placeholder="Cari pekerjaan, perusahaan, atau kontak"
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="hidden text-sm text-slate-600 sm:block">
            Halo, {username}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="grid size-10 place-items-center rounded-md bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-950"
              aria-label="Buka menu profil"
            >
              <UserRound size={18} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
                <div className="p-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut size={16} />
                    Keluar dari Workspace
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}