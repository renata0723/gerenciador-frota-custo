
import { supabase } from '@/integrations/supabase/client';
import { CancelamentoDocumento } from '@/types/canhoto';
import { logOperation } from '@/utils/logOperations';
import { format } from 'date-fns';

// Registrar cancelamento de documento (Contrato, CT-e ou Manifesto)
export const registrarCancelamento = async (cancelamento: CancelamentoDocumento): Promise<boolean> => {
  try {
    // Inserir o registro de cancelamento na tabela Cancelamentos
    const { error: cancelamentoError } = await supabase
      .from('Cancelamentos')
      .insert({
        tipo_documento: cancelamento.tipo_documento,
        numero_documento: cancelamento.numero_documento,
        data_cancelamento: cancelamento.data_cancelamento || new Date().toISOString(),
        motivo: cancelamento.motivo,
        responsavel: cancelamento.responsavel,
        observacoes: cancelamento.observacoes || null
      });
    
    if (cancelamentoError) {
      console.error('Erro ao registrar cancelamento:', cancelamentoError);
      return false;
    }
    
    // Se for um contrato, atualizar o status do contrato
    if (cancelamento.tipo_documento === 'Contrato') {
      const { error: contratoError } = await supabase
        .from('Contratos')
        .update({
          cancelado: true,
          data_cancelamento: cancelamento.data_cancelamento || new Date().toISOString(),
          status_contrato: 'Cancelado'
        })
        .eq('id', Number(cancelamento.numero_documento));
      
      if (contratoError) {
        console.error('Erro ao atualizar contrato:', contratoError);
        return false;
      }
    }
    
    // Registrar a operação no log
    logOperation(
      'Cancelamentos', 
      `Cancelamento de ${cancelamento.tipo_documento}`, 
      `Documento: ${cancelamento.numero_documento}, Motivo: ${cancelamento.motivo}`
    );
    
    // Atualizar DRE para remover o valor do contrato cancelado
    if (cancelamento.tipo_documento === 'CT-e') {
      await atualizarDREAposCancelamento(cancelamento.tipo_documento, cancelamento.numero_documento);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao processar cancelamento:', error);
    logOperation('Cancelamentos', `Falha no cancelamento de ${cancelamento.tipo_documento}`, 'false');
    return false;
  }
};

// Obter lista de cancelamentos
export const getCancelamentos = async (): Promise<CancelamentoDocumento[]> => {
  try {
    const { data, error } = await supabase
      .from('Cancelamentos')
      .select('*')
      .order('data_cancelamento', { ascending: false });
    
    if (error) throw error;
    
    return data as unknown as CancelamentoDocumento[];
  } catch (error) {
    console.error('Erro ao buscar cancelamentos:', error);
    return [];
  }
};

// Obter cancelamentos de um determinado tipo de documento
export const getCancelamentosPorTipo = async (tipo: 'Contrato' | 'CT-e' | 'Manifesto'): Promise<CancelamentoDocumento[]> => {
  try {
    const { data, error } = await supabase
      .from('Cancelamentos')
      .select('*')
      .eq('tipo_documento', tipo)
      .order('data_cancelamento', { ascending: false });
    
    if (error) throw error;
    
    return data as unknown as CancelamentoDocumento[];
  } catch (error) {
    console.error(`Erro ao buscar cancelamentos de ${tipo}:`, error);
    return [];
  }
};

// Atualizar o DRE após cancelamento para desconsiderar na receita
export const atualizarDREAposCancelamento = async (tipo: string, numeroDocumento: string): Promise<boolean> => {
  try {
    // Caso seja um CT-e, obter o valor associado
    if (tipo === 'CT-e') {
      const { data: contratoData, error: contratoError } = await supabase
        .from('Contratos')
        .select('valor_frete')
        .eq('numero_cte', numeroDocumento)
        .single();
      
      if (contratoError) {
        console.error('Erro ao buscar contrato por CT-e:', contratoError);
        return false;
      }
      
      // Se encontrou o contrato, atualizar o DRE (ajustar a receita)
      if (contratoData) {
        const mesAtual = format(new Date(), 'yyyy-MM');
        
        // Buscar DRE do período atual
        const { data: dreData, error: dreError } = await supabase
          .from('DRE')
          .select('*')
          .like('periodo_inicio', `${mesAtual}%`)
          .maybeSingle();
        
        if (dreError && dreError.code !== 'PGRST116') {
          console.error('Erro ao buscar DRE:', dreError);
          return false;
        }
        
        // Se encontrou DRE, atualizar receita
        if (dreData) {
          const novaReceita = parseFloat(dreData.receita_bruta || '0') - parseFloat(contratoData.valor_frete || '0');
          const novaReceitaLiquida = parseFloat(dreData.receita_liquida || '0') - parseFloat(contratoData.valor_frete || '0');
          
          const { error: updateError } = await supabase
            .from('DRE')
            .update({
              receita_bruta: novaReceita >= 0 ? novaReceita : 0,
              receita_liquida: novaReceitaLiquida >= 0 ? novaReceitaLiquida : 0
            })
            .eq('id', dreData.id);
          
          if (updateError) {
            console.error('Erro ao atualizar DRE:', updateError);
            return false;
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao atualizar DRE após cancelamento:', error);
    return false;
  }
};
