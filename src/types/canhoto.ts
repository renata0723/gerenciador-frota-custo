
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
}

export interface CanhotoFiltro {
  status?: string;
  cliente?: string;
  dataInicio?: string;
  dataFim?: string;
  motorista?: string;
  contrato_id?: string;
}
