"use client";

import { useMemo, useState } from "react";
import type { MetricaPrescritor } from "@/lib/metrics";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";

type SortKey = "volumeReceitas" | "valorTotal" | "margemTotal" | "ticketMedioPorReceita";

export default function PrescritorTable({ data }: { data: MetricaPrescritor[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("volumeReceitas");
  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    const filtered = filter
      ? data.filter((d) => d.medico.toLowerCase().includes(filter.toLowerCase()))
      : data;
    return [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [data, sortKey, filter]);

  const columns: { key: SortKey; label: string }[] = [
    { key: "volumeReceitas", label: "Volume de Receitas" },
    { key: "valorTotal", label: "Valor Total" },
    { key: "margemTotal", label: "Margem" },
    { key: "ticketMedioPorReceita", label: "Ticket Médio" },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Buscar prescritor..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-64 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
        />
        <p className="text-xs text-gray-500">{rows.length} prescritor(es)</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
              <th className="py-2 pr-3">#</th>
              <th className="py-2 pr-3">Prescritor</th>
              <th className="py-2 pr-3">CRM</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => setSortKey(col.key)}
                  className={`py-2 pr-3 cursor-pointer select-none whitespace-nowrap ${
                    sortKey === col.key ? "text-blue-600 font-semibold" : ""
                  } ${col.key === "volumeReceitas" ? "text-blue-700" : ""}`}
                >
                  {col.label} {sortKey === col.key ? "▼" : ""}
                </th>
              ))}
              <th className="py-2 pr-3">Pacientes</th>
              <th className="py-2 pr-3">Itens</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.medico} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 pr-3 text-gray-400">{idx + 1}</td>
                <td className="py-2 pr-3 font-medium text-gray-900">{r.medico || "(sem nome)"}</td>
                <td className="py-2 pr-3 text-gray-500">{r.nrReg || "-"}</td>
                <td className="py-2 pr-3 font-semibold text-blue-700">
                  {formatNumber(r.volumeReceitas)}
                </td>
                <td className="py-2 pr-3">{formatCurrency(r.valorTotal)}</td>
                <td className="py-2 pr-3">
                  {formatCurrency(r.margemTotal)}{" "}
                  <span className="text-xs text-gray-400">
                    ({formatPercent(r.margemPercentual)})
                  </span>
                </td>
                <td className="py-2 pr-3">{formatCurrency(r.ticketMedioPorReceita)}</td>
                <td className="py-2 pr-3">{formatNumber(r.pacientesAtendidos)}</td>
                <td className="py-2 pr-3">{formatNumber(r.totalItens)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
