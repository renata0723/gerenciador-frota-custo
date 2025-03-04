
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
}
