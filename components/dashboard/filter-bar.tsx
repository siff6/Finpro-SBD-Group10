"use client";

import type { DashboardFilters } from "@/lib/applications/types";
import { statusOptions } from "@/lib/applications/types";

type FilterBarProps = {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-white">Filters</h2>
        <p className="mt-1 text-sm text-zinc-400">Charts and table update in realtime.</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <select
          aria-label="Status filter"
          value={filters.status}
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value as DashboardFilters["status"] })
          }
          className="h-10 rounded-md border border-white/10 bg-[#10141b] px-3 text-sm text-white outline-none focus:border-blue-300/60"
        >
          <option value="All">All statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          aria-label="Analytics filter"
          value={filters.analytics}
          onChange={(event) =>
            onChange({
              ...filters,
              analytics: event.target.value as DashboardFilters["analytics"],
            })
          }
          className="h-10 rounded-md border border-white/10 bg-[#10141b] px-3 text-sm text-white outline-none focus:border-blue-300/60"
        >
          <option value="Overview">Overview</option>
          <option value="Interviews">Interviews</option>
          <option value="Offers">Offers</option>
        </select>

        <select
          aria-label="Date filter"
          value={filters.dateRange}
          onChange={(event) =>
            onChange({
              ...filters,
              dateRange: event.target.value as DashboardFilters["dateRange"],
            })
          }
          className="h-10 rounded-md border border-white/10 bg-[#10141b] px-3 text-sm text-white outline-none focus:border-blue-300/60"
        >
          <option value="All time">All time</option>
          <option value="Last 7 days">Last 7 days</option>
          <option value="Last 30 days">Last 30 days</option>
        </select>
      </div>
    </section>
  );
}
