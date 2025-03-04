
export type CanhotoStatus = 'Pendente' | 'Recebido' | 'Cancelado';

export interface Canhoto {
  id: number;
  contrato_id: string;
  cliente: string;
  motorista: string;
  data_entrega_cliente: string | null;
  data_recebimento_canhoto: string | null;
  responsavel_recebimento: string | null;
  numero_manifesto: string | null;
  numero_cte: string | null;
  numero_nota_fiscal: string | null;
  status: CanhotoStatus;
  data_programada_pagamento: string | null;
  proprietario_veiculo: string | null;
  saldo_a_pagar: number | null;
}

export interface CanhotoPendente {
  id: number;
  contrato_id: string;
  cliente: string;
  motorista: string;
  data_entrega: string;
}
