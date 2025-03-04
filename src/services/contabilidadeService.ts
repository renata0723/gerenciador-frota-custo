
import { supabase } from '@/integrations/supabase/client';
import { 
  LancamentoContabil, 
  ContaContabil, 
  CentroCusto, 
  BalancoPatrimonialData,
  LivroCaixaItem,
  DREData
} from '@/types/contabilidade';

// Funções para Lançamentos Contábeis
export const buscarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .order('data_lancamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar lançamentos contábeis:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar lançamentos contábeis:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const getLancamentosContabeis = buscarLancamentosContabeis;

// Funções para Plano de Contas
export const buscarPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .order('codigo');

    if (error) {
      console.error('Erro ao buscar plano de contas:', error);
      throw error;
    }

    // Convertendo para o formato correto
    const contas = data?.map(conta => ({
      codigo: conta.codigo,
      codigo_reduzido: conta.codigo_reduzido,
      nome: conta.nome,
      tipo: conta.tipo,
      natureza: conta.natureza as "devedora" | "credora",
      nivel: conta.nivel,
      conta_pai: conta.conta_pai,
      status: conta.status
    })) || [];

    return contas;
  } catch (error) {
    console.error('Erro ao buscar plano de contas:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const getPlanoContas = buscarPlanoContas;

// Buscar conta contábil pelo código reduzido
export const buscarContaContabilByCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo_reduzido', codigoReduzido)
      .single();

    if (error) {
      console.error('Erro ao buscar conta pelo código reduzido:', error);
      return null;
    }

    if (!data) return null;

    return {
      codigo: data.codigo,
      codigo_reduzido: data.codigo_reduzido,
      nome: data.nome,
      tipo: data.tipo,
      natureza: data.natureza as "devedora" | "credora",
      nivel: data.nivel,
      conta_pai: data.conta_pai,
      status: data.status
    };
  } catch (error) {
    console.error('Erro ao buscar conta pelo código reduzido:', error);
    return null;
  }
};

// Alias para compatibilidade
export const getContaContabilByCodigoReduzido = buscarContaContabilByCodigoReduzido;

// Funções para Centros de Custo
export const buscarCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*')
      .order('codigo');

    if (error) {
      console.error('Erro ao buscar centros de custo:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar centros de custo:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const getCentrosCusto = buscarCentrosCusto;

// Criar lançamento contábil
export const criarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert([lancamento])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lançamento contábil:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar lançamento contábil:', error);
    throw error;
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
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar livro caixa:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const getLivroCaixa = buscarLivroCaixa;

export const criarItemLivroCaixa = async (item: LivroCaixaItem): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar item no livro caixa:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar item no livro caixa:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const criarLivroCaixaItem = criarItemLivroCaixa;

// Funções para DRE
export const buscarDRE = async (): Promise<DREData[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .order('periodo_fim', { ascending: false });

    if (error) {
      console.error('Erro ao buscar DRE:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar DRE:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const getDRE = buscarDRE;

export const criarNovoRegistroDRE = async (dre: DREData): Promise<DREData | null> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .insert([dre])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar registro DRE:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar registro DRE:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const criarDRE = criarNovoRegistroDRE;

// Funções para Balanço Patrimonial
export const buscarBalancosPatrimoniais = async (): Promise<BalancoPatrimonialData[]> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .order('data_fechamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar balanços patrimoniais:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar balanços patrimoniais:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const getBalancosPatrimoniais = buscarBalancosPatrimoniais;

export const criarNovoBalancoPatrimonial = async (balanco: BalancoPatrimonialData): Promise<BalancoPatrimonialData | null> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .insert([balanco])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar balanço patrimonial:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar balanço patrimonial:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const criarBalancoPatrimonial = criarNovoBalancoPatrimonial;

// Funções para Folha de Pagamento
export interface FolhaPagamento {
  id?: number;
  funcionario_nome: string;
  cargo?: string;
  cpf?: string;
  salario_base: number;
  data_pagamento: string;
  mes_referencia: string;
  ano_referencia: number;
  desconto_inss?: number;
  desconto_irrf?: number;
  outros_descontos?: number;
  horas_extras?: number;
  valor_hora_extra?: number;
  adicional_periculosidade?: number;
  adicional_insalubridade?: number;
  outros_adicionais?: number;
  valor_total: number;
  status?: string;
}

export const buscarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar folha de pagamento:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar folha de pagamento:', error);
    throw error;
  }
};

export const criarRegistroFolhaPagamento = async (folha: FolhaPagamento): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert([folha])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar registro na folha de pagamento:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao criar registro na folha de pagamento:', error);
    throw error;
  }
};

export const atualizarRegistroFolhaPagamento = async (id: number, folha: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .update(folha)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar registro na folha de pagamento:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Erro ao atualizar registro na folha de pagamento:', error);
    throw error;
  }
};

export const excluirRegistroFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir registro na folha de pagamento:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir registro na folha de pagamento:', error);
    return false;
  }
};
