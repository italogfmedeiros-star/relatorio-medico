export interface Prescricao {
  receita: string;
  sq: number;
  paciente: string;
  medico: string;
  nrReg: string;
  data: Date;
  valor: number;
  custo: number;
  forma: string;
  qtde: number;
  visitador: string;
  empresa: string;
  vlBruto: number;
  vlDesconto: number;
  uf: string;
  ufRegistro: string;
  visitNome: string;
}

export interface ParseResult {
  fileName: string;
  parsedAt: Date;
  records: Prescricao[];
  warnings: string[];
}
