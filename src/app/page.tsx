import UploadDropzone from "@/components/UploadDropzone";

export default function Home() {
  return (
    <main id="main-content" className="flex-1 flex items-center justify-center px-6 py-20 sm:py-28">
      <div className="grid w-full max-w-5xl gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="max-w-md animate-fade-up">
          <span className="glass-chip text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            Análise de prescrições manipuladas
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-900 text-balance">
            O relatório do ERP vira painel completo em segundos
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-600 text-pretty">
            Envie o relatório de prescrições de receitas manipuladas e veja o volume de
            receitas por prescritor, margem, evolução mensal e mais — processado
            inteiramente no seu navegador.
          </p>
          <dl className="mt-9 grid grid-cols-3 gap-4 border-t border-slate-900/10 pt-6 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Formatos</dt>
              <dd className="mt-1 font-medium tabular-nums text-slate-800">CSV · XLS · XLSX</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Processamento</dt>
              <dd className="mt-1 font-medium text-slate-800">100% local</dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Exportação</dt>
              <dd className="mt-1 font-medium text-slate-800">Excel (.xlsx)</dd>
            </div>
          </dl>
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "90ms" }}>
          <UploadDropzone />
        </div>
      </div>
    </main>
  );
}
