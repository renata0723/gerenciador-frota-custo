
export interface SaldoPagar {
  id?: number;
  parceiro?: string;
  valor_total?: number;
  valor_pago?: number;
  saldo_restante?: number;
  data_pagamento?: string;
  vencimento?: string;
  contratos_associados?: string;
  banco_pagamento?: string;
  dados_bancarios?: string;
  observacoes?: string;
  status?: string;
  ids_contratos?: string[];
}

export interface ParceiroInfo {
  id?: number;
  nome: string;
  documento?: string;
  dados_bancarios?: any;
  created_at?: string;
}

export interface PagamentoSaldo {
  valor_pago: number;
  data_pagamento: string;
  banco_pagamento: string;
  observacoes?: string;
  ids_contratos?: string[];
}
