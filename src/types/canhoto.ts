
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
