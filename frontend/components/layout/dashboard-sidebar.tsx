"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  LayoutDashboard,
  Menu,
  Settings,
} from "lucide-react";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Lamaran", href: "/dashboard/lamaran", icon: BriefcaseBusiness },
  { label: "Analitik", href: "/dashboard/analitik", icon: BarChart3 },
  { label: "Pengaturan", href: "/dashboard/pengaturan", icon: Settings },
];

type DashboardSidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

export function DashboardSidebar({
  isOpen,
  toggleSidebar,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`hidden min-h-screen overflow-hidden border-r border-slate-200 bg-white py-4 transition-all duration-300 ease-in-out lg:block ${
        isOpen ? "w-[248px] px-3 opacity-100" : "w-0 border-none px-0 opacity-0"
      }`}
    >
      <div className="flex h-12 min-w-[220px] items-center justify-between gap-3 px-2">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-blue-500 text-white">
            <BarChart3 size={18} strokeWidth={2.5} />
          </span>

          <span className="shrink-0">
            <span className="block text-sm font-semibold text-slate-950">
              Applytics
            </span>
            <span className="block text-xs text-slate-500">Workspace</span>
          </span>
        </div>

        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Tutup sidebar"
          className="grid size-10 shrink-0 place-items-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="mt-8 grid min-w-[220px] gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex h-10 shrink-0 items-center gap-3 rounded-md px-3 text-sm transition ${
                isActive
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}