
import { supabase } from '@/integrations/supabase/client';
import { FolhaPagamento, StatusItem } from '@/types/contabilidade';
import { logOperation } from '@/utils/logOperations';

export const listarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao buscar folha de pagamento', false);
      return [];
    }
    
    return (data || []).map(item => ({
      ...item,
      status: item.status as StatusItem
    }));
  } catch (error) {
    console.error('Erro ao listar folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao listar folha de pagamento', false);
    return [];
  }
};

export const adicionarFolhaPagamento = async (folha: FolhaPagamento): Promise<FolhaPagamento | null> => {
  try {
    // Garantir que todos os campos obrigatórios estejam presentes
    const folhaCompleta = {
      funcionario_nome: folha.funcionario_nome,
      salario_base: folha.salario_base,
      data_pagamento: folha.data_pagamento,
      mes_referencia: folha.mes_referencia,
      ano_referencia: folha.ano_referencia,
      inss: folha.inss,
      fgts: folha.fgts,
      ir: folha.ir,
      vale_transporte: folha.vale_transporte,
      vale_refeicao: folha.vale_refeicao,
      outros_descontos: folha.outros_descontos,
      outros_beneficios: folha.outros_beneficios,
      valor_liquido: folha.valor_liquido,
      observacoes: folha.observacoes,
      status: folha.status || 'concluido' as StatusItem
    };

    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert([folhaCompleta])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao adicionar folha de pagamento', false);
      return null;
    }
    
    logOperation('Folha de Pagamento', 'Folha de pagamento adicionada com sucesso', true);
    return { 
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao adicionar folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao adicionar folha de pagamento', false);
    return null;
  }
};

export const deletarFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao excluir folha de pagamento', false);
      return false;
    }
    
    logOperation('Folha de Pagamento', 'Folha de pagamento excluída com sucesso', true);
    return true;
  } catch (error) {
    console.error('Erro ao excluir folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao excluir folha de pagamento', false);
    return false;
  }
};

export const atualizarFolhaPagamento = async (id: number, dados: Partial<FolhaPagamento>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .update(dados)
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao atualizar folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao atualizar folha de pagamento', false);
      return false;
    }
    
    logOperation('Folha de Pagamento', 'Folha de pagamento atualizada com sucesso', true);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao atualizar folha de pagamento', false);
    return false;
  }
};

export const obterFolhaPagamentoPorId = async (id: number): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar folha de pagamento por ID:', error);
      return null;
    }
    
    return {
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao buscar folha de pagamento por ID:', error);
    return null;
  }
};

export const verificarExistenciaTabelaFolhaPagamento = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: 'Folha_Pagamento' });
    
    if (error || !data) {
      console.error('Erro ao verificar existência da tabela:', error);
      return false;
    }
    
    return data > 0;
  } catch (error) {
    console.error('Erro ao verificar existência da tabela:', error);
    return false;
  }
};
