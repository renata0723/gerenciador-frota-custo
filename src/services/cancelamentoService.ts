
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const buscarCancelamentos = async () => {
  try {
    const { data, error } = await supabase
      .from('Cancelamentos')
      .select('*')
      .order('data_cancelamento', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar cancelamentos:', error);
    return [];
  }
};

export const criarCancelamento = async (
  tipoDocumento: string,
  numeroDocumento: string,
  motivo: string,
  observacoes: string,
  responsavel: string
) => {
  try {
    // Verificar se o documento já foi cancelado
    const { data: docExistente, error: errorVerificacao } = await supabase
      .from('Cancelamentos')
      .select('id')
      .eq('tipo_documento', tipoDocumento)
      .eq('numero_documento', numeroDocumento)
      .maybeSingle();
    
    if (errorVerificacao) {
      throw errorVerificacao;
    }
    
    if (docExistente) {
      toast.error('Este documento já foi cancelado anteriormente');
      return null;
    }
    
    // Criar o cancelamento
    const { data, error } = await supabase
      .from('Cancelamentos')
      .insert({
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento,
        motivo,
        observacoes,
        responsavel
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    // Atualizar o status do documento conforme o tipo
    await atualizarStatusDocumento(tipoDocumento, numeroDocumento);
    
    return data;
  } catch (error) {
    console.error('Erro ao criar cancelamento:', error);
    toast.error('Ocorreu um erro ao registrar o cancelamento');
    return null;
  }
};

// Função para atualizar o status do documento que foi cancelado
const atualizarStatusDocumento = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    let tabela = '';
    let campoNumero = '';
    let novoStatus = '';
    
    // Determinar a tabela e campo corretos com base no tipo de documento
    switch (tipoDocumento) {
      case 'Nota Fiscal':
        tabela = 'Notas Fiscais';
        campoNumero = 'numero_nota_fiscal';
        novoStatus = 'Cancelada';
        break;
      case 'Contrato':
        tabela = 'Contratos';
        campoNumero = 'id';
        novoStatus = 'Cancelado';
        break;
      case 'Manifesto':
        // Nesse caso, o manifesto está na tabela de Canhoto
        tabela = 'Canhoto';
        campoNumero = 'numero_manifesto';
        novoStatus = 'Cancelado';
        break;
      case 'CTe':
        // CTe também está na tabela de Canhoto
        tabela = 'Canhoto';
        campoNumero = 'numero_cte';
        novoStatus = 'Cancelado';
        break;
      default:
        console.warn(`Tipo de documento não suportado para atualização: ${tipoDocumento}`);
        return;
    }
    
    if (tabela && campoNumero) {
      // Verificar se o documento existe
      let query = null;
      
      // Para Contratos, que é numérico
      if (tipoDocumento === 'Contrato') {
        const id = numeroDocumento;
        query = await supabase
          .from(tabela as any)
          .select('*')
          .eq(campoNumero, id);
      } else {
        query = await supabase
          .from(tabela as any)
          .select('*')
          .eq(campoNumero, numeroDocumento);
      }
      
      if (!query) {
        console.error(`Erro na consulta para documento ${tipoDocumento}`);
        return;
      }
      
      const { data: docExistente, error: errorVerificacao } = query;
      
      if (errorVerificacao) {
        console.error(`Erro ao verificar existência do documento ${tipoDocumento}:`, errorVerificacao);
        return;
      }
      
      if (!docExistente || docExistente.length === 0) {
        console.warn(`Documento ${tipoDocumento} #${numeroDocumento} não encontrado para atualização`);
        return;
      }
      
      // Para Contratos, atualizar o status_contrato
      if (tipoDocumento === 'Contrato') {
        const { error } = await supabase
          .from(tabela as any)
          .update({ status_contrato: novoStatus })
          .eq(campoNumero, numeroDocumento);
        
        if (error) {
          throw error;
        }
      } 
      // Para outros tipos, atualizar o campo status
      else {
        const { error } = await supabase
          .from(tabela as any)
          .update({ status: novoStatus })
          .eq(campoNumero, numeroDocumento);
        
        if (error) {
          throw error;
        }
      }
      
      console.log(`Status do ${tipoDocumento} #${numeroDocumento} atualizado para ${novoStatus}`);
    }
  } catch (error) {
    console.error(`Erro ao atualizar status do documento ${tipoDocumento}:`, error);
  }
};

export const verificarSeDocumentoJaCancelado = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    const { data, error } = await supabase
      .from('Cancelamentos')
      .select('id')
      .eq('tipo_documento', tipoDocumento)
      .eq('numero_documento', numeroDocumento)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data !== null;
  } catch (error) {
    console.error('Erro ao verificar se documento já foi cancelado:', error);
    return false;
  }
};

export const verificarSeDocumentoExiste = async (tipoDocumento: string, numeroDocumento: string) => {
  try {
    let tabela = '';
    let campoNumero = '';
    
    // Determinar a tabela e campo corretos com base no tipo de documento
    switch (tipoDocumento) {
      case 'Nota Fiscal':
        tabela = 'Notas Fiscais';
        campoNumero = 'numero_nota_fiscal';
        break;
      case 'Contrato':
        tabela = 'Contratos';
        campoNumero = 'id';
        break;
      case 'Manifesto':
        tabela = 'Canhoto';
        campoNumero = 'numero_manifesto';
        break;
      case 'CTe':
        tabela = 'Canhoto';
        campoNumero = 'numero_cte';
        break;
      default:
        return false;
    }
    
    // Para o caso especial de Contrato, que é numérico
    let query = null;
    
    if (tipoDocumento === 'Contrato') {
      const id = String(numeroDocumento);
      query = await supabase
        .from(tabela as any)
        .select('id')
        .eq(campoNumero, id);
    } else {
      query = await supabase
        .from(tabela as any)
        .select('*')
        .eq(campoNumero, numeroDocumento);
    }
    
    if (!query) {
      return false;
    }
    
    const { data, error } = query;
    
    if (error) {
      throw error;
    }
    
    return data !== null && data.length > 0;
  } catch (error) {
    console.error('Erro ao verificar se documento existe:', error);
    return false;
  }
};

// Aliases para compatibilidade com código existente
export const getCancelamentos = buscarCancelamentos;
export const getCancelamentosPorTipo = async (tipo: string) => {
  try {
    const cancelamentos = await buscarCancelamentos();
    return cancelamentos.filter(c => c.tipo_documento === tipo);
  } catch (error) {
    console.error('Erro ao filtrar cancelamentos por tipo:', error);
    return [];
  }
};

export const registrarCancelamento = criarCancelamento;

export const atualizarDREAposCancelamento = async (contaId: number) => {
  console.log('Atualizando DRE após cancelamento', contaId);
  // Implementação não é necessária para este exemplo, mas mantida para compatibilidade
  return true;
};
