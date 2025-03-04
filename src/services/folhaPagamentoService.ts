
import { supabase } from '@/integrations/supabase/client';
import { FolhaPagamento } from '@/types/folhaPagamento';
import { format } from 'date-fns';

export const listarFolhasPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao listar folhas de pagamento:', error);
      throw new Error(error.message);
    }

    return data as FolhaPagamento[];
  } catch (error) {
    console.error('Erro ao processar lista de folhas de pagamento:', error);
    throw error;
  }
};

export const buscarFolhaPagamento = async (id: number): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar folha de pagamento:', error);
      throw new Error(error.message);
    }

    return data as FolhaPagamento;
  } catch (error) {
    console.error('Erro ao buscar folha de pagamento:', error);
    return null;
  }
};

export const criarFolhaPagamento = async (folhaPagamento: Omit<FolhaPagamento, 'id' | 'created_at'>): Promise<FolhaPagamento> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert([folhaPagamento])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar folha de pagamento:', error);
      throw new Error(error.message);
    }

    return data as FolhaPagamento;
  } catch (error) {
    console.error('Erro ao criar folha de pagamento:', error);
    throw error;
  }
};

export const atualizarFolhaPagamento = async (id: number, folhaPagamento: Partial<FolhaPagamento>): Promise<FolhaPagamento> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .update(folhaPagamento)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar folha de pagamento:', error);
      throw new Error(error.message);
    }

    return data as FolhaPagamento;
  } catch (error) {
    console.error('Erro ao atualizar folha de pagamento:', error);
    throw error;
  }
};

export const excluirFolhaPagamento = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir folha de pagamento:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Erro ao excluir folha de pagamento:', error);
    throw error;
  }
};

export const listarFolhasPorPeriodo = async (mes: string, ano: string): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .eq('mes_referencia', mes)
      .eq('ano_referencia', ano)
      .order('funcionario_nome', { ascending: true });

    if (error) {
      console.error('Erro ao listar folhas por período:', error);
      throw new Error(error.message);
    }

    return data as FolhaPagamento[];
  } catch (error) {
    console.error('Erro ao processar lista de folhas por período:', error);
    throw error;
  }
};

export const calcularTotaisFolhaPeriodo = async (mes: string, ano: string) => {
  try {
    const folhas = await listarFolhasPorPeriodo(mes, ano);
    
    // Calcular totais
    const totalSalarioBruto = folhas.reduce((sum, item) => sum + Number(item.salario_base), 0);
    const totalDescontos = folhas.reduce((sum, item) => {
      const inss = Number(item.inss || 0);
      const ir = Number(item.ir || 0);
      const vt = Number(item.vale_transporte || 0);
      const outrosDescontos = Number(item.outros_descontos || 0);
      return sum + inss + ir + vt + outrosDescontos;
    }, 0);
    
    const totalBeneficios = folhas.reduce((sum, item) => {
      const vr = Number(item.vale_refeicao || 0);
      const outros = Number(item.outros_beneficios || 0);
      return sum + vr + outros;
    }, 0);
    
    const totalLiquido = folhas.reduce((sum, item) => sum + Number(item.valor_liquido), 0);
    
    return {
      quantidade: folhas.length,
      totalSalarioBruto,
      totalDescontos,
      totalBeneficios,
      totalLiquido,
      folhas
    };
  } catch (error) {
    console.error('Erro ao calcular totais da folha:', error);
    throw error;
  }
};

// Alias para compatibilidade
export const criarRegistroFolhaPagamento = criarFolhaPagamento;
export const atualizarRegistroFolhaPagamento = atualizarFolhaPagamento;
export const excluirRegistroFolhaPagamento = excluirFolhaPagamento;
