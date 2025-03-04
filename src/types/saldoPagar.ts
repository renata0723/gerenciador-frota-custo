
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
}
