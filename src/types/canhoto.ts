
import { StatusItem } from '@/types/contabilidade';

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

export interface CancelamentoDocumento {
  id?: number;
  tipo_documento: string;
  numero_documento: string;
  motivo: string;
  responsavel: string;
  observacoes?: string;
  data_cancelamento?: string;
}

export interface CanhotoPendente {
  id: number;
  contrato_id?: string;
  status?: string;
  numero_nota_fiscal?: string;
  data_entrega_cliente?: string;
  data_entrega?: string; // Adicionado para compatibilidade
  cliente?: string; // Adicionado para compatibilidade
  motorista?: string; // Adicionado para compatibilidade
}
