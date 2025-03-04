
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
