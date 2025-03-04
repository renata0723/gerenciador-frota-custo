
import { supabase } from "@/integrations/supabase/client";
import { 
  LancamentoContabil, 
  ContaContabil, 
  CentroCusto, 
  BalancoPatrimonial, 
  DREData, 
  LivroCaixaItem,
  TipoMovimento,
  StatusItem
} from "@/types/contabilidade";

// Buscar lançamentos contábeis
export const buscarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*');
    
    if (error) throw error;

    // Converter tipos
    return data.map(item => ({
      ...item,
      status: item.status as StatusItem
    }));
  } catch (error) {
    console.error('Erro ao buscar lançamentos contábeis:', error);
    return [];
  }
};

// Buscar plano de contas
export const buscarPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*');
    
    if (error) throw error;

    // Converter tipos
    return data.map(item => ({
      ...item,
      tipo: item.tipo as "ativo" | "passivo" | "receita" | "despesa" | "patrimonio",
      natureza: item.natureza,
      nivel: item.nivel,
      status: item.status as StatusItem
    }));
  } catch (error) {
    console.error('Erro ao buscar plano de contas:', error);
    return [];
  }
};

// Buscar centros de custo
export const buscarCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*');
    
    if (error) throw error;

    // Converter tipos
    return data.map(item => ({
      ...item,
      status: item.status as StatusItem
    }));
  } catch (error) {
    console.error('Erro ao buscar centros de custo:', error);
    return [];
  }
};

// Buscar conta contábil por código reduzido
export const buscarContaContabilByCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo_reduzido', codigoReduzido)
      .single();
    
    if (error) throw error;

    // Converter tipos
    return {
      ...data,
      tipo: data.tipo as "ativo" | "passivo" | "receita" | "despesa" | "patrimonio",
      natureza: data.natureza,
      nivel: data.nivel,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error(`Erro ao buscar conta contábil com código reduzido ${codigoReduzido}:`, error);
    return null;
  }
};

// Criar lançamento contábil
export const criarLancamentoContabil = async (lancamento: Omit<LancamentoContabil, 'id' | 'created_at'>): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert([lancamento])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as LancamentoContabil;
  } catch (error) {
    console.error('Erro ao criar lançamento contábil:', error);
    return null;
  }
};

// Atualizar lançamento contábil
export const atualizarLancamentoContabil = async (id: number, lancamento: Partial<LancamentoContabil>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .update(lancamento)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar lançamento contábil ${id}:`, error);
    return false;
  }
};

// Excluir lançamento contábil
export const excluirLancamentoContabil = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .update({ status: 'inativo' })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir lançamento contábil ${id}:`, error);
    return false;
  }
};

// Criar conta contábil
export const criarContaContabil = async (conta: Omit<ContaContabil, 'id'>): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .insert([conta])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao criar conta contábil:', error);
    return null;
  }
};

// Atualizar conta contábil
export const atualizarContaContabil = async (codigo: string, conta: Partial<ContaContabil>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Plano_Contas')
      .update(conta)
      .eq('codigo', codigo);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar conta contábil ${codigo}:`, error);
    return false;
  }
};

// Excluir conta contábil
export const excluirContaContabil = async (codigo: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Plano_Contas')
      .update({ status: 'inativo' })
      .eq('codigo', codigo);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir conta contábil ${codigo}:`, error);
    return false;
  }
};

// Buscar balanços patrimoniais
export const buscarBalancosPatrimoniais = async (): Promise<BalancoPatrimonial[]> => {
  // Implementação futura - por enquanto retornamos dados simulados
  return [
    {
      id: 1,
      periodo: '2025-01',
      data_geracao: '2025-02-10',
      ativo_circulante: 250000,
      ativo_nao_circulante: 750000,
      passivo_circulante: 150000,
      passivo_nao_circulante: 350000,
      patrimonio_liquido: 500000,
      status: 'publicado'
    },
    {
      id: 2,
      periodo: '2025-02',
      data_geracao: '2025-03-10',
      ativo_circulante: 280000,
      ativo_nao_circulante: 720000,
      passivo_circulante: 170000,
      passivo_nao_circulante: 330000,
      patrimonio_liquido: 500000,
      status: 'publicado'
    }
  ];
};

// Buscar demonstrações de resultado (DRE)
export const buscarDRE = async (): Promise<DREData[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*');
    
    if (error) throw error;

    // Converter tipos
    return data.map(item => ({
      ...item,
      status: item.status as StatusItem
    }));
  } catch (error) {
    console.error('Erro ao buscar DREs:', error);
    return [];
  }
};

// Buscar livro caixa
export const buscarLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*');
    
    if (error) throw error;

    // Converter tipos
    return data.map(item => ({
      ...item,
      tipo: item.tipo as TipoMovimento,
      status: item.status as StatusItem,
      data_movimento: new Date(item.data_movimento).toISOString()
    }));
  } catch (error) {
    console.error('Erro ao buscar livro caixa:', error);
    return [];
  }
};

// Criar movimento no livro caixa
export const criarMovimentoCaixa = async (movimento: Omit<LivroCaixaItem, 'id' | 'created_at'>): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .insert([movimento])
      .select()
      .single();
    
    if (error) throw error;
    
    return data as LivroCaixaItem;
  } catch (error) {
    console.error('Erro ao criar movimento no livro caixa:', error);
    return null;
  }
};

// Folha de pagamento - implementação futura
export const gerenciarFolhaPagamento = async () => {
  // Implementação básica para a funcionalidade de folha de pagamento
  try {
    // Esta é uma simulação, a implementação real dependerá da estrutura da tabela
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*');
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Erro ao gerenciar folha de pagamento:', error);
    return [];
  }
};
