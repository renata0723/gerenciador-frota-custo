
export interface Canhoto {
  id?: number;
  contrato_id?: number | string;
  data_recebimento?: string;
  data_entrega_cliente?: string;
  responsavel_recebimento?: string;
  status?: string;
  observacoes?: string;
  data_recebimento_controladoria?: string;
  data_recebimento_mercadoria?: string;
  
  // Campos adicionais necessários
  cliente?: string;
  motorista?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  data_recebimento_canhoto?: string;
  data_programada_pagamento?: string;
  data_entrega?: string;
  saldo_a_pagar?: number;
  proprietario_veiculo?: string;
}

// Interface para busca de canhotos
export interface CanhotoBusca {
  contrato_id?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  cliente?: string;
  data_inicio?: string;
  data_fim?: string;
  status?: string;
}

// Interface para canhotos pendentes
export interface CanhotoPendente {
  id: number;
  contrato_id: string;
  cliente: string;
  data_entrega?: string;
  data_entrega_cliente?: string;
  motorista?: string;
  status: string;
  numero_cte?: string;
  numero_manifesto?: string;
  numero_nota_fiscal?: string;
  saldo_a_pagar?: number;
  proprietario_veiculo?: string;
  responsavel_recebimento?: string;
  data_recebimento_canhoto?: string;
  data_programada_pagamento?: string;
}

// Interface para filtros de canhoto
export interface CanhotoFiltro {
  status?: string;
  periodo?: string;
  cliente?: string;
  motorista?: string;
  contrato_id?: string;
}

// Interface para cancelamento de documentos
export interface CancelamentoDocumento {
  id: number;
  tipo_documento: string;
  numero_documento: string;
  motivo: string;
  observacoes?: string;
  responsavel: string;
  data_cancelamento: string;
}
