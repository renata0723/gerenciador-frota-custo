
export type StatusItem = 'ativo' | 'inativo' | 'pendente' | 'concluido' | 'cancelado' | 'aberto' | 'fechado';
export type TipoMovimento = 'entrada' | 'saida';
export type TipoConta = 'ativo' | 'passivo' | 'receita' | 'despesa' | 'patrimonio';

export interface LancamentoContabil {
  id?: number;
  data_lancamento: string;
  data_competencia: string;
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

export interface ContaContabil {
  codigo: string;
  codigo_reduzido: string;
  nome: string;
  tipo: TipoConta;
  natureza: 'devedora' | 'credora';
  nivel: number;
  conta_pai?: string;
  status: StatusItem;
}

export interface CentroCusto {
  codigo: string;
  nome: string;
  responsavel?: string;
  status: StatusItem;
}

export interface LivroCaixaItem {
  id?: number;
  data_movimento: string;
  tipo: TipoMovimento;
  descricao: string;
  valor: number;
  saldo: number;
  documento_referencia?: string;
  lancamento_contabil_id?: number;
  status: StatusItem;
  created_at?: string;
}

export interface DREData {
  id?: number;
  periodo_inicio: string;
  periodo_fim: string;
  receita_bruta: number;
  receita_liquida: number;
  custos_operacionais: number;
  despesas_administrativas: number;
  resultado_periodo: number;
  status: StatusItem;
  created_at?: string;
  updated_at?: string;
  folha_pagamento?: number;
}

export interface BalancoPatrimonialData {
  id?: number;
  data_fechamento: string;
  ativos_totais?: number;
  passivos_totais?: number;
  patrimonio_liquido?: number;
  status: StatusItem;
  created_at?: string;
  updated_at?: string;
  ativo_circulante?: number;
  ativo_nao_circulante?: number;
  passivo_circulante?: number;
  passivo_nao_circulante?: number;
}

export interface FolhaPagamento {
  id?: number;
  funcionario_nome: string;
  salario_base: number;
  data_pagamento: string;
  mes_referencia: string;
  ano_referencia: string;
  inss?: number;
  fgts?: number;
  ir?: number;
  vale_transporte?: number;
  vale_refeicao?: number;
  outros_descontos?: number;
  outros_beneficios?: number;
  valor_liquido: number;
  observacoes?: string;
  status: StatusItem;
  created_at?: string;
}

export interface RelatorioContabil {
  id?: number;
  nome: string;
  tipo: string;
  periodo_inicio: string;
  periodo_fim: string;
  data_geracao: string;
  gerado_por: string;
  arquivo_url?: string;
  observacoes?: string;
}

export interface SaldoPagarItem {
  id?: number;
  parceiro: string;
  valor_total: number;
  valor_pago?: number;
  saldo_restante?: number;
  vencimento: string;
  status?: 'pendente' | 'concluido' | 'cancelado';
  data_pagamento?: string;
  banco_pagamento?: string;
  observacoes?: string;
}

export interface ApuracaoCustoResultado {
  id?: number;
  periodo_inicio: string;
  periodo_fim: string;
  receita_fretes: number;
  custo_combustivel: number;
  custo_manutencao: number;
  custo_pneus: number;
  custo_salarios: number;
  despesas_administrativas: number;
  despesas_financeiras: number;
  outros_custos: number;
  resultado_bruto?: number;
  resultado_liquido?: number;
  margem_lucro?: number;
  custo_km?: number;
  km_rodados: number;
  observacoes?: string;
  status: StatusItem;
  created_at?: string;
}
