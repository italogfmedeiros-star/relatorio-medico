import * as XLSX from "xlsx";
import type { Prescricao } from "./types";
import type { Metrics } from "./metrics";
import { formatMonth } from "./format";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function exportToExcel(
  records: Prescricao[],
  metrics: Metrics,
  fileNamePrefix = "relatorio-prescricoes"
) {
  const wb = XLSX.utils.book_new();

  const visaoGeralSheet = XLSX.utils.json_to_sheet([
    { Métrica: "Total de Receitas", Valor: metrics.visaoGeral.totalReceitas },
    { Métrica: "Total de Itens", Valor: metrics.visaoGeral.totalItens },
    { Métrica: "Total de Pacientes", Valor: metrics.visaoGeral.totalPacientes },
    { Métrica: "Total de Prescritores", Valor: metrics.visaoGeral.totalPrescritores },
    { Métrica: "Valor Total (R$)", Valor: round2(metrics.visaoGeral.valorTotal) },
    { Métrica: "Custo Total (R$)", Valor: round2(metrics.visaoGeral.custoTotal) },
    { Métrica: "Margem Total (R$)", Valor: round2(metrics.visaoGeral.margemTotal) },
    { Métrica: "Margem (%)", Valor: round2(metrics.visaoGeral.margemPercentual) },
    { Métrica: "Ticket Médio por Receita (R$)", Valor: round2(metrics.visaoGeral.ticketMedioPorReceita) },
  ]);
  XLSX.utils.book_append_sheet(wb, visaoGeralSheet, "Visão Geral");

  const prescritoresSheet = XLSX.utils.json_to_sheet(
    metrics.porPrescritor.map((p) => ({
      Prescritor: p.medico,
      CRM: p.nrReg,
      "Volume de Receitas": p.volumeReceitas,
      "Pacientes Atendidos": p.pacientesAtendidos,
      Itens: p.totalItens,
      "Valor Total (R$)": round2(p.valorTotal),
      "Custo Total (R$)": round2(p.custoTotal),
      "Margem (R$)": round2(p.margemTotal),
      "Margem (%)": round2(p.margemPercentual),
      "Ticket Médio (R$)": round2(p.ticketMedioPorReceita),
    }))
  );
  XLSX.utils.book_append_sheet(wb, prescritoresSheet, "Prescritores");

  const filialSheet = XLSX.utils.json_to_sheet(
    metrics.porFilial.map((f) => ({
      Filial: f.empresa,
      Receitas: f.totalReceitas,
      Itens: f.totalItens,
      "Valor Total (R$)": round2(f.valorTotal),
      "Custo Total (R$)": round2(f.custoTotal),
      "Margem (R$)": round2(f.margemTotal),
    }))
  );
  XLSX.utils.book_append_sheet(wb, filialSheet, "Filial");

  const formaSheet = XLSX.utils.json_to_sheet(
    metrics.porForma.map((f) => ({
      Forma: f.forma,
      Itens: f.totalItens,
      Quantidade: f.qtdeTotal,
      "Valor Total (R$)": round2(f.valorTotal),
    }))
  );
  XLSX.utils.book_append_sheet(wb, formaSheet, "Forma Farmacêutica");

  const ufSheet = XLSX.utils.json_to_sheet(
    metrics.porUF.map((u) => ({
      UF: u.uf,
      Receitas: u.totalReceitas,
      "Valor Total (R$)": round2(u.valorTotal),
    }))
  );
  XLSX.utils.book_append_sheet(wb, ufSheet, "UF");

  const visitadorSheet = XLSX.utils.json_to_sheet(
    metrics.porVisitador.map((v) => ({
      Visitador: v.visitNome,
      Receitas: v.totalReceitas,
      "Valor Total (R$)": round2(v.valorTotal),
    }))
  );
  XLSX.utils.book_append_sheet(wb, visitadorSheet, "Visitador");

  const evolucaoSheet = XLSX.utils.json_to_sheet(
    metrics.evolucaoMensal.map((m) => ({
      Mês: formatMonth(m.mes),
      Receitas: m.totalReceitas,
      "Valor Total (R$)": round2(m.valorTotal),
      "Custo Total (R$)": round2(m.custoTotal),
      "Margem (R$)": round2(m.margemTotal),
    }))
  );
  XLSX.utils.book_append_sheet(wb, evolucaoSheet, "Evolução Mensal");

  const pacientesSheet = XLSX.utils.json_to_sheet(
    metrics.topPacientes.map((p) => ({
      Paciente: p.paciente,
      Receitas: p.totalReceitas,
      "Valor Total (R$)": round2(p.valorTotal),
    }))
  );
  XLSX.utils.book_append_sheet(wb, pacientesSheet, "Top Pacientes");

  const detalhadoSheet = XLSX.utils.json_to_sheet(
    records.map((r) => ({
      Receita: r.receita,
      SQ: r.sq,
      Paciente: r.paciente,
      Prescritor: r.medico,
      CRM: r.nrReg,
      Data: r.data.toLocaleDateString("pt-BR"),
      "Valor (R$)": round2(r.valor),
      "Custo (R$)": round2(r.custo),
      Forma: r.forma,
      Qtde: r.qtde,
      Filial: r.empresa,
      "Valor Bruto (R$)": round2(r.vlBruto),
      "Desconto (R$)": round2(r.vlDesconto),
      UF: r.uf,
      "UF Registro": r.ufRegistro,
      Visitador: r.visitNome,
    }))
  );
  XLSX.utils.book_append_sheet(wb, detalhadoSheet, "Detalhado");

  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  XLSX.writeFile(wb, `${fileNamePrefix}_${timestamp}.xlsx`);
}
