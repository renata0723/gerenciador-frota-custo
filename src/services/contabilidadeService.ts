
import { supabase } from '@/integrations/supabase/client';
import { 
  LancamentoContabil, 
  ContaContabil, 
  CentroCusto, 
  DREData, 
  BalancoPatrimonialData, 
  LivroCaixaItem 
} from '@/types/contabilidade';
import { logOperation } from '@/utils/logOperations';

// Serviço para Lançamentos Contábeis
export const getLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .order('data_lancamento', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar lançamentos contábeis:', error);
    logOperation('Contabilidade', 'Buscar lançamentos contábeis', 'false');
    return [];
  }
};

export const criarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert(lancamento)
      .select()
      .single();
    
    if (error) throw error;
    
    logOperation('Contabilidade', 'Criar lançamento contábil', 'true');
    return data;
  } catch (error) {
    console.error('Erro ao criar lançamento contábil:', error);
    logOperation('Contabilidade', 'Criar lançamento contábil', 'false');
    return null;
  }
};

// Serviço para Plano de Contas
export const getPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .order('codigo');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar plano de contas:', error);
    logOperation('Contabilidade', 'Buscar plano de contas', 'false');
    return [];
  }
};

export const criarConta = async (conta: ContaContabil): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .insert(conta)
      .select()
      .single();
    
    if (error) throw error;
    
    logOperation('Contabilidade', 'Criar conta contábil', 'true');
    return data;
  } catch (error) {
    console.error('Erro ao criar conta contábil:', error);
    logOperation('Contabilidade', 'Criar conta contábil', 'false');
    return null;
  }
};

// Serviço para Centros de Custo
export const getCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*')
      .order('codigo');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar centros de custo:', error);
    logOperation('Contabilidade', 'Buscar centros de custo', 'false');
    return [];
  }
};

// Serviço para DRE
export const getDREs = async (): Promise<DREData[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .order('periodo_fim', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar DREs:', error);
    logOperation('Contabilidade', 'Buscar DREs', 'false');
    return [];
  }
};

export const criarDRE = async (dre: DREData): Promise<DREData | null> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .insert(dre)
      .select()
      .single();
    
    if (error) throw error;
    
    logOperation('Contabilidade', 'Criar DRE', 'true');
    return data;
  } catch (error) {
    console.error('Erro ao criar DRE:', error);
    logOperation('Contabilidade', 'Criar DRE', 'false');
    return null;
  }
};

// Serviço para Balanço Patrimonial
export const getBalancosPatrimoniais = async (): Promise<BalancoPatrimonialData[]> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .order('data_fechamento', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar balanços patrimoniais:', error);
    logOperation('Contabilidade', 'Buscar balanços patrimoniais', 'false');
    return [];
  }
};

export const criarBalancoPatrimonial = async (balanco: BalancoPatrimonialData): Promise<BalancoPatrimonialData | null> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .insert(balanco)
      .select()
      .single();
    
    if (error) throw error;
    
    logOperation('Contabilidade', 'Criar balanço patrimonial', 'true');
    return data;
  } catch (error) {
    console.error('Erro ao criar balanço patrimonial:', error);
    logOperation('Contabilidade', 'Criar balanço patrimonial', 'false');
    return null;
  }
};

// Serviço para Livro Caixa
export const getLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .order('data_movimento', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar livro caixa:', error);
    logOperation('Contabilidade', 'Buscar livro caixa', 'false');
    return [];
  }
};

export const criarLivroCaixaItem = async (item: LivroCaixaItem): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    
    logOperation('Contabilidade', 'Criar item de livro caixa', 'true');
    return data;
  } catch (error) {
    console.error('Erro ao criar item de livro caixa:', error);
    logOperation('Contabilidade', 'Criar item de livro caixa', 'false');
    return null;
  }
};
