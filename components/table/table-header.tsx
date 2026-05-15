export function TableHeader() {
    const columns = [
      "Company",
      "Position",
      "Status",
      "Application Date",
      "Salary",
      "Next Action",
      "Website",
      "Contact",
      "",
    ];
  
    return (
      <thead>
        <tr className="text-xs uppercase tracking-[0.18em] text-zinc-500">
          {columns.map((column) => (
            <th
              key={column || "actions"}
              className="border-b border-white/10 px-3 py-3 text-left font-medium"
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
  