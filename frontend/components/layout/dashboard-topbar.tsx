"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, UserRound, Menu, LogOut } from "lucide-react";

type DashboardTopbarProps = {
  username: string;
  toggleSidebar: () => void;
};

export function DashboardTopbar({ username, toggleSidebar }: DashboardTopbarProps) {
  const router = useRouter();
  // state buat ngatur buka tutup menu profilnyaa
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const handleLogout = () => {
    // bersihin token sama nama user dari localstoragenya
    localStorage.removeItem("applytics-token");
    localStorage.removeItem("applytics-user");
    // usir balik ke halaman login
    router.push("/login");
  };
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
          {/* bungkus profilnya dipisahin trus dibikin relative biar dropdownnya ngga lari lari */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="grid size-10 place-items-center rounded-md bg-white/8 text-zinc-200 transition hover:bg-white/10 hover:text-white"
            >
              <UserRound size={18} />
            </button>
            {/* popup dropdown logoutnyaa */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md border border-white/10 bg-[#07090d] shadow-2xl">
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
                  >
                    <LogOut size={16} />
                    Logout from Workspace
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