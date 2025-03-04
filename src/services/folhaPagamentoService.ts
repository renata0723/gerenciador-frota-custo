
import { supabase } from '@/integrations/supabase/client';
import { FolhaPagamento } from '@/types/contabilidade';
import { logOperation } from '@/utils/logOperations';

export const listarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao buscar registros', false);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao listar folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao listar registros', false);
    return [];
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
      console.error('Erro ao buscar registro de folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao buscar registro específico', false);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar registro de folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao buscar registro específico', false);
    return null;
  }
};

export const criarRegistroFolhaPagamento = async (folha: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert([folha])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar registro de folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao criar registro', false);
      return null;
    }
    
    logOperation('Folha de Pagamento', 'Registro criado com sucesso', true);
    return data;
  } catch (error) {
    console.error('Erro ao criar registro de folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao criar registro', false);
    return null;
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
      console.error('Erro ao atualizar registro de folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao atualizar registro', false);
      return null;
    }
    
    logOperation('Folha de Pagamento', 'Registro atualizado com sucesso', true);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar registro de folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao atualizar registro', false);
    return null;
  }
};

export const excluirRegistroFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir registro de folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao excluir registro', false);
      return false;
    }
    
    logOperation('Folha de Pagamento', 'Registro excluído com sucesso', true);
    return true;
  } catch (error) {
    console.error('Erro ao excluir registro de folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao excluir registro', false);
    return false;
  }
};

// Aliases para manter compatibilidade
export const atualizarFolhaPagamento = atualizarRegistroFolhaPagamento;
export const criarFolhaPagamento = criarRegistroFolhaPagamento;
export const excluirFolhaPagamento = excluirRegistroFolhaPagamento;
