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
import { getMonthlyApplications, getStatusCounts } from "@/lib/applications/analytics";
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
      <article className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Status Ratio</h2>
            <p className="mt-1 text-sm text-zinc-400">Accepted, rejected, and ongoing signal.</p>
          </div>
        </div>

        <div className="mt-5 h-72">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "#11151d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
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
            <div className="size-full rounded-md bg-white/[0.035]" />
          )}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {statusData.map((item) => (
            <div key={item.status} className="rounded-md border border-white/10 bg-black/20 p-3">
              <span className="text-xs text-zinc-500">{item.status}</span>
              <span className="mt-1 block text-xl font-semibold text-white">{item.count}</span>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
        <div>
          <h2 className="text-xl font-semibold text-white">Application Velocity</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Applications per date, interview count, and acceptance statistics.
          </p>
        </div>

        <div className="mt-5 h-80">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" tickLine={false} axisLine={false} width={32} />
                <Tooltip
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  contentStyle={{
                    background: "#11151d",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fff",
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
            <div className="size-full rounded-md bg-white/[0.035]" />
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