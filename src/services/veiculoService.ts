
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VeiculoData {
  id: string | number;
  placa: string;
  tipo: 'Cavalo' | 'Carreta';
  modelo: string;
  ano: number;
  status: 'Ativo' | 'Inativo';
  frota: 'Própria' | 'Terceirizada';
  inativacao?: {
    data: string;
    motivo: string;
  } | null;
}

/**
 * Carrega todos os veículos do banco de dados
 * @returns Lista de veículos formatados
 */
export const carregarVeiculos = async (): Promise<{ veiculos: VeiculoData[]; error: string | null }> => {
  console.log('Carregando veículos...');
  
  try {
    const { data, error } = await supabase
      .from('Veiculos')
      .select('*');

    console.log('Resposta do Supabase:', { data, error });

    if (error) {
      console.error("Erro ao carregar veículos:", error);
      return { veiculos: [], error: "Erro ao carregar a lista de veículos" };
    }

    // Mapear dados para o formato esperado
    const veiculosFormatados = (data || []).map(veiculo => {
      console.log('Processando veículo:', veiculo);
      return {
        id: veiculo.id || Math.random().toString(36).substr(2, 9),
        placa: veiculo.placa_cavalo || veiculo.placa_carreta || 'Sem placa',
        tipo: veiculo.placa_cavalo ? 'Cavalo' : 'Carreta',
        modelo: 'Não especificado', // Valor padrão
        ano: new Date().getFullYear(), // Valor padrão
        status: veiculo.status_veiculo || 'Ativo',
        frota: veiculo.tipo_frota || 'Própria',
        inativacao: veiculo.status_veiculo === 'Inativo' ? {
          data: veiculo.data_inativacao || '2023-01-01',
          motivo: veiculo.motivo_inativacao || 'Não especificado'
        } : null
      };
    });

    console.log('Veículos formatados:', veiculosFormatados);
    return { veiculos: veiculosFormatados, error: null };
  } catch (err) {
    console.error("Erro ao processar dados:", err);
    return { veiculos: [], error: "Ocorreu um erro ao processar os dados dos veículos" };
  }
};

/**
 * Inativa um veículo no sistema
 * @param id ID do veículo
 * @param motivo Motivo da inativação
 * @param data Data da inativação
 * @param veiculoPlaca Placa do veículo
 * @param tipoVeiculo Tipo do veículo (Cavalo ou Carreta)
 */
export const inativarVeiculo = async (
  id: string | number,
  motivo: string,
  data: string,
  veiculoPlaca: string,
  tipoVeiculo: 'Cavalo' | 'Carreta'
): Promise<boolean> => {
  try {
    console.log('Inativando veículo:', { id, placa: veiculoPlaca, motivo, data });

    // Atualiza no banco de dados
    const { error } = await supabase
      .from('Veiculos')
      .update({
        status_veiculo: 'Inativo',
        data_inativacao: data,
        motivo_inativacao: motivo
      })
      .eq(tipoVeiculo === 'Cavalo' ? 'placa_cavalo' : 'placa_carreta', veiculoPlaca);

    if (error) {
      console.error("Erro ao inativar veículo:", error);
      toast.error("Erro ao inativar veículo");
      return false;
    }
    
    toast.success("Veículo inativado com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao processar inativação:", err);
    toast.error("Ocorreu um erro ao inativar o veículo");
    return false;
  }
};

/**
 * Exclui um veículo do sistema
 * @param id ID do veículo
 * @param veiculoPlaca Placa do veículo
 * @param tipoVeiculo Tipo do veículo (Cavalo ou Carreta)
 */
export const excluirVeiculo = async (
  id: string | number, 
  veiculoPlaca: string,
  tipoVeiculo: 'Cavalo' | 'Carreta'
): Promise<boolean> => {
  try {
    console.log('Excluindo veículo:', { id, placa: veiculoPlaca });

    // Exclui do banco de dados
    const { error } = await supabase
      .from('Veiculos')
      .delete()
      .eq(tipoVeiculo === 'Cavalo' ? 'placa_cavalo' : 'placa_carreta', veiculoPlaca);

    if (error) {
      console.error("Erro ao excluir veículo:", error);
      toast.error("Erro ao excluir veículo");
      return false;
    }
    
    toast.success("Veículo excluído com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao processar exclusão:", err);
    toast.error("Ocorreu um erro ao excluir o veículo");
    return false;
  }
};

/**
 * Exclui todos os veículos do sistema
 */
export const excluirTodosVeiculos = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Veiculos')
      .delete()
      .neq('id', -1); // Condição que sempre será verdadeira, para excluir todos

    if (error) {
      console.error("Erro ao excluir todos os veículos:", error);
      toast.error("Erro ao excluir todos os veículos");
      return false;
    }

    toast.success("Todos os veículos foram excluídos com sucesso!");
    return true;
  } catch (err) {
    console.error("Erro ao processar exclusão em massa:", err);
    toast.error("Ocorreu um erro ao excluir os veículos");
    return false;
  }
};
