
export interface Canhoto {
  id: string;
  cliente: string;
  contrato_id: string;
  data_entrega_cliente: string;
  data_programada_pagamento: string;
  data_recebimento_canhoto: string;
  motorista: string;
  numero_cte: string;
  numero_manifesto: string;
  numero_nota_fiscal: string;
  proprietario_veiculo: string;
  responsavel_recebimento: string;
  saldo_a_pagar: number;
  status: "Pendente" | "Recebido";
}
