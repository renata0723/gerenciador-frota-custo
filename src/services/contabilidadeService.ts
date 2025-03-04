
import { supabase } from "@/integrations/supabase/client";
import { 
  LancamentoContabil, 
  ContaContabil, 
  CentroCusto, 
  DREData, 
  BalancoPatrimonialData,
  LivroCaixaItem
} from "@/types/contabilidade";

export const buscarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
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
    console.error('Erro na requisição:', error);
    return [];
  }
};

export const buscarLancamentoPorId = async (id: number): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar lançamento por ID:', error);
      return null;
    }

    return data as LancamentoContabil;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
};

export const criarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert([lancamento]);

    if (error) {
      console.error('Erro ao criar lançamento:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};

export const atualizarLancamentoContabil = async (id: number, lancamento: Partial<LancamentoContabil>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .update(lancamento)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar lançamento:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};

export const excluirLancamentoContabil = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir lançamento:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};

// Funções para o Plano de Contas
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
    console.error('Erro na requisição:', error);
    return [];
  }
};

export const buscarContaPorCodigo = async (codigo: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo', codigo)
      .single();

    if (error) {
      console.error('Erro ao buscar conta por código:', error);
      return null;
    }

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return null;
  }
};

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
    console.error('Erro na requisição:', error);
    return null;
  }
};

export const criarContaContabil = async (conta: ContaContabil): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Plano_Contas')
      .insert([conta]);

    if (error) {
      console.error('Erro ao criar conta contábil:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};

// Funções para o Centro de Custo
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
    console.error('Erro na requisição:', error);
    return [];
  }
};

// Funções para DRE
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

    return data as DREData[];
  } catch (error) {
    console.error('Erro na requisição:', error);
    return [];
  }
};

export const criarDRE = async (dre: DREData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('DRE')
      .insert([dre]);

    if (error) {
      console.error('Erro ao criar DRE:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};

// Funções para Balanço Patrimonial
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
    console.error('Erro na requisição:', error);
    return [];
  }
};

export const criarBalancoPatrimonial = async (balanco: BalancoPatrimonialData): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Balanco_Patrimonial')
      .insert([balanco]);

    if (error) {
      console.error('Erro ao criar balanço patrimonial:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};

// Funções para Livro Caixa
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
    console.error('Erro na requisição:', error);
    return [];
  }
};

export const criarLancamentoLivroCaixa = async (lancamento: LivroCaixaItem): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Livro_Caixa')
      .insert([lancamento]);

    if (error) {
      console.error('Erro ao criar lançamento no livro caixa:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro na requisição:', error);
    return false;
  }
};
