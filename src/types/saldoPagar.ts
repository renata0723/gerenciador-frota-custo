
export interface ParceiroInfo {
  nome: string;
  documento: string;
  dados_bancarios?: string;
  created_at?: string;
  id?: number;
}

export interface SaldoPagar {
  id?: number;
  parceiro?: string;
  valor_total?: number;
  valor_pago?: number;
  saldo_restante?: number;
  contratos_associados?: string;
  vencimento?: string;
  data_pagamento?: string;
  banco_pagamento?: string;
  dados_bancarios?: string;
  status?: string;
  ids_contratos?: string[];
  observacoes?: string;
}

export interface PagamentoSaldo {
  id?: number;
  parceiro?: string;
  valor_total?: number;
  valor_pago?: number;
  saldo_restante?: number;
  contratos_associados?: string;
  vencimento?: string;
  data_pagamento?: string;
  banco_pagamento?: string;
  dados_bancarios?: string;
  status?: string;
  ids_contratos?: string[];
  observacoes?: string;
}

export interface ProprietarioFormValues {
  nome: string;
  documento: string;
  tipoConta: string;
  banco: string;
  agencia: string;
  conta: string;
  pix?: string;
}
