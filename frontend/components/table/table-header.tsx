const columns = [
  { label: "Perusahaan", className: "w-[13%]" },
  { label: "Posisi", className: "w-[13%]" },
  { label: "Status", className: "w-[12%]" },
  { label: "Tanggal Lamaran", className: "w-[11%]" },
  { label: "Gaji", className: "w-[8%]" },
  { label: "Tindakan Berikutnya", className: "w-[15%]" },
  { label: "Website", className: "w-[12%]" },
  { label: "Kontak", className: "w-[11%]" },
  { label: "", className: "w-[5%]" },
];

export function TableHeader() {
  return (
    <thead>
      <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {columns.map((column) => (
          <th
            key={column.label || "actions"}
            className={`${column.className} border-b border-slate-200 bg-slate-50 px-3 py-3 text-left font-medium`}
          >
            <span className="block truncate">{column.label}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}