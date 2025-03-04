
export type StatusItem = 'ativo' | 'inativo' | 'pendente' | 'pago';

export interface FolhaPagamento {
  id?: number;
  funcionario_nome: string;
  mes_referencia: string;
  ano_referencia: string;
  salario_base: number;
  horas_extras: number;
  valor_horas_extras: number;
  faltas: number;
  valor_faltas: number;
  adiantamentos: number;
  outros_descontos: number;
  outros_acrescimos: number;
  inss: number;
  ir: number;
  fgts: number;
  valor_liquido: number;
  data_pagamento: string;
  observacoes?: string;
  status: StatusItem;
  created_at?: string;
}
