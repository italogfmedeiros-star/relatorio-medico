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
    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Data início</label>
          <input
            type="date"
            value={filters.dataInicio}
            onChange={(e) => set("dataInicio", e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Data fim</label>
          <input
            type="date"
            value={filters.dataFim}
            onChange={(e) => set("dataFim", e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-500">Filial</label>
          <select
            value={filters.empresa}
            onChange={(e) => set("empresa", e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
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
          <label className="text-xs font-medium text-gray-500">Forma Farmacêutica</label>
          <select
            value={filters.forma}
            onChange={(e) => set("forma", e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
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
          <label className="text-xs font-medium text-gray-500">UF</label>
          <select
            value={filters.uf}
            onChange={(e) => set("uf", e.target.value)}
            className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
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
          <label className="text-xs font-medium text-gray-500">Prescritor</label>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={filters.medico}
            onChange={(e) => set("medico", e.target.value)}
            className="w-48 rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          {active && (
            <button
              onClick={() =>
                onChange({ dataInicio: "", dataFim: "", empresa: "", forma: "", uf: "", medico: "" })
              }
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Limpar filtros
            </button>
          )}
          <button
            onClick={onExport}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
      <p className="mt-3 text-xs text-gray-500">
        Exibindo {filteredCount.toLocaleString("pt-BR")} de {totalCount.toLocaleString("pt-BR")} itens
        {active ? " (filtrado)" : ""}
      </p>
    </div>
  );
}
