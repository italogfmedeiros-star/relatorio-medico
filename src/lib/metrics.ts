import { format } from "date-fns";
import type { Prescricao } from "./types";

function distinctCount<T>(items: T[], key: (item: T) => string): number {
  return new Set(items.map(key)).size;
}

function sum(items: Prescricao[], key: (item: Prescricao) => number): number {
  return items.reduce((acc, item) => acc + key(item), 0);
}

export interface VisaoGeral {
  totalReceitas: number;
  totalItens: number;
  totalPacientes: number;
  totalPrescritores: number;
  valorTotal: number;
  custoTotal: number;
  margemTotal: number;
  margemPercentual: number;
  ticketMedioPorReceita: number;
  periodoInicio: Date | null;
  periodoFim: Date | null;
}

export interface MetricaPrescritor {
  medico: string;
  nrReg: string;
  volumeReceitas: number;
  totalItens: number;
  pacientesAtendidos: number;
  valorTotal: number;
  custoTotal: number;
  margemTotal: number;
  margemPercentual: number;
  ticketMedioPorReceita: number;
}

export interface MetricaFilial {
  empresa: string;
  totalReceitas: number;
  totalItens: number;
  valorTotal: number;
  custoTotal: number;
  margemTotal: number;
}

export interface MetricaForma {
  forma: string;
  totalItens: number;
  qtdeTotal: number;
  valorTotal: number;
}

export interface MetricaUF {
  uf: string;
  totalReceitas: number;
  valorTotal: number;
}

export interface MetricaVisitador {
  visitNome: string;
  totalReceitas: number;
  valorTotal: number;
}

export interface MetricaMensal {
  mes: string;
  totalReceitas: number;
  valorTotal: number;
  custoTotal: number;
  margemTotal: number;
}

export interface MetricaPaciente {
  paciente: string;
  totalReceitas: number;
  valorTotal: number;
}

export interface Metrics {
  visaoGeral: VisaoGeral;
  porPrescritor: MetricaPrescritor[];
  porFilial: MetricaFilial[];
  porForma: MetricaForma[];
  porUF: MetricaUF[];
  porVisitador: MetricaVisitador[];
  evolucaoMensal: MetricaMensal[];
  topPacientes: MetricaPaciente[];
}

function margemPct(valorTotal: number, custoTotal: number): number {
  return valorTotal > 0 ? ((valorTotal - custoTotal) / valorTotal) * 100 : 0;
}

function computeVisaoGeral(records: Prescricao[]): VisaoGeral {
  const valorTotal = sum(records, (r) => r.valor);
  const custoTotal = sum(records, (r) => r.custo);
  const totalReceitas = distinctCount(records, (r) => r.receita);
  const datas = records.map((r) => r.data.getTime()).filter((t) => !Number.isNaN(t));
  return {
    totalReceitas,
    totalItens: records.length,
    totalPacientes: distinctCount(records, (r) => r.paciente),
    totalPrescritores: distinctCount(records, (r) => r.medico),
    valorTotal,
    custoTotal,
    margemTotal: valorTotal - custoTotal,
    margemPercentual: margemPct(valorTotal, custoTotal),
    ticketMedioPorReceita: totalReceitas > 0 ? valorTotal / totalReceitas : 0,
    periodoInicio: datas.length ? new Date(Math.min(...datas)) : null,
    periodoFim: datas.length ? new Date(Math.max(...datas)) : null,
  };
}

/**
 * Volume total de receitas por prescritor: cada receita é contada uma única
 * vez por médico, mesmo que possua vários itens (linhas) na mesma receita.
 */
function computePorPrescritor(records: Prescricao[]): MetricaPrescritor[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const list = grupos.get(r.medico) ?? [];
    list.push(r);
    grupos.set(r.medico, list);
  }

  const result: MetricaPrescritor[] = [];
  for (const [medico, itens] of grupos) {
    const valorTotal = sum(itens, (r) => r.valor);
    const custoTotal = sum(itens, (r) => r.custo);
    const volumeReceitas = distinctCount(itens, (r) => r.receita);
    result.push({
      medico,
      nrReg: itens[0]?.nrReg ?? "",
      volumeReceitas,
      totalItens: itens.length,
      pacientesAtendidos: distinctCount(itens, (r) => r.paciente),
      valorTotal,
      custoTotal,
      margemTotal: valorTotal - custoTotal,
      margemPercentual: margemPct(valorTotal, custoTotal),
      ticketMedioPorReceita: volumeReceitas > 0 ? valorTotal / volumeReceitas : 0,
    });
  }

  return result.sort((a, b) => b.valorTotal - a.valorTotal);
}

function computePorFilial(records: Prescricao[]): MetricaFilial[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const key = r.empresa || "(sem filial)";
    const list = grupos.get(key) ?? [];
    list.push(r);
    grupos.set(key, list);
  }
  const result: MetricaFilial[] = [];
  for (const [empresa, itens] of grupos) {
    const valorTotal = sum(itens, (r) => r.valor);
    const custoTotal = sum(itens, (r) => r.custo);
    result.push({
      empresa,
      totalReceitas: distinctCount(itens, (r) => r.receita),
      totalItens: itens.length,
      valorTotal,
      custoTotal,
      margemTotal: valorTotal - custoTotal,
    });
  }
  return result.sort((a, b) => b.valorTotal - a.valorTotal);
}

function computePorForma(records: Prescricao[]): MetricaForma[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const key = r.forma || "(sem forma)";
    const list = grupos.get(key) ?? [];
    list.push(r);
    grupos.set(key, list);
  }
  const result: MetricaForma[] = [];
  for (const [forma, itens] of grupos) {
    result.push({
      forma,
      totalItens: itens.length,
      qtdeTotal: sum(itens, (r) => r.qtde),
      valorTotal: sum(itens, (r) => r.valor),
    });
  }
  return result.sort((a, b) => b.valorTotal - a.valorTotal);
}

function computePorUF(records: Prescricao[]): MetricaUF[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const key = r.uf || "(sem UF)";
    const list = grupos.get(key) ?? [];
    list.push(r);
    grupos.set(key, list);
  }
  const result: MetricaUF[] = [];
  for (const [uf, itens] of grupos) {
    result.push({
      uf,
      totalReceitas: distinctCount(itens, (r) => r.receita),
      valorTotal: sum(itens, (r) => r.valor),
    });
  }
  return result.sort((a, b) => b.valorTotal - a.valorTotal);
}

function computePorVisitador(records: Prescricao[]): MetricaVisitador[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const key = r.visitNome || "(sem visitador)";
    const list = grupos.get(key) ?? [];
    list.push(r);
    grupos.set(key, list);
  }
  const result: MetricaVisitador[] = [];
  for (const [visitNome, itens] of grupos) {
    result.push({
      visitNome,
      totalReceitas: distinctCount(itens, (r) => r.receita),
      valorTotal: sum(itens, (r) => r.valor),
    });
  }
  return result.sort((a, b) => b.valorTotal - a.valorTotal);
}

function computeEvolucaoMensal(records: Prescricao[]): MetricaMensal[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const key = format(r.data, "yyyy-MM");
    const list = grupos.get(key) ?? [];
    list.push(r);
    grupos.set(key, list);
  }
  const result: MetricaMensal[] = [];
  for (const [mes, itens] of grupos) {
    const valorTotal = sum(itens, (r) => r.valor);
    const custoTotal = sum(itens, (r) => r.custo);
    result.push({
      mes,
      totalReceitas: distinctCount(itens, (r) => r.receita),
      valorTotal,
      custoTotal,
      margemTotal: valorTotal - custoTotal,
    });
  }
  return result.sort((a, b) => a.mes.localeCompare(b.mes));
}

function computeTopPacientes(records: Prescricao[], limit = 20): MetricaPaciente[] {
  const grupos = new Map<string, Prescricao[]>();
  for (const r of records) {
    const list = grupos.get(r.paciente) ?? [];
    list.push(r);
    grupos.set(r.paciente, list);
  }
  const result: MetricaPaciente[] = [];
  for (const [paciente, itens] of grupos) {
    result.push({
      paciente,
      totalReceitas: distinctCount(itens, (r) => r.receita),
      valorTotal: sum(itens, (r) => r.valor),
    });
  }
  return result.sort((a, b) => b.valorTotal - a.valorTotal).slice(0, limit);
}

export function computeMetrics(records: Prescricao[]): Metrics {
  return {
    visaoGeral: computeVisaoGeral(records),
    porPrescritor: computePorPrescritor(records),
    porFilial: computePorFilial(records),
    porForma: computePorForma(records),
    porUF: computePorUF(records),
    porVisitador: computePorVisitador(records),
    evolucaoMensal: computeEvolucaoMensal(records),
    topPacientes: computeTopPacientes(records),
  };
}
