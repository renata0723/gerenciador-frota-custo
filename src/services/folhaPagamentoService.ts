
import { supabase } from '@/integrations/supabase/client';
import { FolhaPagamento, StatusItem } from '@/types/contabilidade';
import { logOperation } from '@/utils/logOperations';
import { createFolhaPagamentoTable } from '@/integrations/supabase/exec-sql';

// Inicialização - verifica se a tabela existe e cria se necessário
const initFolhaPagamento = async (): Promise<void> => {
  await createFolhaPagamentoTable();
};

// Chama a inicialização automaticamente
initFolhaPagamento().catch(error => {
  console.error('Erro ao inicializar módulo de Folha de Pagamento:', error);
});

/**
 * Lista todos os registros de folha de pagamento
 */
export const listarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    // Cria a tabela se não existir
    await createFolhaPagamentoTable();
    
    // Tenta buscar os dados da tabela real
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar folhas de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao listar folhas de pagamento', false);
      
      // Se houve erro, retorna dados mockados
      return criarDadosMockados();
    }
    
    if (!data || data.length === 0) {
      // Se não há dados, insere dados mockados e retorna
      await inserirDadosMockados();
      return criarDadosMockados();
    }
    
    return data.map(item => ({
      ...item,
      status: item.status as StatusItem
    }));
  } catch (error) {
    console.error('Erro ao listar folhas de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao listar folhas de pagamento', false);
    return criarDadosMockados();
  }
};

/**
 * Adiciona um novo registro de folha de pagamento
 */
export const adicionarFolhaPagamento = async (folha: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    // Cria a tabela se não existir
    await createFolhaPagamentoTable();
    
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert([{
        funcionario_nome: folha.funcionario_nome,
        salario_base: folha.salario_base,
        data_pagamento: folha.data_pagamento,
        mes_referencia: folha.mes_referencia,
        ano_referencia: folha.ano_referencia,
        inss: folha.inss,
        fgts: folha.fgts,
        ir: folha.ir,
        vale_transporte: folha.vale_transporte,
        vale_refeicao: folha.vale_refeicao,
        outros_descontos: folha.outros_descontos,
        outros_beneficios: folha.outros_beneficios,
        valor_liquido: folha.valor_liquido,
        observacoes: folha.observacoes,
        status: folha.status || 'concluido'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao adicionar folha de pagamento', false);
      return null;
    }
    
    logOperation('Folha de Pagamento', 'Folha de pagamento adicionada com sucesso', true);
    return {
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao adicionar folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao adicionar folha de pagamento', false);
    return null;
  }
};

/**
 * Atualiza um registro existente de folha de pagamento
 */
export const atualizarFolhaPagamento = async (id: number, folha: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .update({
        funcionario_nome: folha.funcionario_nome,
        salario_base: folha.salario_base,
        data_pagamento: folha.data_pagamento,
        mes_referencia: folha.mes_referencia,
        ano_referencia: folha.ano_referencia,
        inss: folha.inss,
        fgts: folha.fgts,
        ir: folha.ir,
        vale_transporte: folha.vale_transporte,
        vale_refeicao: folha.vale_refeicao,
        outros_descontos: folha.outros_descontos,
        outros_beneficios: folha.outros_beneficios,
        valor_liquido: folha.valor_liquido,
        observacoes: folha.observacoes,
        status: folha.status
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao atualizar folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao atualizar folha de pagamento', false);
      return null;
    }
    
    logOperation('Folha de Pagamento', 'Folha de pagamento atualizada com sucesso', true);
    return {
      ...data,
      status: data.status as StatusItem
    };
  } catch (error) {
    console.error('Erro ao atualizar folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao atualizar folha de pagamento', false);
    return null;
  }
};

/**
 * Exclui um registro de folha de pagamento
 */
export const excluirFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir folha de pagamento:', error);
      logOperation('Folha de Pagamento', 'Erro ao excluir folha de pagamento', false);
      return false;
    }
    
    logOperation('Folha de Pagamento', 'Folha de pagamento excluída com sucesso', true);
    return true;
  } catch (error) {
    console.error('Erro ao excluir folha de pagamento:', error);
    logOperation('Folha de Pagamento', 'Erro ao excluir folha de pagamento', false);
    return false;
  }
};

/**
 * Auxiliar - Cria dados mockados para exibição
 */
const criarDadosMockados = (): FolhaPagamento[] => {
  const dataAtual = new Date();
  const mesAtual = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const anoAtual = dataAtual.getFullYear().toString();
  const mesAnterior = String(dataAtual.getMonth() === 0 ? 12 : dataAtual.getMonth()).padStart(2, '0');
  const anoAnterior = dataAtual.getMonth() === 0 ? (dataAtual.getFullYear() - 1).toString() : anoAtual;
  
  return [
    {
      id: 1,
      funcionario_nome: 'João Silva',
      salario_base: 5000,
      data_pagamento: `${anoAtual}-${mesAtual}-05`,
      mes_referencia: mesAnterior,
      ano_referencia: anoAnterior,
      inss: 550,
      fgts: 400,
      ir: 250,
      valor_liquido: 3800,
      status: 'concluido' as StatusItem,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      funcionario_nome: 'Maria Oliveira',
      salario_base: 6500,
      data_pagamento: `${anoAtual}-${mesAtual}-05`,
      mes_referencia: mesAnterior,
      ano_referencia: anoAnterior,
      inss: 715,
      fgts: 520,
      ir: 450,
      valor_liquido: 4815,
      status: 'concluido' as StatusItem,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      funcionario_nome: 'Carlos Santos',
      salario_base: 7200,
      data_pagamento: `${anoAtual}-${mesAtual}-05`,
      mes_referencia: mesAnterior,
      ano_referencia: anoAnterior,
      inss: 792,
      fgts: 576,
      ir: 520,
      valor_liquido: 5312,
      status: 'concluido' as StatusItem,
      created_at: new Date().toISOString()
    }
  ];
};

/**
 * Auxiliar - Insere dados mockados no banco
 */
const inserirDadosMockados = async (): Promise<void> => {
  try {
    const dadosMockados = criarDadosMockados();
    
    const { error } = await supabase
      .from('Folha_Pagamento')
      .insert(dadosMockados.map(item => ({
        funcionario_nome: item.funcionario_nome,
        salario_base: item.salario_base,
        data_pagamento: item.data_pagamento,
        mes_referencia: item.mes_referencia,
        ano_referencia: item.ano_referencia,
        inss: item.inss,
        fgts: item.fgts,
        ir: item.ir,
        valor_liquido: item.valor_liquido,
        status: item.status
      })));
    
    if (error) {
      console.error('Erro ao inserir dados mockados de folha de pagamento:', error);
    } else {
      console.log('Dados mockados de folha de pagamento inseridos com sucesso!');
    }
  } catch (error) {
    console.error('Erro ao inserir dados mockados de folha de pagamento:', error);
  }
};
