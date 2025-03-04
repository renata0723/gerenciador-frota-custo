
export interface CanhotoPendente {
  id?: number;
  contrato_id?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  cliente?: string;
  data_entrega?: string;
  data_entrega_cliente?: string;
  status?: string;
  data_recebimento_canhoto?: string;
  data_programada_pagamento?: string;
  saldo_a_pagar?: number;
  motorista?: string;
  proprietario_veiculo?: string;
  responsavel_recebimento?: string;
}

export interface CanhotoRegistrado {
  id?: number;
  contrato_id: string;
  data_recebimento_canhoto: string;
  data_entrega_cliente: string;
  responsavel_recebimento: string;
  observacoes?: string;
  status?: string;
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
