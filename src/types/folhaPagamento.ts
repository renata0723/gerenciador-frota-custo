
export type StatusItem = 'ativo' | 'inativo' | 'pendente' | 'concluido' | 'cancelado' | 'aberto' | 'fechado' | 'pago';

export interface FolhaPagamento {
  id?: number;
  funcionario_nome: string;
  salario_base: number;
  data_pagamento: string;
  mes_referencia: string;
  ano_referencia: string;
  inss?: number;
  fgts?: number;
  ir?: number;
  vale_transporte?: number;
  vale_refeicao?: number;
  outros_descontos?: number;
  outros_beneficios?: number;
  valor_liquido: number;
  observacoes?: string;
  status: StatusItem;
  created_at?: string;
}

export interface FolhaPagamentoFiltro {
  ano?: string;
  mes?: string;
  status?: StatusItem;
}
