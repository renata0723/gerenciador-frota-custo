
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
      const { data: docExistente, error: errorVerificacao } = await supabase
        .from(tabela)
        .select('*')
        .eq(campoNumero, numeroDocumento)
        .maybeSingle();
      
      if (errorVerificacao) {
        console.error(`Erro ao verificar existência do documento ${tipoDocumento}:`, errorVerificacao);
        return;
      }
      
      if (!docExistente) {
        console.warn(`Documento ${tipoDocumento} #${numeroDocumento} não encontrado para atualização`);
        return;
      }
      
      // Para Contratos, atualizar o status_contrato
      if (tipoDocumento === 'Contrato') {
        const { error } = await supabase
          .from(tabela)
          .update({ status_contrato: novoStatus })
          .eq(campoNumero, numeroDocumento);
        
        if (error) {
          throw error;
        }
      } 
      // Para outros tipos, atualizar o campo status
      else {
        const { error } = await supabase
          .from(tabela)
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
    if (tipoDocumento === 'Contrato') {
      const id = String(numeroDocumento);
      
      const { data, error } = await supabase
        .from(tabela)
        .select('id')
        .eq(campoNumero, id)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data !== null;
    } else {
      const { data, error } = await supabase
        .from(tabela)
        .select('*')
        .eq(campoNumero, numeroDocumento)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data !== null;
    }
  } catch (error) {
    console.error('Erro ao verificar se documento existe:', error);
    return false;
  }
};
