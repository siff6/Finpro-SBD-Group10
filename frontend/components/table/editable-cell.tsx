"use client";

type EditableCellProps = {
  label: string;
  value: string | number;
  type?: string;
  onChange: (value: string) => void;
};

export function EditableCell({ label, value, type = "text", onChange }: EditableCellProps) {
  return (
    <input
      aria-label={label}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-transparent bg-transparent px-2 text-sm text-zinc-100 outline-none transition [color-scheme:dark] hover:bg-white/[0.04] focus:border-blue-300/50 focus:bg-[#10141b]"
    />
  );
}