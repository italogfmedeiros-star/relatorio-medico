"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { parseErpFile } from "@/lib/parser";
import { useReportStore } from "@/lib/store";

const ACCEPTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

export default function UploadDropzone() {
  const router = useRouter();
  const setResult = useReportStore((s) => s.setResult);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
      if (!ACCEPTED_EXTENSIONS.includes(ext)) {
        setError(`Formato não suportado (${ext}). Envie um arquivo .csv, .xls ou .xlsx.`);
        return;
      }
      setError(null);
      setIsProcessing(true);
      try {
        const result = await parseErpFile(file);
        if (result.records.length === 0) {
          setError("Não foi possível encontrar linhas de dados válidas neste arquivo.");
          setIsProcessing(false);
          return;
        }
        setResult(result);
        router.push("/dashboard");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erro ao processar o arquivo.");
      } finally {
        setIsProcessing(false);
      }
    },
    [router, setResult]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-xl">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        aria-label="Enviar relatório do ERP"
        className={`glass-panel-strong flex flex-col items-center justify-center gap-4 border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${
          isDragging
            ? "border-indigo-400 bg-indigo-50/60 shadow-[0_20px_50px_-16px_rgba(79,70,229,0.4)] scale-[1.01]"
            : "border-slate-300/70 hover:border-indigo-300 hover:shadow-[0_20px_50px_-18px_rgba(30,41,59,0.3)]"
        }`}
      >
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br transition-transform duration-300 ${
            isDragging ? "scale-110 from-indigo-500 to-sky-500" : "from-indigo-400 to-sky-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </div>
        {isProcessing ? (
          <p className="text-sm font-medium text-slate-700">Processando arquivo…</p>
        ) : (
          <>
            <p className="text-sm font-medium text-slate-800">
              Arraste o relatório aqui ou clique para selecionar
            </p>
            <p className="text-xs text-slate-500">
              Formatos aceitos: .csv, .xls, .xlsx — exportado do ERP
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS.join(",")}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>
      {error && (
        <p className="glass-panel mt-3 px-4 py-2.5 text-center text-sm text-red-700 border-red-200/70 bg-red-50/60">
          {error}
        </p>
      )}
    </div>
  );
}
