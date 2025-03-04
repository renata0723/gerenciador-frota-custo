
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FolhaPagamento, StatusItem } from '@/types/folhaPagamento';

export const listarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('FolhaPagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });

    if (error) {
      console.error('Erro ao listar folha de pagamento:', error);
      toast.error('Erro ao listar registros de folha de pagamento');
      return [];
    }

    return data.map(item => ({
      ...item,
      status: item.status as StatusItem
    })) || [];
  } catch (error) {
    console.error('Erro ao listar folha de pagamento:', error);
    toast.error('Erro ao listar registros de folha de pagamento');
    return [];
  }
};

export const obterFolhaPagamentoPorId = async (id: number): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('FolhaPagamento')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao obter registro de folha de pagamento:', error);
      return null;
    }

    return {
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao obter registro de folha de pagamento:', error);
    return null;
  }
};

export const adicionarFolhaPagamento = async (folhaPagamento: FolhaPagamento): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('FolhaPagamento')
      .insert(folhaPagamento)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar registro de folha de pagamento:', error);
      toast.error('Erro ao adicionar registro de folha de pagamento');
      return null;
    }

    toast.success('Registro de folha de pagamento adicionado com sucesso');
    return {
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao adicionar registro de folha de pagamento:', error);
    toast.error('Erro ao adicionar registro de folha de pagamento');
    return null;
  }
};

export const atualizarFolhaPagamento = async (id: number, folhaPagamento: FolhaPagamento): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('FolhaPagamento')
      .update(folhaPagamento)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar registro de folha de pagamento:', error);
      toast.error('Erro ao atualizar registro de folha de pagamento');
      return null;
    }

    toast.success('Registro de folha de pagamento atualizado com sucesso');
    return {
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao atualizar registro de folha de pagamento:', error);
    toast.error('Erro ao atualizar registro de folha de pagamento');
    return null;
  }
};

export const excluirFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('FolhaPagamento')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir registro de folha de pagamento:', error);
      toast.error('Erro ao excluir registro de folha de pagamento');
      return false;
    }

    toast.success('Registro de folha de pagamento excluído com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao excluir registro de folha de pagamento:', error);
    toast.error('Erro ao excluir registro de folha de pagamento');
    return false;
  }
};
