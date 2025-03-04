
export interface DadosBancarios {
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: string;
  pix: string;
}

export interface SaldoPagarItem {
  id?: number;
  parceiro?: string;
  valor_total?: number;
  valor_pago?: number;
  saldo_restante?: number;
  contratos_associados?: string;
  dados_bancarios?: string | DadosBancarios;
  data_pagamento?: string;
  vencimento?: string;
  banco_pagamento?: string;
  status?: string;
}

export interface ParceiroInfo {
  nome: string;
  documento?: string;
  dadosBancarios?: DadosBancarios;
  id?: number;
}
