interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}

export default function MetricCard({ label, value, subtitle, highlight }: MetricCardProps) {
  return (
    <div
      className={`glass-panel p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-16px_rgba(79,70,229,0.35)] ${
        highlight ? "border-indigo-200/70 bg-indigo-500/10" : ""
      }`}
    >
      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tracking-tight tabular-nums text-slate-900">
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs tabular-nums text-slate-500">{subtitle}</p>}
    </div>
  );
}
