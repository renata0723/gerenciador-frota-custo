
import { supabase } from "@/integrations/supabase/client";

// Interface para Balancete
export interface Balancete {
  id?: number;
  conta_codigo: string;
  conta_nome: string;
  periodo_inicio: string;
  periodo_fim: string;
  saldo_anterior?: number;
  debitos?: number;
  creditos?: number;
  saldo_atual?: number;
  nivel: number;
  natureza?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para Lançamento Contábil
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
  status?: string;
  periodo_fiscal_fechado?: boolean;
}

// Interface para Conta Contábil
export interface ContaContabil {
  codigo: string;
  nome: string;
  nivel: number;
  natureza: string;
  tipo: string;
  codigo_reduzido?: string;
  conta_pai?: string;
  status?: string;
}

// Interface para Centro de Custo
export interface CentroCusto {
  codigo: string;
  nome: string;
  responsavel?: string;
  status?: string;
}

// Interface para Livro Caixa
export interface LivroCaixaItem {
  id?: number;
  data_movimento: string;
  tipo: 'entrada' | 'saida';
  descricao: string;
  valor: number;
  saldo?: number;
  documento_referencia?: string;
  lancamento_contabil_id?: number;
  status?: string;
}

// Interface para DRE
export interface DRE {
  id?: number;
  periodo_inicio: string;
  periodo_fim: string;
  receita_bruta?: number;
  receita_liquida?: number;
  custos_operacionais?: number;
  despesas_administrativas?: number;
  resultado_periodo?: number;
  status?: string;
}

// Interface para Balanço Patrimonial
export interface BalancoPatrimonial {
  id?: number;
  data_balanco: string;
  periodo: string;
  ativo_circulante?: number;
  ativo_nao_circulante?: number;
  passivo_circulante?: number;
  passivo_nao_circulante?: number;
  patrimonio_liquido?: number;
  status?: string;
}

// Função para adicionar balancete
export const adicionarBalancete = async (balancete: Partial<Balancete>): Promise<Balancete | null> => {
  try {
    // Garantir que o balancete tenha todos os campos obrigatórios
    if (!balancete.conta_codigo || !balancete.conta_nome || !balancete.nivel || 
        !balancete.periodo_inicio || !balancete.periodo_fim) {
      console.error('Erro ao adicionar balancete: campos obrigatórios ausentes');
      return null;
    }
    
    const { data, error } = await supabase
      .from('balancete')
      .insert({
        conta_codigo: balancete.conta_codigo,
        conta_nome: balancete.conta_nome,
        periodo_inicio: balancete.periodo_inicio,
        periodo_fim: balancete.periodo_fim,
        saldo_anterior: balancete.saldo_anterior || 0,
        debitos: balancete.debitos || 0,
        creditos: balancete.creditos || 0,
        saldo_atual: balancete.saldo_atual || 0,
        nivel: balancete.nivel,
        natureza: balancete.natureza || 'devedora',
        status: balancete.status || 'ativo'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar balancete:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar balancete:', error);
    return null;
  }
};

// Substitui a implementação anterior com problema
export const criarBalancete = adicionarBalancete;

// Funções para lançamentos contábeis
export const listarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .order('data_lancamento', { ascending: false });
      
    if (error) {
      console.error('Erro ao listar lançamentos contábeis:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao listar lançamentos contábeis:', error);
    return [];
  }
};

export const adicionarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert({
        data_lancamento: lancamento.data_lancamento,
        data_competencia: lancamento.data_competencia,
        conta_debito: lancamento.conta_debito,
        conta_credito: lancamento.conta_credito,
        valor: lancamento.valor,
        historico: lancamento.historico,
        documento_referencia: lancamento.documento_referencia,
        tipo_documento: lancamento.tipo_documento,
        centro_custo: lancamento.centro_custo,
        status: lancamento.status || 'ativo'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao adicionar lançamento contábil:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar lançamento contábil:', error);
    return null;
  }
};

// Funções para Plano de Contas
export const listarPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .order('codigo', { ascending: true });
      
    if (error) {
      console.error('Erro ao listar plano de contas:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao listar plano de contas:', error);
    return [];
  }
};

export const getPlanoContas = listarPlanoContas;
export const buscarPlanoContas = listarPlanoContas;

export const criarContaContabil = async (conta: ContaContabil): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .insert({
        codigo: conta.codigo,
        nome: conta.nome,
        nivel: conta.nivel,
        natureza: conta.natureza,
        tipo: conta.tipo,
        codigo_reduzido: conta.codigo_reduzido,
        conta_pai: conta.conta_pai,
        status: conta.status || 'ativo'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao criar conta contábil:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao criar conta contábil:', error);
    return null;
  }
};

// Funções para Centros de Custo
export const listarCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*')
      .order('codigo', { ascending: true });
      
    if (error) {
      console.error('Erro ao listar centros de custo:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao listar centros de custo:', error);
    return [];
  }
};

export const getContaContabilByCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo_reduzido', codigoReduzido)
      .single();
      
    if (error) {
      console.error('Erro ao buscar conta por código reduzido:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar conta por código reduzido:', error);
    return null;
  }
};

// Funções para Livro Caixa
export const getLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .order('data_movimento', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar livro caixa:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar livro caixa:', error);
    return [];
  }
};

export const criarLivroCaixaItem = async (item: LivroCaixaItem): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .insert({
        data_movimento: item.data_movimento,
        tipo: item.tipo,
        descricao: item.descricao,
        valor: item.valor,
        saldo: item.saldo,
        documento_referencia: item.documento_referencia,
        lancamento_contabil_id: item.lancamento_contabil_id,
        status: item.status || 'ativo'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao criar item de livro caixa:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao criar item de livro caixa:', error);
    return null;
  }
};

// Funções para DRE
export const getDRE = async (): Promise<DRE[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .order('periodo_fim', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar DRE:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar DRE:', error);
    return [];
  }
};

export const criarDRE = async (dre: DRE): Promise<DRE | null> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .insert({
        periodo_inicio: dre.periodo_inicio,
        periodo_fim: dre.periodo_fim,
        receita_bruta: dre.receita_bruta || 0,
        receita_liquida: dre.receita_liquida || 0,
        custos_operacionais: dre.custos_operacionais || 0,
        despesas_administrativas: dre.despesas_administrativas || 0,
        resultado_periodo: dre.resultado_periodo || 0,
        status: dre.status || 'aberto'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao criar DRE:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao criar DRE:', error);
    return null;
  }
};

// Funções para Balanço Patrimonial
export const getBalancosPatrimoniais = async (): Promise<BalancoPatrimonial[]> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .order('data_balanco', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar balanços patrimoniais:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar balanços patrimoniais:', error);
    return [];
  }
};

export const criarBalancoPatrimonial = async (balanco: BalancoPatrimonial): Promise<BalancoPatrimonial | null> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .insert({
        data_balanco: balanco.data_balanco,
        periodo: balanco.periodo,
        ativo_circulante: balanco.ativo_circulante || 0,
        ativo_nao_circulante: balanco.ativo_nao_circulante || 0,
        passivo_circulante: balanco.passivo_circulante || 0,
        passivo_nao_circulante: balanco.passivo_nao_circulante || 0,
        patrimonio_liquido: balanco.patrimonio_liquido || 0,
        status: balanco.status || 'ativo'
      })
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao criar balanço patrimonial:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao criar balanço patrimonial:', error);
    return null;
  }
};
