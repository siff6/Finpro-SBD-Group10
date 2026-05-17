"use client";

import { useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getMonthlyApplications,
  getStatusCounts,
} from "@/lib/applications/analytics";
import type { JobApplication } from "@/lib/applications/types";
import { statusMeta } from "@/lib/applications/types";

type ApplicationChartsProps = {
  applications: JobApplication[];
};

export function ApplicationCharts({ applications }: ApplicationChartsProps) {
  const mounted = useClientMounted();
  const statusData = getStatusCounts(applications).filter((item) => item.count > 0);
  const monthlyData = getMonthlyApplications(applications);

  return (
    <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Rasio Status
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Ringkasan status lamaran yang diterima, ditolak, dan sedang berjalan.
            </p>
          </div>
        </div>

        <div className="mt-5 h-72 min-h-[288px]">
          {mounted ? (
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    color: "#0f172a",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={74}
                  outerRadius={104}
                  paddingAngle={5}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={statusMeta[entry.status].chart} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="size-full rounded-md bg-slate-100" />
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {statusData.map((item) => (
            <div
              key={item.status}
              className="rounded-md border border-slate-200 bg-slate-50 p-3"
            >
              <span className="text-xs text-slate-500">
                {statusMeta[item.status].label}
              </span>
              <span className="mt-1 block text-xl font-semibold text-slate-950">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Perkembangan Lamaran
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Jumlah lamaran berdasarkan tanggal untuk memantau ritme pencarian kerja.
          </p>
        </div>

        <div className="mt-5 h-80 min-h-[320px]">
          {mounted ? (
            <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={monthlyData}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    color: "#0f172a",
                    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                  }}
                />
                <Bar
                  dataKey="applications"
                  fill="#60a5fa"
                  radius={[6, 6, 2, 2]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="size-full rounded-md bg-slate-100" />
          )}
        </div>
      </article>
    </section>
  );
}

function useClientMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}