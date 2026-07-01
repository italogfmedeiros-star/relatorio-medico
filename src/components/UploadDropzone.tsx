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
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        {isProcessing ? (
          <p className="text-sm font-medium text-gray-700">Processando arquivo…</p>
        ) : (
          <>
            <p className="text-sm font-medium text-gray-700">
              Arraste o relatório aqui ou clique para selecionar
            </p>
            <p className="text-xs text-gray-500">
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
        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
