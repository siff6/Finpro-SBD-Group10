"use client";

type DatePickerCellProps = {
  value: string;
  onChange: (value: string) => void;
};

export function DatePickerCell({ value, onChange }: DatePickerCellProps) {
  return (
    <input
      aria-label="Tanggal lamaran"
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-10 w-full min-w-0 rounded-md border border-transparent bg-transparent px-2 text-sm text-slate-700 outline-none transition [color-scheme:light] hover:bg-slate-100 focus:border-blue-400 focus:bg-white focus:text-slate-950"
    />
  );
}