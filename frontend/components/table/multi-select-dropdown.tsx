"use client";

import type { NextAction } from "@/lib/applications/types";

type MultiSelectDropdownProps = {
  value: NextAction[];
  onChange: (value: NextAction[]) => void;
};

export function MultiSelectDropdown({
  value,
  onChange,
}: MultiSelectDropdownProps) {
  return (
    <input
      aria-label="Tindakan berikutnya"
      value={value.join(", ")}
      onChange={(event) =>
        onChange(
          event.target.value
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean) as NextAction[],
        )
      }
      className="h-10 w-full min-w-0 truncate rounded-md border border-transparent bg-transparent px-2 text-sm text-slate-700 outline-none transition [color-scheme:light] hover:bg-slate-100 focus:border-blue-400 focus:bg-white focus:text-slate-950"
    />
  );
}