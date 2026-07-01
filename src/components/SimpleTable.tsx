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
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-2 pr-3 ${col.align === "right" ? "text-right" : ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)} className="border-b border-gray-100 hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`py-2 pr-3 ${col.align === "right" ? "text-right" : ""}`}
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
