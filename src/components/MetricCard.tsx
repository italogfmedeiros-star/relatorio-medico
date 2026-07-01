interface MetricCardProps {
  label: string;
  value: string;
  subtitle?: string;
  highlight?: boolean;
}

export default function MetricCard({ label, value, subtitle, highlight }: MetricCardProps) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        highlight ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
