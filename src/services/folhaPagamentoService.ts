
import { supabase } from '@/integrations/supabase/client';
import { FolhaPagamento } from '@/types/folhaPagamento';

export const listarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao listar folha de pagamento:', error);
      return [];
    }

    return data as FolhaPagamento[];
  } catch (error) {
    console.error('Erro ao listar folha de pagamento:', error);
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
      console.error('Erro ao buscar folha de pagamento:', error);
      return null;
    }

    return data as FolhaPagamento;
  } catch (error) {
    console.error('Erro ao buscar folha de pagamento:', error);
    return null;
  }
};

export const criarFolhaPagamento = async (folhaPagamento: Omit<FolhaPagamento, 'id'>): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert(folhaPagamento)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar folha de pagamento:', error);
      return null;
    }

    return data as FolhaPagamento;
  } catch (error) {
    console.error('Erro ao criar folha de pagamento:', error);
    return null;
  }
};

export const atualizarFolhaPagamento = async (id: number, folhaPagamento: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .update(folhaPagamento)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar folha de pagamento:', error);
      return null;
    }

    return data as FolhaPagamento;
  } catch (error) {
    console.error('Erro ao atualizar folha de pagamento:', error);
    return null;
  }
};

export const excluirFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir folha de pagamento:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao excluir folha de pagamento:', error);
    return false;
  }
};
