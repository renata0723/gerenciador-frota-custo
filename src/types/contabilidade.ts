
// Tipos para o módulo de contabilidade

export type TipoConta = 'Ativo' | 'Passivo' | 'Receita' | 'Despesa' | 'Patrimônio Líquido';
export type NaturezaConta = 'Devedora' | 'Credora';
export type TipoMovimento = 'Entrada' | 'Saída';
export type StatusItem = 'ativo' | 'inativo';

export interface ContaContabil {
  codigo: string;
  nome: string;
  tipo: TipoConta;
  natureza: NaturezaConta;
  conta_pai?: string;
  nivel: number;
  status: StatusItem;
}

export interface LancamentoContabil {
  id?: number;
  data_lancamento: string;
  conta_debito: string;
  conta_credito: string;
  valor: number;
  historico: string;
  documento_referencia?: string;
  tipo_documento?: string;
  data_competencia: string;
  centro_custo?: string;
  status: StatusItem;
  created_at?: string;
}

export interface CentroCusto {
  codigo: string;
  nome: string;
  responsavel?: string;
  status: StatusItem;
}

export interface DREData {
  id?: number;
  periodo_inicio: string;
  periodo_fim: string;
  receita_bruta?: number;
  deducoes?: number;
  receita_liquida?: number;
  custos?: number;
  lucro_bruto?: number;
  despesas_operacionais?: number;
  resultado_operacional?: number;
  resultado_financeiro?: number;
  resultado_antes_ir_csll?: number;
  provisao_ir_csll?: number;
  resultado_liquido?: number;
  status: StatusItem;
  created_at?: string;
}

export interface BalancoPatrimonialData {
  id?: number;
  data_fechamento: string;
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
  data_movimento: string;
  descricao: string;
  tipo: TipoMovimento;
  valor: number;
  saldo: number;
  documento_referencia?: string;
  lancamento_contabil_id?: number;
  status: StatusItem;
  created_at?: string;
}
