
import { supabase } from '@/integrations/supabase/client';
import { AbastecimentoFormData, TipoCombustivel } from '@/types/abastecimento';

export async function cadastrarAbastecimento(data: AbastecimentoFormData) {
  try {
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
        itens_abastecidos: JSON.stringify([{ 
          tipo: data.tipoCombustivel, 
          quantidade: data.quantidade 
        }])
      });

    if (error) throw error;
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

export async function buscarTiposCombustivel(): Promise<TipoCombustivel[]> {
  // Esta função eventualmente poderia buscar tipos de combustível do banco de dados
  // Por enquanto retorna dados estáticos
  return [
    { id: "1", nome: 'Diesel S10', descricao: 'Combustível Diesel com baixo teor de enxofre' },
    { id: "2", nome: 'Diesel Comum', descricao: 'Combustível Diesel comum' },
    { id: "3", nome: 'Arla 32', descricao: 'Agente Redutor Líquido Automotivo' },
    { id: "4", nome: 'Gasolina', descricao: 'Gasolina comum' }
  ];
}

export async function cadastrarTipoCombustivel(tipo: TipoCombustivel) {
  // Esta função simularia adicionar um tipo de combustível ao banco
  console.log('Tipo de combustível cadastrado (simulação):', tipo);
  return { success: true, id: Date.now().toString() };
}
