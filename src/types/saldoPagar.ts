
export interface SaldoItem {
  id: number;
  parceiro: string;
  valor_total: number;
  valor_pago: number;
  saldo_restante: number;
  vencimento: string;
  data_pagamento?: string;
  banco_pagamento?: string;
  status: string;
  contratos_associados?: string;
  dados_bancarios?: string;
  dadosBancarios?: {
    banco?: string;
    agencia?: string;
    conta?: string;
    tipoConta?: string;
    pix?: string;
  }
}

export interface ParceiroInfo {
  id?: number;
  nome: string;
  documento: string;
  dadosBancarios?: {
    banco?: string;
    agencia?: string;
    conta?: string;
    tipo_conta?: string;
    pix?: string;
  }
  created_at?: string;
}
