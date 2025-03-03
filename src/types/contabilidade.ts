
export interface LancamentoContabil {
  id?: number;
  data_lancamento: string | Date;
  data_competencia: string | Date;
  conta_debito: string;
  conta_credito: string;
  valor: number;
  historico: string;
  documento_referencia?: string;
  tipo_documento?: string;
  centro_custo?: string;
  status: StatusItem;
  periodo_fiscal_fechado?: boolean;
  created_at?: string;
}

export type StatusItem = 'ativo' | 'inativo' | 'pendente' | 'concluido' | 'aberto' | 'fechado';

export interface ContaContabil {
  codigo: string;
  codigo_reduzido: string;
  nome: string;
  tipo: 'ativo' | 'passivo' | 'receita' | 'despesa' | 'patrimonio';
  natureza: 'devedora' | 'credora';
  conta_pai?: string;
  nivel: number;
  status: StatusItem;
}

export interface CentroCusto {
  codigo: string;
  nome: string;
  responsavel?: string;
  status: StatusItem;
}

export interface DREData {
  id?: number;
  periodo_inicio: string | Date;
  periodo_fim: string | Date;
  receita_bruta: number;
  receita_liquida: number;
  custos_operacionais: number;
  despesas_administrativas: number;
  resultado_periodo: number;
  status: StatusItem;
  periodo_fechado?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface BalancoPatrimonialData {
  id?: number;
  data_fechamento: string | Date;
  ativo_circulante?: number;
  ativo_nao_circulante?: number;
  passivo_circulante?: number;
  passivo_nao_circulante?: number;
  patrimonio_liquido?: number;
  status: StatusItem;
  created_at?: string;
}

export interface LivroCaixaItem {
  id?: number;
  data_movimento: string | Date;
  descricao: string;
  tipo: 'entrada' | 'saida';
  valor: number;
  saldo: number;
  documento_referencia?: string;
  lancamento_contabil_id?: number;
  status: StatusItem;
  created_at?: string;
}
