
import { supabase } from "@/integrations/supabase/client";
import { 
  LancamentoContabil, 
  ContaContabil, 
  CentroCusto, 
  DREData, 
  BalancoPatrimonialData, 
  LivroCaixaItem 
} from "@/types/contabilidade";

// Função para buscar lançamentos contábeis
export const buscarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    // Para tabelas novas que ainda não estão no tipo Database, usamos a sintaxe alternativa
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .order('data_lancamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar lançamentos contábeis:', error);
      return [];
    }

    return data as LancamentoContabil[];
  } catch (error) {
    console.error('Erro ao processar lançamentos contábeis:', error);
    return [];
  }
};

// Função para buscar um lançamento contábil específico
export const buscarLancamentoContabilPorId = async (id: number): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar lançamento contábil:', error);
      return null;
    }

    return data as LancamentoContabil;
  } catch (error) {
    console.error('Erro ao processar lançamento contábil:', error);
    return null;
  }
};

// Função para buscar contas contábeis (plano de contas)
export const buscarPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .order('codigo', { ascending: true });

    if (error) {
      console.error('Erro ao buscar plano de contas:', error);
      return [];
    }

    return data as ContaContabil[];
  } catch (error) {
    console.error('Erro ao processar plano de contas:', error);
    return [];
  }
};

// Função para buscar uma conta contábil específica
export const buscarContaContabilPorCodigo = async (codigo: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo', codigo)
      .single();

    if (error) {
      console.error('Erro ao buscar conta contábil:', error);
      return null;
    }

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao processar conta contábil:', error);
    return null;
  }
};

// Função para buscar centros de custo
export const buscarCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*')
      .order('codigo', { ascending: true });

    if (error) {
      console.error('Erro ao buscar centros de custo:', error);
      return [];
    }

    return data as CentroCusto[];
  } catch (error) {
    console.error('Erro ao processar centros de custo:', error);
    return [];
  }
};

// Função para buscar DREs
export const buscarDREs = async (): Promise<DREData[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .order('periodo_fim', { ascending: false });

    if (error) {
      console.error('Erro ao buscar DREs:', error);
      return [];
    }

    // Converter string para StatusItem
    const dres = data.map(dre => ({
      ...dre,
      status: dre.status as any
    }));

    return dres as DREData[];
  } catch (error) {
    console.error('Erro ao processar DREs:', error);
    return [];
  }
};

// Função para buscar uma DRE específica
export const buscarDREPorId = async (id: number): Promise<DREData | null> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar DRE:', error);
      return null;
    }

    return { ...data, status: data.status as any } as DREData;
  } catch (error) {
    console.error('Erro ao processar DRE:', error);
    return null;
  }
};

// Função para buscar balanços patrimoniais
export const buscarBalancosPatrimoniais = async (): Promise<BalancoPatrimonialData[]> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .order('data_fechamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar balanços patrimoniais:', error);
      return [];
    }

    return data as BalancoPatrimonialData[];
  } catch (error) {
    console.error('Erro ao processar balanços patrimoniais:', error);
    return [];
  }
};

// Função para buscar um balanço patrimonial específico
export const buscarBalancoPatrimonialPorId = async (id: number): Promise<BalancoPatrimonialData | null> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar balanço patrimonial:', error);
      return null;
    }

    return data as BalancoPatrimonialData;
  } catch (error) {
    console.error('Erro ao processar balanço patrimonial:', error);
    return null;
  }
};

// Função para buscar lançamentos do livro caixa
export const buscarLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .order('data_movimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar livro caixa:', error);
      return [];
    }

    return data as LivroCaixaItem[];
  } catch (error) {
    console.error('Erro ao processar livro caixa:', error);
    return [];
  }
};

// Função para buscar um lançamento do livro caixa específico
export const buscarLivroCaixaPorId = async (id: number): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar lançamento do livro caixa:', error);
      return null;
    }

    return data as LivroCaixaItem;
  } catch (error) {
    console.error('Erro ao processar lançamento do livro caixa:', error);
    return null;
  }
};

// Função para criar um lançamento contábil
export const criarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert(lancamento)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lançamento contábil:', error);
      return null;
    }

    return data as LancamentoContabil;
  } catch (error) {
    console.error('Erro ao processar criação de lançamento contábil:', error);
    return null;
  }
};

// Função para fechar um período na DRE
export const fecharPeriodoDRE = async (dreId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('DRE')
      .update({ periodo_fechado: true })
      .eq('id', dreId);

    if (error) {
      console.error('Erro ao fechar período na DRE:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao processar fechamento de período na DRE:', error);
    return false;
  }
};

// Função para criar uma conta no plano de contas
export const criarContaContabil = async (conta: ContaContabil): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .insert(conta)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar conta contábil:', error);
      return null;
    }

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao processar criação de conta contábil:', error);
    return null;
  }
};

// Função para buscar uma conta contábil pelo código reduzido
export const buscarContaPorCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
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

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao processar busca de conta por código reduzido:', error);
    return null;
  }
};
