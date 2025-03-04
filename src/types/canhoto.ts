
export interface Canhoto {
  id?: number;
  contrato_id?: string;
  cliente?: string;
  motorista?: string;
  proprietario_veiculo?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  data_entrega_cliente?: string;
  data_recebimento_canhoto?: string;
  responsavel_recebimento?: string;
  data_programada_pagamento?: string;
  status?: string;
  saldo_a_pagar?: number;
}

export interface CanhotoPendente {
  id: number;
  contrato_id: string;
  cliente: string;
  motorista: string;
  data_entrega_cliente: string | null;
  data_entrega: string | null; // Campo adicional para compatibilidade
  status: string;
}

export interface CancelamentoDocumento {
  id: number;
  documento_id: string;
  tipo_documento: string;
  motivo: string;
  observacoes?: string;
  data_cancelamento: string;
  usuario_cancelamento: string;
  numero_documento: string;
  responsavel: string;
  status: string;
}
