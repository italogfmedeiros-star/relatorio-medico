import UploadDropzone from "@/components/UploadDropzone";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-16">
      <div className="text-center max-w-xl">
        <h1 className="text-2xl font-semibold text-gray-900">
          Relatório de Prescrições de Receitas Manipuladas
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Envie o relatório exportado do ERP para gerar automaticamente o dashboard com
          métricas de vendas, prescritores, filiais, formas farmacêuticas e evolução no
          período.
        </p>
      </div>
      <UploadDropzone />
    </main>
  );
}
