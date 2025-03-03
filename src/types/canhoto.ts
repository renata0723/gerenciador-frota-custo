
import { CanhotoStatus } from "@/utils/constants";

export interface Canhoto {
  id: number;
  contrato_id: string;
  cliente: string;
  motorista: string;
  numero_manifesto?: string;
  numero_cte?: string;
  numero_nota_fiscal?: string;
  data_entrega_cliente: string;
  data_recebimento_canhoto?: string;
  responsavel_recebimento?: string;
  status: CanhotoStatus;
  data_programada_pagamento?: string;
  proprietario_veiculo?: string;
  saldo_a_pagar?: number;
}

export interface CanhotoPendente extends Pick<Canhoto, 'contrato_id' | 'cliente' | 'motorista'> {
  data_entrega?: string;
  numero_nota_fiscal?: string;
}
