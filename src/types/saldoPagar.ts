
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
  dadosBancarios?: DadosBancarios;
}

export interface ParceiroInfo {
  id?: number;
  nome: string;
  documento: string;
  dadosBancarios?: DadosBancarios;
  created_at?: string;
}

export interface DadosBancarios {
  banco?: string;
  agencia?: string;
  conta?: string;
  tipo_conta?: string;
  pix?: string;
}

export interface SaldoPagar extends SaldoItem {
  status: string;
}

export interface PagamentoSaldo {
  id: number;
  valor_pago: number;
  data_pagamento: string;
  banco_pagamento: string;
  observacoes?: string;
}

export interface ProprietarioFormValues {
  nome: string;
  documento: string;
  dadosBancarios: {
    banco?: string;
    agencia?: string;
    conta?: string;
    tipo_conta?: string;
    pix?: string;
  };
}

export interface SaldoPagarItem {
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
}

// Definição de status do saldo a pagar em objeto com propriedades value e label
export interface StatusSaldoPagar {
  value: string;
  label: string;
}

// Definição dos tipos para componentes de saldo a pagar
export interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onSubmit: (saldo: SaldoItem) => void;
  onNext?: () => void;
  somenteLeitura?: boolean;
  isLoading?: boolean;
}

export interface FormularioPagamentoProps {
  saldo: SaldoItem;
  onSubmit: (pagamento: PagamentoSaldo) => void;
  onCancel: () => void;
}
