"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useReportStore } from "@/lib/store";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/format";
import { computeMetrics } from "@/lib/metrics";
import { EMPTY_FILTERS, applyFilters, getFilterOptions, type FilterState } from "@/lib/filters";
import { exportToExcel } from "@/lib/export";
import MetricCard from "@/components/MetricCard";
import Section from "@/components/Section";
import PrescritorTable from "@/components/PrescritorTable";
import SimpleTable from "@/components/SimpleTable";
import FilterBar from "@/components/FilterBar";
import EvolucaoChart from "@/components/charts/EvolucaoChart";
import BarChartSimple from "@/components/charts/BarChartSimple";

export default function DashboardPage() {
  const router = useRouter();
  const result = useReportStore((s) => s.result);
  const clear = useReportStore((s) => s.clear);
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  useEffect(() => {
    if (!result) {
      router.replace("/");
    }
  }, [result, router]);

  const filterOptions = useMemo(
    () => (result ? getFilterOptions(result.records) : { empresas: [], formas: [], ufs: [] }),
    [result]
  );

  const filteredRecords = useMemo(
    () => (result ? applyFilters(result.records, filters) : []),
    [result, filters]
  );

  const metrics = useMemo(() => computeMetrics(filteredRecords), [filteredRecords]);

  if (!result) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-500">Redirecionando…</p>
      </main>
    );
  }

  const { visaoGeral, porPrescritor, porFilial, porForma, porUF, porVisitador, evolucaoMensal, topPacientes } =
    metrics;

  const topPrescritoresChart = porPrescritor
    .slice()
    .sort((a, b) => b.volumeReceitas - a.volumeReceitas)
    .slice(0, 10)
    .map((p) => ({ nome: p.medico.split(" ").slice(0, 2).join(" "), volumeReceitas: p.volumeReceitas }));

  return (
    <main className="flex-1 px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Dashboard de Prescrições
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Arquivo: {result.fileName} · Processado em {formatDate(result.parsedAt)} · Período:{" "}
            {formatDate(visaoGeral.periodoInicio)} a {formatDate(visaoGeral.periodoFim)}
          </p>
        </div>
        <button
          onClick={() => {
            clear();
            router.push("/");
          }}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
          Enviar outro arquivo
        </button>
      </div>

      {result.warnings.length > 0 && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {result.warnings.map((w, i) => (
            <p key={i}>⚠ {w}</p>
          ))}
        </div>
      )}

      <FilterBar
        filters={filters}
        options={filterOptions}
        onChange={setFilters}
        onExport={() => exportToExcel(filteredRecords, metrics)}
        filteredCount={filteredRecords.length}
        totalCount={result.records.length}
      />

      {filteredRecords.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
          Nenhum registro encontrado para os filtros selecionados.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <MetricCard label="Receitas" value={formatNumber(visaoGeral.totalReceitas)} subtitle={`${formatNumber(visaoGeral.totalItens)} itens`} />
            <MetricCard label="Valor Total" value={formatCurrency(visaoGeral.valorTotal)} highlight />
            <MetricCard label="Custo Total" value={formatCurrency(visaoGeral.custoTotal)} />
            <MetricCard
              label="Margem"
              value={formatCurrency(visaoGeral.margemTotal)}
              subtitle={formatPercent(visaoGeral.margemPercentual)}
            />
            <MetricCard label="Ticket Médio" value={formatCurrency(visaoGeral.ticketMedioPorReceita)} subtitle="por receita" />
            <MetricCard label="Pacientes" value={formatNumber(visaoGeral.totalPacientes)} />
            <MetricCard label="Prescritores" value={formatNumber(visaoGeral.totalPrescritores)} />
            <MetricCard label="Filiais" value={formatNumber(porFilial.length)} />
            <MetricCard label="Formas Farmacêuticas" value={formatNumber(porForma.length)} />
            <MetricCard label="Estados (UF)" value={formatNumber(porUF.length)} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Section title="Evolução Mensal" subtitle="Valor e margem por mês">
              <EvolucaoChart data={evolucaoMensal} />
            </Section>
            <Section title="Top 10 Prescritores por Volume de Receitas" subtitle="Quantidade de receitas distintas vinculadas a cada prescritor">
              <BarChartSimple
                data={topPrescritoresChart}
                xKey="nome"
                yKey="volumeReceitas"
                color="#2563eb"
                valueFormatter={(v) => formatNumber(v)}
              />
            </Section>
          </div>

          <div className="mb-6">
            <Section
              title="Ranking de Prescritores"
              subtitle="Volume total de receitas vinculadas a cada prescritor, valor, margem e ticket médio"
            >
              <PrescritorTable data={porPrescritor} />
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Section title="Por Filial (Empresa)">
              <SimpleTable
                rows={porFilial}
                rowKey={(r) => r.empresa}
                columns={[
                  { key: "empresa", label: "Filial", render: (r) => r.empresa },
                  { key: "totalReceitas", label: "Receitas", render: (r) => formatNumber(r.totalReceitas), align: "right" },
                  { key: "valorTotal", label: "Valor Total", render: (r) => formatCurrency(r.valorTotal), align: "right" },
                  { key: "margemTotal", label: "Margem", render: (r) => formatCurrency(r.margemTotal), align: "right" },
                ]}
              />
            </Section>
            <Section title="Por UF">
              <SimpleTable
                rows={porUF}
                rowKey={(r) => r.uf}
                columns={[
                  { key: "uf", label: "UF", render: (r) => r.uf },
                  { key: "totalReceitas", label: "Receitas", render: (r) => formatNumber(r.totalReceitas), align: "right" },
                  { key: "valorTotal", label: "Valor Total", render: (r) => formatCurrency(r.valorTotal), align: "right" },
                ]}
              />
            </Section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Section title="Por Forma Farmacêutica">
              <SimpleTable
                rows={porForma}
                rowKey={(r) => r.forma}
                columns={[
                  { key: "forma", label: "Forma", render: (r) => r.forma },
                  { key: "totalItens", label: "Itens", render: (r) => formatNumber(r.totalItens), align: "right" },
                  { key: "qtdeTotal", label: "Qtde", render: (r) => formatNumber(r.qtdeTotal), align: "right" },
                  { key: "valorTotal", label: "Valor Total", render: (r) => formatCurrency(r.valorTotal), align: "right" },
                ]}
              />
            </Section>
            <Section title="Por Visitador">
              <SimpleTable
                rows={porVisitador}
                rowKey={(r) => r.visitNome}
                columns={[
                  { key: "visitNome", label: "Visitador", render: (r) => r.visitNome },
                  { key: "totalReceitas", label: "Receitas", render: (r) => formatNumber(r.totalReceitas), align: "right" },
                  { key: "valorTotal", label: "Valor Total", render: (r) => formatCurrency(r.valorTotal), align: "right" },
                ]}
              />
            </Section>
          </div>

          <div className="mb-10">
            <Section title="Top 20 Pacientes por Valor">
              <SimpleTable
                rows={topPacientes}
                rowKey={(r) => r.paciente}
                columns={[
                  { key: "paciente", label: "Paciente", render: (r) => r.paciente },
                  { key: "totalReceitas", label: "Receitas", render: (r) => formatNumber(r.totalReceitas), align: "right" },
                  { key: "valorTotal", label: "Valor Total", render: (r) => formatCurrency(r.valorTotal), align: "right" },
                ]}
              />
            </Section>
          </div>
        </>
      )}
    </main>
  );
}
