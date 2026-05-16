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
      className="min-w-0 max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex min-w-0 flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Daftar Lamaran
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Kelola data lamaran kerja, status, tanggal, gaji, sumber, dan jenis kerja.
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
          <label className="flex h-10 min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-blue-400 focus-within:bg-white">
            <Search size={16} />
            <input
              aria-label="Cari lamaran"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Cari lamaran"
              className="min-w-0 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
            />
          </label>

          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-blue-500 px-3 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            <Plus size={16} />
            Tambah Lamaran
          </button>
        </div>
      </div>

      <div className="w-full max-w-full overflow-hidden">
        <table className="w-full table-fixed border-separate border-spacing-0">
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