"use client";

import type { NextAction } from "@/lib/applications/types";

type MultiSelectDropdownProps = {
  value: NextAction[];
  onChange: (value: NextAction[]) => void;
};

export function MultiSelectDropdown({ value, onChange }: MultiSelectDropdownProps) {
  return (
    <input
      aria-label="Next Action"
      value={value.join(", ")}
      onChange={(event) => onChange(event.target.value.split(",").map((v) => v.trim()) as NextAction[])}
      className="h-10 w-full rounded-md border border-transparent bg-transparent px-2 text-sm text-zinc-100 outline-none transition [color-scheme:dark] hover:bg-white/[0.04] focus:border-blue-300/50 focus:bg-[#10141b]"
    />
  );
}