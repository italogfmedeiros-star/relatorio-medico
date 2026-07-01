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
          className="glass-input w-64"
        />
        <p className="text-xs tabular-nums text-slate-500">{rows.length} prescritor(es)</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-white/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/70 bg-white/40 text-left text-xs uppercase tracking-wide text-slate-500 backdrop-blur-sm">
              <th className="py-2.5 pr-3 pl-3">#</th>
              <th className="py-2.5 pr-3">Prescritor</th>
              <th className="py-2.5 pr-3">CRM</th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => setSortKey(col.key)}
                  className={`cursor-pointer select-none whitespace-nowrap py-2.5 pr-3 transition-colors hover:text-indigo-600 ${
                    sortKey === col.key ? "font-semibold text-indigo-600" : ""
                  }`}
                >
                  {col.label} {sortKey === col.key ? "▼" : ""}
                </th>
              ))}
              <th className="py-2.5 pr-3">Pacientes</th>
              <th className="py-2.5 pr-3">Itens</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.medico}
                className="border-b border-slate-100/70 transition-colors last:border-b-0 hover:bg-white/50"
              >
                <td className="py-2.5 pr-3 pl-3 text-slate-400">{idx + 1}</td>
                <td className="py-2.5 pr-3 font-medium text-slate-900">{r.medico || "(sem nome)"}</td>
                <td className="py-2.5 pr-3 text-slate-500">{r.nrReg || "-"}</td>
                <td className="py-2.5 pr-3">
                  <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-sm font-semibold tabular-nums text-indigo-700 ring-1 ring-inset ring-indigo-500/20">
                    {formatNumber(r.volumeReceitas)}
                  </span>
                </td>
                <td className="py-2.5 pr-3 tabular-nums">{formatCurrency(r.valorTotal)}</td>
                <td className="py-2.5 pr-3 tabular-nums">
                  {formatCurrency(r.margemTotal)}{" "}
                  <span className="text-xs text-slate-400">
                    ({formatPercent(r.margemPercentual)})
                  </span>
                </td>
                <td className="py-2.5 pr-3 tabular-nums">{formatCurrency(r.ticketMedioPorReceita)}</td>
                <td className="py-2.5 pr-3 tabular-nums">{formatNumber(r.pacientesAtendidos)}</td>
                <td className="py-2.5 pr-3 tabular-nums">{formatNumber(r.totalItens)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
