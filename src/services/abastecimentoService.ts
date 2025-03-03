
import { supabase } from '@/integrations/supabase/client';
import { AbastecimentoFormData, TipoCombustivel } from '@/types/abastecimento';
import { logOperation } from '@/utils/logOperations';

export async function cadastrarAbastecimento(data: AbastecimentoFormData) {
  try {
    const itensAbastecidos = [{
      tipo: data.tipoCombustivel,
      quantidade: data.quantidade
    }];

    const { error } = await supabase
      .from('Abastecimentos')
      .insert({
        data_abastecimento: data.data,
        placa_veiculo: data.placa,
        motorista_solicitante: data.motorista,
        tipo_combustivel: data.tipoCombustivel,
        valor_abastecimento: data.valor,
        valor_total: data.valor,
        quilometragem: data.quilometragem,
        posto: data.posto,
        responsavel_autorizacao: data.responsavel,
        itens_abastecidos: JSON.stringify(itensAbastecidos)
      });

    if (error) throw error;
    
    logOperation('Abastecimentos', `Abastecimento registrado para veículo ${data.placa}`);
    return { success: true };
  } catch (error) {
    console.error('Erro ao cadastrar abastecimento:', error);
    return { success: false, error };
  }
}

export async function buscarAbastecimentos() {
  try {
    const { data, error } = await supabase
      .from('Abastecimentos')
      .select('*')
      .order('data_abastecimento', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar abastecimentos:', error);
    return { success: false, error, data: [] };
  }
}

export async function buscarTiposCombustivel() {
  try {
    const { data, error } = await supabase
      .from('TiposCombustivel')
      .select('*')
      .order('nome');

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erro ao buscar tipos de combustível:', error);
    return { success: false, error, data: [] };
  }
}

export async function cadastrarTipoCombustivel(tipo: TipoCombustivel) {
  try {
    const { error } = await supabase
      .from('TiposCombustivel')
      .insert(tipo);

    if (error) throw error;
    
    logOperation('Abastecimentos', `Tipo de combustível cadastrado: ${tipo.nome}`);
    return { success: true, id: tipo.id };
  } catch (error) {
    console.error('Erro ao cadastrar tipo de combustível:', error);
    return { success: false, error };
  }
}
