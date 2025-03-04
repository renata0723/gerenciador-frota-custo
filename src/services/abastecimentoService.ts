import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AbastecimentoData {
  id?: number;
  data_abastecimento: string;
  placa_veiculo: string;
  responsavel_autorizacao: string;
  motorista_solicitante: string;
  tipo_combustivel: string;
  quilometragem: number;
  posto: string;
  valor_abastecimento: number;
  itens_abastecidos: string;
  valor_total: number;
}

export interface TipoCombustivel {
  id: string;
  nome: string;
  descricao?: string;
}

export const addTipoCombustivel = async (tipoCombustivel: TipoCombustivel): Promise<TipoCombustivel | null> => {
  try {
    const { data, error } = await supabase
      .from('TiposCombustivel')
      .insert([tipoCombustivel])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar tipo de combustível:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar tipo de combustível:', error);
    return null;
  }
};

export const listarTiposCombustivel = async (): Promise<TipoCombustivel[]> => {
  try {
    const { data, error } = await supabase
      .from('TiposCombustivel')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Erro ao buscar tipos de combustível:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao listar tipos de combustível:', error);
    return [];
  }
};

export const addAbastecimento = async (abastecimento: AbastecimentoData): Promise<AbastecimentoData | null> => {
  try {
    const { data, error } = await supabase
      .from('Abastecimentos')
      .insert([abastecimento])
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar abastecimento:', error);
      toast.error('Erro ao adicionar abastecimento.');
      return null;
    }

    toast.success('Abastecimento adicionado com sucesso!');
    return data;
  } catch (error) {
    console.error('Erro ao adicionar abastecimento:', error);
    toast.error('Erro ao adicionar abastecimento.');
    return null;
  }
};

export const listarAbastecimentos = async (): Promise<AbastecimentoData[]> => {
  try {
    const { data, error } = await supabase
      .from('Abastecimentos')
      .select('*')
      .order('data_abastecimento', { ascending: false });

    if (error) {
      console.error('Erro ao listar abastecimentos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao listar abastecimentos:', error);
    return [];
  }
};

export const getAbastecimentoById = async (id: number): Promise<AbastecimentoData | null> => {
  try {
    const { data, error } = await supabase
      .from('Abastecimentos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar abastecimento por ID:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Erro ao buscar abastecimento por ID:', error);
    return null;
  }
};

export const updateAbastecimento = async (id: number, updates: Partial<AbastecimentoData>): Promise<AbastecimentoData | null> => {
  try {
    const { data, error } = await supabase
      .from('Abastecimentos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar abastecimento:', error);
      toast.error('Erro ao atualizar abastecimento.');
      return null;
    }

    toast.success('Abastecimento atualizado com sucesso!');
    return data;
  } catch (error) {
    console.error('Erro ao atualizar abastecimento:', error);
    toast.error('Erro ao atualizar abastecimento.');
    return null;
  }
};

export const deleteAbastecimento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Abastecimentos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao excluir abastecimento:', error);
      toast.error('Erro ao excluir abastecimento.');
      return false;
    }

    toast.success('Abastecimento excluído com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao excluir abastecimento:', error);
    toast.error('Erro ao excluir abastecimento.');
    return false;
  }
};
