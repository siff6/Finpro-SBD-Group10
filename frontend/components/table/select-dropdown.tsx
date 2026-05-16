"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { ApplicationStatus } from "@/lib/applications/types";
import { statusOptions } from "@/lib/applications/types";
import { StatusBadge } from "./status-badge";

type SelectDropdownProps = {
  value: ApplicationStatus;
  onChange: (status: ApplicationStatus) => void;
};

export function SelectDropdown({ value, onChange }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(
    () =>
      statusOptions.filter((option) =>
        option.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setIsOpen(false);
          }
        }}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md px-2 transition hover:bg-slate-100"
      >
        <StatusBadge status={value} />
        <ChevronDown size={15} className="text-slate-400" />
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-11 z-40 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
          <label className="mb-2 flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-2 text-slate-500 transition focus-within:border-blue-400 focus-within:bg-white">
            <Search size={14} />
            <input
              aria-label="Cari status"
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setIsOpen(false);
                }
              }}
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-950 outline-none placeholder:text-slate-400"
              placeholder="Cari status"
            />
          </label>

          <div role="listbox" className="grid gap-1">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  setQuery("");
                }}
                className="flex items-center rounded-md px-2 py-2 text-left transition hover:bg-slate-100"
              >
                <StatusBadge status={option} />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}