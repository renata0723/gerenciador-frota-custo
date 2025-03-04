
import { supabase } from '@/integrations/supabase/client';

// Diretamente definido aqui ao invés de importar do componente
export type TruckType = 'cavalo' | 'carreta';

export interface VeiculoData {
  id?: number; 
  placa: string;
  tipo: "Cavalo" | "Carreta";
  modelo: string;
  ano: number;
  status: string;
  frota: string;
  inativacao?: {
    data?: string;
    motivo?: string;
  };
}

export const listarVeiculos = async (): Promise<VeiculoData[]> => {
  try {
    const { data, error } = await supabase
      .from('Veiculos')
      .select('*');

    if (error) {
      console.error('Erro ao buscar veículos:', error);
      throw error;
    }

    // Transformar os dados no formato esperado pelo componente
    const veiculos = data.map((veiculo) => {
      // Determinar qual placa usar como ID principal
      const placa = veiculo.placa_cavalo || veiculo.placa_carreta;
      
      // Determinar o tipo baseado em qual placa está presente
      const tipo = veiculo.placa_cavalo ? "Cavalo" as const : "Carreta" as const;
      
      // Modelo mockado - em um sistema real, viria do banco
      const modelo = tipo === "Cavalo" ? "Volvo FH 460" : "Randon Carga Seca";
      
      // Ano mockado - em um sistema real, viria do banco
      const ano = 2021;
      
      const veiculoFormatado: VeiculoData = {
        placa, 
        tipo,
        modelo,
        ano,
        status: veiculo.status_veiculo || 'Ativo',
        frota: veiculo.tipo_frota || 'Própria',
        inativacao: {
          data: veiculo.data_inativacao,
          motivo: veiculo.motivo_inativacao
        }
      };
      
      return veiculoFormatado;
    });

    return veiculos;
  } catch (error) {
    console.error('Erro ao listar veículos:', error);
    throw error;
  }
};

export const cadastrarVeiculo = async (
  tipo: TruckType,
  dadosGerais: any,
  dadosEspecificos: any
): Promise<boolean> => {
  try {
    const { placa, tipoFrota, status } = dadosGerais;
    
    // Preparar os dados comuns para inserção
    const dadosVeiculo: {
      [key: string]: any;
      placa_cavalo?: string;
      placa_carreta?: string;
      tipo_frota: string;
      status_veiculo: string;
    } = {
      tipo_frota: tipoFrota,
      status_veiculo: status
    };
    
    // Adicionar placa ao campo correto baseado no tipo
    if (tipo === 'cavalo') {
      dadosVeiculo.placa_cavalo = placa;
    } else {
      dadosVeiculo.placa_carreta = placa;
    }
    
    // Inserir no banco de dados
    const { error } = await supabase
      .from('Veiculos')
      .insert([dadosVeiculo]);
    
    if (error) {
      console.error('Erro ao cadastrar veículo:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao cadastrar veículo:', error);
    return false;
  }
};

export const inativarVeiculo = async (placa: string, motivo: string): Promise<boolean> => {
  try {
    // Verificar se a placa é de cavalo ou carreta
    let campo: 'placa_cavalo' | 'placa_carreta' = 'placa_cavalo';
    
    // Primeiro, tenta encontrar a placa
    let { data, error } = await supabase
      .from('Veiculos')
      .select('*')
      .eq('placa_cavalo', placa);
    
    // Se não encontrou como cavalo, tenta como carreta
    if (error || !data || data.length === 0) {
      campo = 'placa_carreta';
      
      ({ data, error } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('placa_carreta', placa));
      
      if (error || !data || data.length === 0) {
        console.error('Veículo não encontrado:', placa);
        return false;
      }
    }
    
    // Agora que sabemos qual campo usar, atualizamos o registro
    const { error: updateError } = await supabase
      .from('Veiculos')
      .update({ 
        status_veiculo: 'Inativo',
        data_inativacao: new Date().toISOString(),
        motivo_inativacao: motivo
      })
      .eq(campo, placa);
    
    if (updateError) {
      console.error('Erro ao inativar veículo:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao inativar veículo:', error);
    return false;
  }
};

export const excluirVeiculo = async (placa: string): Promise<boolean> => {
  try {
    // Verificar se a placa é de cavalo ou carreta
    let campo: 'placa_cavalo' | 'placa_carreta' = 'placa_cavalo';
    
    // Primeiro, tenta encontrar a placa
    let { data, error } = await supabase
      .from('Veiculos')
      .select('*')
      .eq('placa_cavalo', placa);
    
    // Se não encontrou como cavalo, tenta como carreta
    if (error || !data || data.length === 0) {
      campo = 'placa_carreta';
      
      ({ data, error } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('placa_carreta', placa));
      
      if (error || !data || data.length === 0) {
        console.error('Veículo não encontrado:', placa);
        return false;
      }
    }
    
    // Agora que sabemos qual campo usar, excluímos o registro
    const { error: deleteError } = await supabase
      .from('Veiculos')
      .delete()
      .eq(campo, placa);
    
    if (deleteError) {
      console.error('Erro ao excluir veículo:', deleteError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir veículo:', error);
    return false;
  }
};
