import { create } from "zustand";
import type { ParseResult } from "./types";

interface ReportState {
  result: ParseResult | null;
  setResult: (result: ParseResult) => void;
  clear: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  result: null,
  setResult: (result) => set({ result }),
  clear: () => set({ result: null }),
}));
