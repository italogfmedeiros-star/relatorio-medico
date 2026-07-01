import type { Prescricao } from "./types";

export interface FilterState {
  dataInicio: string;
  dataFim: string;
  empresa: string;
  forma: string;
  uf: string;
  medico: string;
}

export const EMPTY_FILTERS: FilterState = {
  dataInicio: "",
  dataFim: "",
  empresa: "",
  forma: "",
  uf: "",
  medico: "",
};

export interface FilterOptions {
  empresas: string[];
  formas: string[];
  ufs: string[];
}

export function getFilterOptions(records: Prescricao[]): FilterOptions {
  return {
    empresas: [...new Set(records.map((r) => r.empresa).filter(Boolean))].sort(),
    formas: [...new Set(records.map((r) => r.forma).filter(Boolean))].sort(),
    ufs: [...new Set(records.map((r) => r.uf).filter(Boolean))].sort(),
  };
}

export function applyFilters(records: Prescricao[], filters: FilterState): Prescricao[] {
  const dataInicio = filters.dataInicio ? new Date(filters.dataInicio + "T00:00:00") : null;
  const dataFim = filters.dataFim ? new Date(filters.dataFim + "T23:59:59") : null;
  const medicoQuery = filters.medico.trim().toLowerCase();

  return records.filter((r) => {
    if (dataInicio && r.data < dataInicio) return false;
    if (dataFim && r.data > dataFim) return false;
    if (filters.empresa && r.empresa !== filters.empresa) return false;
    if (filters.forma && r.forma !== filters.forma) return false;
    if (filters.uf && r.uf !== filters.uf) return false;
    if (medicoQuery && !r.medico.toLowerCase().includes(medicoQuery)) return false;
    return true;
  });
}

export function hasActiveFilters(filters: FilterState): boolean {
  return Object.values(filters).some((v) => v !== "");
}
