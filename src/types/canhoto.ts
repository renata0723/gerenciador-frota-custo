
export interface Canhoto {
  id?: number;
  contrato_id?: number | string;
  data_recebimento?: string;
  data_entrega_cliente?: string;
  responsavel_recebimento?: string;
  status?: string;
  observacoes?: string;
  
  // Campos adicionais necessários
  cliente?: string;
  motorista?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  data_recebimento_canhoto?: string;
  data_programada_pagamento?: string;
  data_recebimento_mercadoria?: string;
  data_recebimento_controladoria?: string;
  saldo_a_pagar?: number;
  proprietario_veiculo?: string;
}

// Adicionando interfaces ausentes
export interface CanhotoBusca {
  contrato_id?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  cliente?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
}

export interface CanhotoPendente {
  id: number;
  contrato_id: string;
  cliente: string;
  data_entrega: string;
  motorista?: string;
  status: string;
}

export interface CanhotoFiltro {
  status?: string;
  periodo?: string;
  cliente?: string;
}

export interface CancelamentoDocumento {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  motivo: string;
  observacoes?: string;
  responsavel: string;
  data_cancelamento: string;
}
