import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  caption: string;
};

export function MetricCard({ icon, label, value, caption }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[0.045] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="grid size-9 place-items-center rounded-md bg-white/8 text-zinc-200">
          {icon}
        </span>
      </div>
      <span className="mt-4 block text-3xl font-semibold text-white">{value}</span>
      <p className="mt-1 text-xs text-zinc-500">{caption}</p>
    </article>
  );
}
