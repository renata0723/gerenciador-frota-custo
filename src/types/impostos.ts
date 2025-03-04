
// Interfaces para o sistema de impostos

export interface ApuracaoImpostos {
  id?: number;
  periodo_inicio: string;
  periodo_fim: string;
  receita_bruta: number;
  base_calculo_pis_cofins: number;
  valor_pis: number;
  valor_cofins: number;
  base_calculo_irpj: number;
  valor_irpj: number;
  valor_irpj_adicional: number;
  base_calculo_csll: number;
  valor_csll: number;
  status: string;
  data_apuracao: string;
  created_at?: string;
}

export interface CreditoTributario {
  id?: number;
  tipo_credito: string;
  descricao: string;
  valor: number;
  data_aquisicao: string;
  data_vencimento?: string;
  utilizado: boolean;
  status: string;
  created_at?: string;
}

export interface OperacaoTributavel {
  id?: number;
  tipo_documento: string;
  numero_documento: string;
  data_emissao: string;
  valor_operacao: number;
  base_calculo: number;
  aliquota: number;
  valor_imposto: number;
  cliente: string;
  fornecedor: string;
  status: string;
  created_at?: string;
}
