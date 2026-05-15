"use client";

import { BarChart3, BriefcaseBusiness, LayoutDashboard, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen border-r border-white/10 bg-[#090b10] px-3 py-4 lg:block">
      <div className="flex h-12 items-center gap-3 px-2">
        <span className="grid size-9 place-items-center rounded-md bg-blue-400 text-black">
          <BarChart3 size={18} strokeWidth={2.5} />
        </span>
        <span>
          <span className="block text-sm font-semibold text-white">Applytics</span>
          <span className="block text-xs text-zinc-500">Workspace</span>
        </span>
      </div>

      <nav className="mt-8 grid gap-1">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm transition ${
                index === 0
                  ? "bg-white/9 text-white"
                  : "text-zinc-400 hover:bg-white/[0.055] hover:text-white"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
