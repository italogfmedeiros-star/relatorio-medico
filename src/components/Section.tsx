export default function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel p-5 transition-shadow duration-300 hover:shadow-[0_18px_44px_-18px_rgba(30,41,59,0.28)] sm:p-6">
      <div className="mb-4">
        <h2 className="text-[15px] font-semibold tracking-tight text-slate-900">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
