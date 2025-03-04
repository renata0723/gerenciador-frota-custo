
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
  quantidade?: number;
  posto: string;
  valor_abastecimento: number;
  itens_abastecidos: string;
  valor_total: number;
  contrato_id?: string;
  contabilizado?: boolean;
  conta_debito?: string;
  conta_credito?: string;
  status?: string;
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
    // Se contabilizado, cria o lançamento contábil
    if (abastecimento.contabilizado && abastecimento.conta_debito && abastecimento.conta_credito) {
      const lancamentoContabil = {
        data_lancamento: abastecimento.data_abastecimento,
        data_competencia: abastecimento.data_abastecimento,
        conta_debito: abastecimento.conta_debito,
        conta_credito: abastecimento.conta_credito,
        valor: abastecimento.valor_total,
        historico: `Abastecimento - Veículo ${abastecimento.placa_veiculo} - Posto ${abastecimento.posto}`,
        status: 'ativo'
      };
      
      const { error: lancamentoError } = await supabase
        .from('Lancamentos_Contabeis')
        .insert([lancamentoContabil]);
        
      if (lancamentoError) {
        console.error('Erro ao criar lançamento contábil:', lancamentoError);
        toast.error('Erro ao contabilizar abastecimento.');
      }
    }

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

    // Garantir que os dados retornados estejam no formato esperado
    const validData: AbastecimentoData[] = (data || []).map(item => ({
      ...item,
      quantidade: item.quantidade || 0 // Adicionar quantidade se não existir
    }));

    return validData;
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
    // Se a contabilização mudou para true e tem contas definidas
    if (updates.contabilizado && updates.conta_debito && updates.conta_credito) {
      // Buscar o abastecimento atual para verificar se já está contabilizado
      const { data: abastecimentoAtual } = await supabase
        .from('Abastecimentos')
        .select('contabilizado, data_abastecimento')
        .eq('id', id)
        .single();
        
      // Se não estava contabilizado antes, cria o lançamento contábil
      if (abastecimentoAtual && !abastecimentoAtual.contabilizado) {
        const lancamentoContabil = {
          data_lancamento: updates.data_abastecimento || abastecimentoAtual.data_abastecimento,
          data_competencia: updates.data_abastecimento || abastecimentoAtual.data_abastecimento,
          conta_debito: updates.conta_debito,
          conta_credito: updates.conta_credito,
          valor: updates.valor_total || 0,
          historico: `Abastecimento ID ${id} - Veículo ${updates.placa_veiculo || ''}`,
          status: 'ativo'
        };
        
        const { error: lancamentoError } = await supabase
          .from('Lancamentos_Contabeis')
          .insert([lancamentoContabil]);
          
        if (lancamentoError) {
          console.error('Erro ao criar lançamento contábil:', lancamentoError);
          toast.error('Erro ao contabilizar abastecimento.');
        }
      }
    }

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

// Função para buscar abastecimentos por contrato
export const buscarAbastecimentosPorContrato = async (contratoId: string): Promise<AbastecimentoData[]> => {
  try {
    const { data, error } = await supabase
      .from('Abastecimentos')
      .select('*')
      .eq('contrato_id', contratoId)
      .order('data_abastecimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar abastecimentos por contrato:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar abastecimentos por contrato:', error);
    return [];
  }
};

// Função para calcular a média de consumo
export const calcularMediaConsumo = (quilometragem: number, quantidade: number): string => {
  if (!quilometragem || !quantidade || quantidade === 0) {
    return 'N/A';
  }
  
  const media = quilometragem / quantidade;
  return `${media.toFixed(2).replace('.', ',')} km/l`;
};

// Função para contabilizar um abastecimento
export const contabilizarAbastecimento = async (
  id: number, 
  contaDebito: string, 
  contaCredito: string
): Promise<boolean> => {
  try {
    // Buscar dados do abastecimento
    const { data: abastecimento, error: fetchError } = await supabase
      .from('Abastecimentos')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Erro ao buscar abastecimento:', fetchError);
      toast.error('Erro ao buscar dados do abastecimento.');
      return false;
    }
    
    if (!abastecimento) {
      toast.error('Abastecimento não encontrado.');
      return false;
    }
    
    // Criar lançamento contábil
    const lancamentoContabil = {
      data_lancamento: abastecimento.data_abastecimento,
      data_competencia: abastecimento.data_abastecimento,
      conta_debito: contaDebito,
      conta_credito: contaCredito,
      valor: abastecimento.valor_total,
      historico: `Abastecimento - Veículo ${abastecimento.placa_veiculo} - Posto ${abastecimento.posto}`,
      status: 'ativo'
    };
    
    const { error: lancamentoError } = await supabase
      .from('Lancamentos_Contabeis')
      .insert([lancamentoContabil]);
      
    if (lancamentoError) {
      console.error('Erro ao criar lançamento contábil:', lancamentoError);
      toast.error('Erro ao contabilizar abastecimento.');
      return false;
    }
    
    // Atualizar status do abastecimento
    const { error: updateError } = await supabase
      .from('Abastecimentos')
      .update({
        contabilizado: true,
        conta_debito: contaDebito,
        conta_credito: contaCredito
      })
      .eq('id', id);
      
    if (updateError) {
      console.error('Erro ao atualizar status do abastecimento:', updateError);
      toast.error('Erro ao atualizar status do abastecimento.');
      return false;
    }
    
    toast.success('Abastecimento contabilizado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao contabilizar abastecimento:', error);
    toast.error('Erro ao contabilizar abastecimento.');
    return false;
  }
};
