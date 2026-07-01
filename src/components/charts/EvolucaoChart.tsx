"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MetricaMensal } from "@/lib/metrics";
import { formatCurrency, formatMonth } from "@/lib/format";

const GLASS_TOOLTIP_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: 12,
  boxShadow: "0 12px 32px -14px rgba(30,41,59,0.3)",
  fontSize: 13,
};

export default function EvolucaoChart({ data }: { data: MetricaMensal[] }) {
  const chartData = data.map((d) => ({
    ...d,
    mesLabel: formatMonth(d.mes),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="valorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
        <XAxis dataKey="mesLabel" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "rgba(100,116,139,0.2)" }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
          tickLine={false}
          tickFormatter={(v) => new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(v)}
        />
        <Tooltip
          contentStyle={GLASS_TOOLTIP_STYLE}
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
        <Area
          type="monotone"
          dataKey="valorTotal"
          stroke="#4f46e5"
          strokeWidth={2.5}
          fill="url(#valorGradient)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="margemTotal"
          stroke="#0d9488"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
