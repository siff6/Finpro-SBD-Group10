"use client";

import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import type { JobApplication } from "@/lib/applications/types";
import { TableHeader } from "./table-header";
import { TableRow } from "./table-row";

type ApplicationTableProps = {
  applications: JobApplication[];
  query: string;
  onQueryChange: (query: string) => void;
  onAddRow: () => void;
  onChange: (id: string, patch: Partial<JobApplication>) => void;
  onDelete: (id: string) => void;
};

export function ApplicationTable({
  applications,
  query,
  onQueryChange,
  onAddRow,
  onChange,
  onDelete,
}: ApplicationTableProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-lg border border-white/10 bg-white/[0.045] shadow-[0_20px_80px_rgba(0,0,0,0.18)]"
    >
      <div className="flex flex-col gap-3 border-b border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Applications</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Inline editing, select status, multi-select action, dan date picker.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 text-zinc-400">
            <Search size={16} />
            <input
              aria-label="Search applications"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search table"
              className="min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </label>
          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-400 px-3 text-sm font-semibold text-black transition hover:bg-blue-300"
          >
            <Plus size={16} />
            Add row
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] border-separate border-spacing-0">
          <TableHeader />
          <tbody>
            {applications.map((application) => (
              <TableRow
                key={application.id}
                application={application}
                onChange={onChange}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </motion.section>
  );
}
