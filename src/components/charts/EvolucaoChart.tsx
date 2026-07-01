"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MetricaMensal } from "@/lib/metrics";
import { formatCurrency, formatMonth } from "@/lib/format";

export default function EvolucaoChart({ data }: { data: MetricaMensal[] }) {
  const chartData = data.map((d) => ({
    ...d,
    mesLabel: formatMonth(d.mes),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="mesLabel" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(v)}
        />
        <Tooltip
          formatter={(value, name) => {
            const n = typeof value === "number" ? value : Number(value);
            if (name === "totalReceitas") return [n, "Receitas"];
            return [formatCurrency(n), name === "valorTotal" ? "Valor" : "Margem"];
          }}
          labelFormatter={(label) => label}
        />
        <Legend
          formatter={(value) =>
            value === "valorTotal" ? "Valor Total" : value === "margemTotal" ? "Margem" : value
          }
        />
        <Line type="monotone" dataKey="valorTotal" stroke="#2563eb" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="margemTotal" stroke="#16a34a" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
