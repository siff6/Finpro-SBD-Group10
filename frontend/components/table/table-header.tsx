export function TableHeader() {
  const columns = [
    "Perusahaan",
    "Posisi",
    "Status",
    "Tanggal Lamaran",
    "Gaji",
    "Tindakan Berikutnya",
    "Website",
    "Kontak",
    "",
  ];

  return (
    <thead>
      <tr className="text-xs uppercase tracking-[0.18em] text-slate-500">
        {columns.map((column) => (
          <th
            key={column || "actions"}
            className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-left font-medium"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}