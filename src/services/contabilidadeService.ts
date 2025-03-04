
import { supabase } from '@/integrations/supabase/client';
import { LancamentoContabil, ContaContabil, CentroCusto, BalancoPatrimonialData, DREData, LivroCaixaItem } from '@/types/contabilidade';

export const buscarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .order('data_lancamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar lançamentos contábeis:', error);
      throw new Error('Erro ao buscar lançamentos contábeis');
    }

    return data || [];
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const buscarPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .order('codigo');

    if (error) {
      console.error('Erro ao buscar plano de contas:', error);
      throw new Error('Erro ao buscar plano de contas');
    }

    return data || [];
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const buscarCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*')
      .eq('status', 'ativo');

    if (error) {
      console.error('Erro ao buscar centros de custo:', error);
      throw new Error('Erro ao buscar centros de custo');
    }

    return data || [];
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const buscarContaContabilByCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo_reduzido', codigoReduzido)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum registro encontrado
        return null;
      }
      console.error('Erro ao buscar conta contábil:', error);
      throw new Error('Erro ao buscar conta contábil');
    }

    return data;
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const criarLancamentoContabil = async (lancamento: Omit<LancamentoContabil, 'id' | 'created_at'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert(lancamento);

    if (error) {
      console.error('Erro ao criar lançamento contábil:', error);
      throw new Error('Erro ao criar lançamento contábil');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const atualizarLancamentoContabil = async (id: number, lancamento: Partial<LancamentoContabil>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .update(lancamento)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar lançamento contábil:', error);
      throw new Error('Erro ao atualizar lançamento contábil');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const deletarLancamentoContabil = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Lancamentos_Contabeis')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar lançamento contábil:', error);
      throw new Error('Erro ao deletar lançamento contábil');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const criarContaContabil = async (conta: Omit<ContaContabil, 'id'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Plano_Contas')
      .insert(conta);

    if (error) {
      console.error('Erro ao criar conta contábil:', error);
      throw new Error('Erro ao criar conta contábil');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const atualizarContaContabil = async (codigo: string, conta: Partial<ContaContabil>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Plano_Contas')
      .update(conta)
      .eq('codigo', codigo);

    if (error) {
      console.error('Erro ao atualizar conta contábil:', error);
      throw new Error('Erro ao atualizar conta contábil');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const deletarContaContabil = async (codigo: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Plano_Contas')
      .delete()
      .eq('codigo', codigo);

    if (error) {
      console.error('Erro ao deletar conta contábil:', error);
      throw new Error('Erro ao deletar conta contábil');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const buscarBalancosPatrimoniais = async (): Promise<BalancoPatrimonialData[]> => {
  try {
    // Verificar se existe uma tabela específica para balanços patrimoniais
    // Caso contrário, podemos usar uma consulta personalizada para simular os dados
    
    // Por enquanto, vamos retornar alguns dados simulados
    return [
      {
        id: 1,
        data_fechamento: '2023-12-31',
        ativo_circulante: 250000,
        ativo_nao_circulante: 750000,
        passivo_circulante: 150000,
        passivo_nao_circulante: 350000,
        patrimonio_liquido: 500000,
        status: 'fechado'
      },
      {
        id: 2,
        data_fechamento: '2024-03-31',
        ativo_circulante: 280000,
        ativo_nao_circulante: 720000,
        passivo_circulante: 180000,
        passivo_nao_circulante: 320000,
        patrimonio_liquido: 500000,
        status: 'fechado'
      },
      {
        id: 3,
        data_fechamento: '2024-06-30',
        ativo_circulante: 300000,
        ativo_nao_circulante: 700000,
        passivo_circulante: 200000,
        passivo_nao_circulante: 300000,
        patrimonio_liquido: 500000,
        status: 'aberto'
      }
    ];
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const criarBalancoPatrimonial = async (balanco: Omit<BalancoPatrimonialData, 'id'>): Promise<void> => {
  try {
    // TODO: Implementar quando a tabela for criada
    console.log('Criar balanço patrimonial:', balanco);
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const buscarDRE = async (): Promise<DREData[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .order('periodo_inicio', { ascending: false });

    if (error) {
      console.error('Erro ao buscar DRE:', error);
      throw new Error('Erro ao buscar DRE');
    }

    return data || [];
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const criarDRE = async (dre: Omit<DREData, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('DRE')
      .insert(dre);

    if (error) {
      console.error('Erro ao criar DRE:', error);
      throw new Error('Erro ao criar DRE');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const atualizarDRE = async (id: number, dre: Partial<DREData>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('DRE')
      .update(dre)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar DRE:', error);
      throw new Error('Erro ao atualizar DRE');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const buscarLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .order('data_movimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar Livro Caixa:', error);
      throw new Error('Erro ao buscar Livro Caixa');
    }

    return data || [];
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};

export const criarLivroCaixaItem = async (item: Omit<LivroCaixaItem, 'id' | 'created_at'>): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Livro_Caixa')
      .insert(item);

    if (error) {
      console.error('Erro ao criar item do Livro Caixa:', error);
      throw new Error('Erro ao criar item do Livro Caixa');
    }
  } catch (error) {
    console.error('Erro:', error);
    throw error;
  }
};
