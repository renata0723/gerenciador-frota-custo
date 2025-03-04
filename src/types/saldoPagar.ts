
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

// Adicionando os tipos necessários que estavam faltando
export type SaldoPagar = SaldoPagarItem;

export interface PagamentoSaldo {
  id: number;
  saldo_id: number;
  valor: number;
  data_pagamento: string;
  metodo_pagamento: string;
  comprovante?: string;
  observacoes?: string;
}

export interface ProprietarioFormValues {
  nome: string;
  documento: string;
  dadosBancarios: DadosBancarios;
}

// Tipo SaldoItem utilizado na tabela de saldos pendentes
export interface SaldoItem extends SaldoPagarItem {
  id: number;
  parceiro: string;
  valor_total: number;
  valor_pago?: number;
  saldo_restante?: number;
  contratos_associados?: string;
  status: string;
  vencimento?: string;
}
