"use client";

import { BarChart3, BriefcaseBusiness, LayoutDashboard, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Applications", icon: BriefcaseBusiness },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

type DashboardSidebarProps = {
  isOpen: boolean; // tambahin props ini
};

export function DashboardSidebar({ isOpen }: DashboardSidebarProps) {
  return (
    <aside 
      className={`hidden lg:block min-h-screen border-r border-white/10 bg-[#090b10] py-4 overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "w-[248px] px-3 opacity-100" : "w-0 px-0 opacity-0 border-none"
      }`}
    >
      <div className="flex h-12 items-center gap-3 px-2 min-w-[200px]">
        <span className="grid size-9 place-items-center rounded-md bg-blue-400 text-black shrink-0">
          <BarChart3 size={18} strokeWidth={2.5} />
        </span>
        <span className="shrink-0">
          <span className="block text-sm font-semibold text-white">Applytics</span>
          <span className="block text-xs text-zinc-500">Workspace</span>
        </span>
      </div>

      <nav className="mt-8 grid gap-1 min-w-[200px]">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm transition shrink-0 ${
                index === 0
                  ? "bg-white/9 text-white"
                  : "text-zinc-400 hover:bg-white/[0.055] hover:text-white"
              }`}
            >
              <Icon size={17} className="shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}