interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  align?: "left" | "right";
}

export default function SimpleTable<T>({
  rows,
  columns,
  rowKey,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200/70 bg-white/40 text-left text-xs uppercase tracking-wide text-slate-500 backdrop-blur-sm">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2.5 px-3 first:pl-3 ${col.align === "right" ? "text-right" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className="border-b border-slate-100/70 transition-colors last:border-b-0 hover:bg-white/50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2.5 px-3 tabular-nums first:pl-3 ${col.align === "right" ? "text-right" : ""}`}
                >
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
