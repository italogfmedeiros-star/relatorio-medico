"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const GLASS_TOOLTIP_STYLE: React.CSSProperties = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.7)",
  borderRadius: 12,
  boxShadow: "0 12px 32px -14px rgba(30,41,59,0.3)",
  fontSize: 13,
};

export default function BarChartSimple({
  data,
  xKey,
  yKey,
  color = "#4f46e5",
  valueFormatter,
  height = 260,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  valueFormatter?: (v: number) => string;
  height?: number;
}) {
  const gradientId = `barGradient-${yKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.95} />
            <stop offset="100%" stopColor={color} stopOpacity={0.55} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" />
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 11, fill: "#64748b" }}
          axisLine={{ stroke: "rgba(100,116,139,0.2)" }}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={{ stroke: "rgba(100,116,139,0.2)" }} tickLine={false} />
        <Tooltip
          contentStyle={GLASS_TOOLTIP_STYLE}
          cursor={{ fill: "rgba(79,70,229,0.06)" }}
          formatter={(v) => {
            const n = typeof v === "number" ? v : Number(v);
            return valueFormatter ? valueFormatter(n) : n;
          }}
        />
        <Bar dataKey={yKey} fill={`url(#${gradientId})`} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
