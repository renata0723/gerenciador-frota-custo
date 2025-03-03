
export interface Canhoto {
  id: number;
  contrato_id: string;
  cliente: string;
  motorista: string;
  data_entrega_cliente: string;
  data_recebimento_canhoto?: string;
  status: 'Pendente' | 'Recebido' | 'Aguardando';
  responsavel_recebimento?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  proprietario_veiculo?: string;
  saldo_a_pagar?: number;
  data_programada_pagamento?: string;
}
