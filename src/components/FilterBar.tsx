"use client";

import type { FilterState, FilterOptions } from "@/lib/filters";
import { hasActiveFilters } from "@/lib/filters";

interface FilterBarProps {
  filters: FilterState;
  options: FilterOptions;
  onChange: (filters: FilterState) => void;
  onExport: () => void;
  filteredCount: number;
  totalCount: number;
}

export default function FilterBar({
  filters,
  options,
  onChange,
  onExport,
  filteredCount,
  totalCount,
}: FilterBarProps) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    onChange({ ...filters, [key]: value });

  const active = hasActiveFilters(filters);

  return (
    <div className="glass-panel mb-6 p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Data início</label>
          <input
            type="date"
            value={filters.dataInicio}
            onChange={(e) => set("dataInicio", e.target.value)}
            className="glass-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Data fim</label>
          <input
            type="date"
            value={filters.dataFim}
            onChange={(e) => set("dataFim", e.target.value)}
            className="glass-input"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Filial</label>
          <select
            value={filters.empresa}
            onChange={(e) => set("empresa", e.target.value)}
            className="glass-input"
          >
            <option value="">Todas</option>
            {options.empresas.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Forma Farmacêutica</label>
          <select
            value={filters.forma}
            onChange={(e) => set("forma", e.target.value)}
            className="glass-input"
          >
            <option value="">Todas</option>
            {options.formas.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">UF</label>
          <select
            value={filters.uf}
            onChange={(e) => set("uf", e.target.value)}
            className="glass-input"
          >
            <option value="">Todas</option>
            {options.ufs.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">Prescritor</label>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filters.medico}
            onChange={(e) => set("medico", e.target.value)}
            className="glass-input w-48"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {active && (
            <button
              onClick={() =>
                onChange({ dataInicio: "", dataFim: "", empresa: "", forma: "", uf: "", medico: "" })
              }
              className="text-sm text-slate-500 underline decoration-slate-300 underline-offset-2 transition-colors hover:text-slate-700"
            >
              Limpar filtros
            </button>
          )}
          <button
            onClick={onExport}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-10px_rgba(79,70,229,0.6)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
              />
            </svg>
            Exportar Excel
          </button>
        </div>
      </div>
      <p className="mt-3 text-xs tabular-nums text-slate-500">
        Exibindo {filteredCount.toLocaleString("pt-BR")} de {totalCount.toLocaleString("pt-BR")} itens
        {active ? " (filtrado)" : ""}
      </p>
    </div>
  );
}
