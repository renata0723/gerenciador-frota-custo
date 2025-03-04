

export interface CanhotoPendente {
  id?: number;
  contrato_id?: string;
  cliente?: string;
  motorista?: string;
  proprietario_veiculo?: string;
  numero_cte?: string;
  numero_manifesto?: string;
  numero_nota_fiscal?: string;
  status?: string;
  data_recebimento_canhoto?: string;
  responsavel_recebimento?: string;
  data_entrega_cliente?: string;
  data_programada_pagamento?: string;
  saldo_a_pagar?: number;
  observacoes?: string;
  data_recebimento_mercadoria?: string;
  data_recebimento_controladoria?: string;
}

export interface Canhoto extends CanhotoPendente {
  observacoes?: string;
}

export interface CanhotoBusca {
  id?: number;
  contrato_id?: string;
  cliente?: string;
  status?: string;
  numero_nota_fiscal?: string;
  numero_cte?: string;
  numero_manifesto?: string;
}

export interface CanhotoFormData {
  data_recebimento_canhoto: string;
  data_entrega_cliente: string;
  responsavel_recebimento: string;
  observacoes?: string;
  data_recebimento_mercadoria: string;
  data_recebimento_controladoria: string;
}

export interface CanhotoFiltro {
  status?: string;
  cliente?: string;
  dataInicio?: string;
  dataFim?: string;
  motorista?: string;
  contrato_id?: string;
}

export interface CancelamentoDocumento {
  id?: number;
  tipo_documento: string;
  numero_documento: string;
  motivo: string;
  responsavel: string;
  observacoes?: string;
  data_cancelamento?: string;
}

