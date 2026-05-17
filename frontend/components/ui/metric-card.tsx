import type { ReactNode } from "react";

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: string | number;
  caption: string;
};

export function MetricCard({ icon, label, value, caption }: MetricCardProps) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-slate-600">{label}</span>

        <span className="grid size-9 place-items-center rounded-md bg-blue-50 text-blue-600">
          {icon}
        </span>
      </div>

      <span className="mt-4 block text-3xl font-semibold text-slate-950">
        {value}
      </span>

      <p className="mt-1 text-xs text-slate-500">{caption}</p>
    </article>
  );
}