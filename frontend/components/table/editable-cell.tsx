"use client";

type EditableCellProps = {
  label: string;
  value: string | number;
  type?: string;
  onChange: (value: string) => void;
};

export function EditableCell({
  label,
  value,
  type = "text",
  onChange,
}: EditableCellProps) {
  return (
    <input
      aria-label={label}
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full rounded-md border border-transparent bg-transparent px-2 text-sm text-slate-700 outline-none transition [color-scheme:light] hover:bg-slate-100 focus:border-blue-400 focus:bg-white focus:text-slate-950"
    />
  );
}