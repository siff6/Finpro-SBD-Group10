"use client";

import type { DashboardFilters } from "@/lib/applications/types";
import { statusOptions } from "@/lib/applications/types";

type FilterBarProps = {
  filters: DashboardFilters;
  onChange: (filters: DashboardFilters) => void;
};

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-950">Filter</h2>
        <p className="mt-1 text-sm text-slate-600">
          Grafik dan tabel akan diperbarui sesuai filter yang dipilih.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <select
          aria-label="Filter status"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as DashboardFilters["status"],
            })
          }
          className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white"
        >
          <option value="All">Semua status</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter analitik"
          value={filters.analytics}
          onChange={(event) =>
            onChange({
              ...filters,
              analytics: event.target.value as DashboardFilters["analytics"],
            })
          }
          className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white"
        >
          <option value="Overview">Ringkasan</option>
          <option value="Interviews">Wawancara</option>
          <option value="Offers">Penawaran</option>
        </select>

        <select
          aria-label="Filter tanggal"
          value={filters.dateRange}
          onChange={(event) =>
            onChange({
              ...filters,
              dateRange: event.target.value as DashboardFilters["dateRange"],
            })
          }
          className="h-10 rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-950 outline-none transition focus:border-blue-400 focus:bg-white"
        >
          <option value="All time">Semua waktu</option>
          <option value="Last 7 days">7 hari terakhir</option>
          <option value="Last 30 days">30 hari terakhir</option>
        </select>
      </div>
    </section>
  );
}