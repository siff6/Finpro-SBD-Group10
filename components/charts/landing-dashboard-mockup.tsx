"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, XAxis } from "recharts";
import { StatusBadge } from "@/components/table/status-badge";
import { ActionBadge } from "@/components/table/action-badge";

const pieData = [
  { name: "Accepted", value: 28, color: "#4ade80" },
  { name: "Interviewed", value: 34, color: "#facc15" },
  { name: "Rejected", value: 16, color: "#f87171" },
  { name: "Applied", value: 22, color: "#60a5fa" },
];

const barData = [
  { label: "Mon", value: 3 },
  { label: "Tue", value: 5 },
  { label: "Wed", value: 2 },
  { label: "Thu", value: 7 },
  { label: "Fri", value: 4 },
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
      <div className="rounded-lg border border-white/10 bg-[#10141b]/88 p-4 shadow-[0_28px_120px_rgba(0,0,0,0.35)] backdrop-blur">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Dashboard</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Application Pipeline</h2>
          </div>
          <span className="rounded-md border border-green-300/20 bg-green-400/12 px-3 py-1 text-xs text-green-100">
            Live
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Applications", "42"],
            ["Interviews", "11"],
            ["Offers", "4"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-white/10 bg-white/[0.045] p-3">
              <span className="text-xs text-zinc-500">{label}</span>
              <span className="mt-1 block text-2xl font-semibold text-white">{value}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <div className="overflow-hidden rounded-md border border-white/10">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] border-b border-white/10 bg-white/[0.035] px-3 py-2 text-xs uppercase tracking-[0.16em] text-zinc-500">
              <span>Company</span>
              <span>Status</span>
              <span>Action</span>
            </div>
            {[
              ["Orbit", "Interviewed", "Prepare Interview"],
              ["Kirana", "Offer", "Decide"],
              ["Sagara", "Applied", "Waiting"],
            ].map(([company, status, action]) => (
              <div
                key={company}
                className="grid grid-cols-[1.2fr_1fr_1fr] items-center gap-2 border-b border-white/8 px-3 py-3 last:border-b-0"
              >
                <span className="text-sm text-white">{company}</span>
                <StatusBadge status={status as "Applied" | "Interviewed" | "Offer"} />
                <ActionBadge action={action as "Prepare Interview" | "Decide" | "Waiting"} />
              </div>
            ))}
          </div>

          <div className="grid gap-3">
            <div className="h-36 rounded-md border border-white/10 bg-black/20 p-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" innerRadius={32} outerRadius={52}>
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="size-full rounded-md bg-white/[0.035]" />
              )}
            </div>
            <div className="h-36 rounded-md border border-white/10 bg-black/20 p-2">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <XAxis dataKey="label" hide />
                    <Bar dataKey="value" fill="#60a5fa" radius={[5, 5, 1, 1]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="size-full rounded-md bg-white/[0.035]" />
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
