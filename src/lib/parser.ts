import * as XLSX from "xlsx";
import type { Prescricao, ParseResult } from "./types";

const EXPECTED_HEADERS = [
  "Receita",
  "SQ",
  "Nome",
  "NomeMed",
  "NrReg",
  "Data",
  "Valor",
  "CUSTO",
  "Forma",
  "Qtde",
  "Visitador",
  "Empresa",
  "VlBruto",
  "VlDesconto",
  "UF",
  "UF_REGISTRO",
  "VISIT_NOME",
];

function parseBRNumber(raw: unknown): number {
  if (typeof raw === "number") return raw;
  if (raw == null) return 0;
  const s = String(raw).trim();
  if (!s) return 0;
  const normalized = s.replace(/\./g, "").replace(",", ".");
  const n = parseFloat(normalized);
  return Number.isNaN(n) ? 0 : n;
}

function parseBRDate(raw: unknown): Date | null {
  if (raw == null) return null;
  if (raw instanceof Date) return raw;
  const s = String(raw).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d));
}

function rowToPrescricao(row: Record<string, unknown>): Prescricao | null {
  const data = parseBRDate(row["Data"]);
  if (!data) return null;
  return {
    receita: String(row["Receita"] ?? "").trim(),
    sq: Number(row["SQ"] ?? 0) || 0,
    paciente: String(row["Nome"] ?? "").trim(),
    medico: String(row["NomeMed"] ?? "").trim(),
    nrReg: String(row["NrReg"] ?? "").trim(),
    data,
    valor: parseBRNumber(row["Valor"]),
    custo: parseBRNumber(row["CUSTO"]),
    forma: String(row["Forma"] ?? "").trim(),
    qtde: parseBRNumber(row["Qtde"]),
    visitador: String(row["Visitador"] ?? "").trim(),
    empresa: String(row["Empresa"] ?? "").trim(),
    vlBruto: parseBRNumber(row["VlBruto"]),
    vlDesconto: parseBRNumber(row["VlDesconto"]),
    uf: String(row["UF"] ?? "").trim(),
    ufRegistro: String(row["UF_REGISTRO"] ?? "").trim(),
    visitNome: String(row["VISIT_NOME"] ?? "").trim(),
  };
}

function parseCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

function parseCsvText(text: string): Record<string, unknown>[] {
  const lines = text.split(/\r\n|\n|\r/).filter((l) => l.length > 0);
  if (lines.length === 0) return [];
  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = parseCsvLine(lines[0], delimiter).map((h) => h.trim());
  const rows: Record<string, unknown>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i], delimiter);
    if (cells.every((c) => c.trim() === "")) continue;
    const row: Record<string, unknown> = {};
    headers.forEach((h, idx) => {
      if (h) row[h] = cells[idx];
    });
    rows.push(row);
  }
  return rows;
}

async function readCsv(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  // ERP exports come in Latin-1 (ISO-8859-1) encoding.
  const decoder = new TextDecoder("iso-8859-1");
  const text = decoder.decode(buffer);
  return parseCsvText(text);
}

async function readSpreadsheet(file: File): Promise<Record<string, unknown>[]> {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
}

export function extractReportTimestamp(fileName: string): Date | null {
  const m = fileName.match(/_(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})(\d{2})\.\w+$/);
  if (!m) return null;
  const [, d, mo, y, h, mi, s] = m;
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
}

export async function parseErpFile(file: File): Promise<ParseResult> {
  const warnings: string[] = [];
  const ext = file.name.split(".").pop()?.toLowerCase();

  let rawRows: Record<string, unknown>[];
  if (ext === "csv") {
    rawRows = await readCsv(file);
  } else if (ext === "xls" || ext === "xlsx") {
    rawRows = await readSpreadsheet(file);
  } else {
    throw new Error(`Formato de arquivo não suportado: .${ext}`);
  }

  if (rawRows.length === 0) {
    warnings.push("Nenhuma linha de dados encontrada no arquivo.");
  } else {
    const foundHeaders = Object.keys(rawRows[0]);
    const missing = EXPECTED_HEADERS.filter((h) => !foundHeaders.includes(h));
    if (missing.length > 0) {
      warnings.push(`Colunas esperadas não encontradas: ${missing.join(", ")}`);
    }
  }

  const records: Prescricao[] = [];
  let skipped = 0;
  for (const row of rawRows) {
    const rec = rowToPrescricao(row);
    if (rec) {
      records.push(rec);
    } else {
      skipped++;
    }
  }
  if (skipped > 0) {
    warnings.push(`${skipped} linha(s) ignorada(s) por dados inválidos (ex: data ausente).`);
  }

  return {
    fileName: file.name,
    parsedAt: new Date(),
    records,
    warnings,
  };
}
