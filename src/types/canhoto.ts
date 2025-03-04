
import { canhotoStatus } from '@/utils/constants';

export interface Canhoto {
  id: number;
  contrato_id?: string;
  numero_nota_fiscal?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  data_recebimento_canhoto?: string;
  data_entrega_cliente?: string;
  data_programada_pagamento?: string;
  responsavel_recebimento?: string;
  cliente?: string;
  motorista?: string;
  proprietario_veiculo?: string;
  saldo_a_pagar?: number;
  status?: string;
}

export interface CanhotoFilter {
  contrato_id?: string;
  numero_nota_fiscal?: string;
  numero_manifesto?: string;
  numero_cte?: string;
  cliente?: string;
  motorista?: string;
  status?: string;
}

export interface LancamentoCanhoto {
  id?: number;
  contrato_id?: string;
  numero_nota_fiscal?: string;
  data_recebimento_canhoto: string;
  data_entrega_cliente?: string;
  data_programada_pagamento?: string;
  responsavel_recebimento: string;
  saldo_a_pagar?: number;
}
