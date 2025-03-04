

export interface SaldoPagar {
  id?: number;
  parceiro: string;
  valor_total: number;
  valor_pago?: number;
  saldo_restante?: number;
  contratos_associados?: string;
  dados_bancarios?: string;
  vencimento?: string;
  data_pagamento?: string;
  status?: string;
  banco_pagamento?: string;
  observacoes?: string;
}

export interface ParceiroInfo {
  id?: number;
  nome: string;
  documento: string;
  dados_bancarios?: {
    banco: string;
    agencia: string;
    conta: string;
    tipo_conta: string;
    pix?: string;
  };
  created_at?: string;
}

export interface ContratoSelecionado {
  id: string;
  cliente_destino: string;
  valor_frete: number;
  status_contrato: string;
  selecionado: boolean;
}

export interface PagamentoSaldo {
  valor_pago: number;
  data_pagamento: string;
  banco_pagamento: string;
  observacoes?: string;
  ids_contratos: string[];
}

