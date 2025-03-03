
export type TipoDespesa = "descarga" | "reentrega" | "no-show" | "outros" | "administrativa" | "diaria" | "pedagio" | "alimentacao" | "hospedagem" | "multa" | "equipamentos";

export interface Despesa {
  id?: number;
  data_despesa: string;
  tipo_despesa: TipoDespesa;
  descricao_detalhada: string;
  valor_despesa: number;
  contrato_id?: string | null;
  categoria?: "viagem" | "administrativa";
  rateio?: boolean;
  contabilizado?: boolean;
  conta_contabil?: string;
}

export interface DespesaFormData {
  data: string;
  tipo: TipoDespesa;
  descricao: string;
  valor: number;
  contrato?: string;
  categoria: "viagem" | "administrativa";
  rateio: boolean;
  contabilizar?: boolean;
  conta_contabil?: string;
}
