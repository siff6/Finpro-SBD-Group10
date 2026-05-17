"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts";
import { StatusBadge } from "@/components/table/status-badge";
import { ActionBadge } from "@/components/table/action-badge";

const pieData = [
  { name: "Accepted", value: 28, color: "#16a34a" },
  { name: "Interviewed", value: 34, color: "#eab308" },
  { name: "Rejected", value: 16, color: "#ef4444" },
  { name: "Applied", value: 22, color: "#2563eb" },
];

const barData = [
  { label: "Sen", value: 3 },
  { label: "Sel", value: 5 },
  { label: "Rab", value: 2 },
  { label: "Kam", value: 7 },
  { label: "Jum", value: 4 },
];

export function LandingDashboardMockup() {
  const mounted = useClientMounted();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative"
    >
      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-xl shadow-slate-200/80">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Dashboard
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">
              Ringkasan Lamaran
            </h2>
          </div>

          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Aktif
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Lamaran", "42"],
            ["Wawancara", "11"],
            ["Penawaran", "4"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-3"
            >
              <span className="text-xs font-medium text-slate-500">{label}</span>
              <span className="mt-1 block text-2xl font-semibold text-slate-950">
                {value}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              <span>Perusahaan</span>
              <span>Status</span>
              <span>Aksi</span>
            </div>

            {[
              ["Orbit", "Interviewed", "Prepare Interview"],
              ["Kirana", "Offer", "Decide"],
              ["Sagara", "Applied", "Waiting"],
            ].map(([company, status, action]) => (
              <div
                key={company}
                className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-2 border-b border-slate-100 px-3 py-3 last:border-b-0"
              >
                <span className="text-sm font-medium text-slate-800">
                  {company}
                </span>

                <StatusBadge status={status as "Applied" | "Interviewed" | "Offer"} />

                <ActionBadge
                  action={action as "Prepare Interview" | "Decide" | "Waiting"}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-3">
            <div className="h-36 min-h-[144px] rounded-2xl border border-slate-200 bg-slate-50 p-2">
              {mounted ? (
                <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={32} outerRadius={52}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="size-full rounded-xl bg-slate-100" />
              )}
            </div>

            <div className="h-36 min-h-[144px] rounded-2xl border border-slate-200 bg-slate-50 p-2">
              {mounted ? (
                <ResponsiveContainer width="99%" height="100%" minWidth={0} minHeight={0}>
                  <BarChart data={barData}>
                    <XAxis dataKey="label" hide />
                    <Bar dataKey="value" fill="#2563eb" radius={[5, 5, 1, 1]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="size-full rounded-xl bg-slate-100" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function useClientMounted() {
  return useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
}