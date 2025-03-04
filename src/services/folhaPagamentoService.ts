
import { supabase } from '@/integrations/supabase/client';
import { FolhaPagamento, StatusItem } from '@/types/contabilidade';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Função para buscar todos os registros de folha de pagamento
export const listarFolhaPagamento = async (): Promise<FolhaPagamento[]> => {
  try {
    // Verificar se a tabela existe
    const { data: checkResult } = await supabase
      .rpc('check_table_exists', { table_name: 'Folha_Pagamento' });
      
    // Se a tabela não existir, cria-la
    if (!checkResult || checkResult === 0) {
      await supabase.rpc('create_folha_pagamento_table');
      console.log('Tabela Folha_Pagamento criada com sucesso');
      toast.success('Tabela de Folha de Pagamento criada com sucesso');
    }
    
    // Buscar todos os registros
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .order('data_pagamento', { ascending: false });
    
    if (error) {
      console.error('Erro ao listar folha de pagamento:', error);
      throw error;
    }
    
    // Converter os dados para o formato esperado
    const folhaPagamentos: FolhaPagamento[] = (data || []).map(item => ({
      id: item.id,
      funcionario_nome: item.funcionario_nome,
      salario_base: item.salario_base,
      data_pagamento: item.data_pagamento,
      mes_referencia: item.mes_referencia,
      ano_referencia: item.ano_referencia,
      inss: item.inss,
      fgts: item.fgts,
      ir: item.ir,
      vale_transporte: item.vale_transporte,
      vale_refeicao: item.vale_refeicao,
      outros_descontos: item.outros_descontos,
      outros_beneficios: item.outros_beneficios,
      valor_liquido: item.valor_liquido,
      observacoes: item.observacoes,
      status: item.status as StatusItem,
      created_at: item.created_at
    }));
    
    return folhaPagamentos;
  } catch (error) {
    console.error('Erro ao listar folha de pagamento:', error);
    toast.error('Erro ao listar registros de folha de pagamento');
    return [];
  }
};

// Função para buscar um registro específico de folha de pagamento
export const buscarFolhaPagamento = async (id: number): Promise<FolhaPagamento | null> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar folha de pagamento:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    // Converter os dados para o formato esperado
    const folhaPagamento: FolhaPagamento = {
      id: data.id,
      funcionario_nome: data.funcionario_nome,
      salario_base: data.salario_base,
      data_pagamento: data.data_pagamento,
      mes_referencia: data.mes_referencia,
      ano_referencia: data.ano_referencia,
      inss: data.inss,
      fgts: data.fgts,
      ir: data.ir,
      vale_transporte: data.vale_transporte,
      vale_refeicao: data.vale_refeicao,
      outros_descontos: data.outros_descontos,
      outros_beneficios: data.outros_beneficios,
      valor_liquido: data.valor_liquido,
      observacoes: data.observacoes,
      status: data.status as StatusItem,
      created_at: data.created_at
    };
    
    return folhaPagamento;
  } catch (error) {
    console.error('Erro ao buscar folha de pagamento:', error);
    toast.error('Erro ao buscar registro de folha de pagamento');
    return null;
  }
};

// Função para criar um novo registro de folha de pagamento
export const criarRegistroFolhaPagamento = async (dados: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    // Calcular o valor líquido se não foi informado
    if (!dados.valor_liquido) {
      const salarioBase = dados.salario_base || 0;
      const inss = dados.inss || 0;
      const fgts = dados.fgts || 0;
      const ir = dados.ir || 0;
      const valeTransporte = dados.vale_transporte || 0;
      const valeRefeicao = dados.vale_refeicao || 0;
      const outrosDescontos = dados.outros_descontos || 0;
      const outrosBeneficios = dados.outros_beneficios || 0;
      
      const valorLiquido = salarioBase - inss - ir - valeTransporte - valeRefeicao - outrosDescontos + outrosBeneficios;
      dados.valor_liquido = valorLiquido;
    }
    
    // Inserir o registro
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .insert(dados)
      .select('*')
      .single();
    
    if (error) {
      console.error('Erro ao criar registro de folha de pagamento:', error);
      throw error;
    }
    
    // Converter os dados para o formato esperado
    const folhaPagamento: FolhaPagamento = {
      id: data.id,
      funcionario_nome: data.funcionario_nome,
      salario_base: data.salario_base,
      data_pagamento: data.data_pagamento,
      mes_referencia: data.mes_referencia,
      ano_referencia: data.ano_referencia,
      inss: data.inss,
      fgts: data.fgts,
      ir: data.ir,
      vale_transporte: data.vale_transporte,
      vale_refeicao: data.vale_refeicao,
      outros_descontos: data.outros_descontos,
      outros_beneficios: data.outros_beneficios,
      valor_liquido: data.valor_liquido,
      observacoes: data.observacoes,
      status: data.status as StatusItem,
      created_at: data.created_at
    };
    
    toast.success(`Folha de pagamento de ${data.funcionario_nome} registrada com sucesso!`);
    return folhaPagamento;
  } catch (error) {
    console.error('Erro ao criar registro de folha de pagamento:', error);
    toast.error('Erro ao criar registro de folha de pagamento');
    return null;
  }
};

// Função para atualizar um registro de folha de pagamento
export const atualizarRegistroFolhaPagamento = async (id: number, dados: Partial<FolhaPagamento>): Promise<FolhaPagamento | null> => {
  try {
    // Calcular o valor líquido se não foi informado mas outros componentes foram
    if (!dados.valor_liquido && (dados.salario_base || dados.inss || dados.fgts || dados.ir || 
        dados.vale_transporte || dados.vale_refeicao || dados.outros_descontos || dados.outros_beneficios)) {
      
      // Precisamos buscar o registro atual primeiro para ter todos os valores
      const registroAtual = await buscarFolhaPagamento(id);
      if (!registroAtual) {
        throw new Error('Registro não encontrado');
      }
      
      const salarioBase = dados.salario_base || registroAtual.salario_base;
      const inss = dados.inss || registroAtual.inss || 0;
      const fgts = dados.fgts || registroAtual.fgts || 0;
      const ir = dados.ir || registroAtual.ir || 0;
      const valeTransporte = dados.vale_transporte || registroAtual.vale_transporte || 0;
      const valeRefeicao = dados.vale_refeicao || registroAtual.vale_refeicao || 0;
      const outrosDescontos = dados.outros_descontos || registroAtual.outros_descontos || 0;
      const outrosBeneficios = dados.outros_beneficios || registroAtual.outros_beneficios || 0;
      
      const valorLiquido = salarioBase - inss - ir - valeTransporte - valeRefeicao - outrosDescontos + outrosBeneficios;
      dados.valor_liquido = valorLiquido;
    }
    
    // Atualizar o registro
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .update(dados)
      .eq('id', id)
      .select('*')
      .single();
    
    if (error) {
      console.error('Erro ao atualizar registro de folha de pagamento:', error);
      throw error;
    }
    
    // Converter os dados para o formato esperado
    const folhaPagamento: FolhaPagamento = {
      id: data.id,
      funcionario_nome: data.funcionario_nome,
      salario_base: data.salario_base,
      data_pagamento: data.data_pagamento,
      mes_referencia: data.mes_referencia,
      ano_referencia: data.ano_referencia,
      inss: data.inss,
      fgts: data.fgts,
      ir: data.ir,
      vale_transporte: data.vale_transporte,
      vale_refeicao: data.vale_refeicao,
      outros_descontos: data.outros_descontos,
      outros_beneficios: data.outros_beneficios,
      valor_liquido: data.valor_liquido,
      observacoes: data.observacoes,
      status: data.status as StatusItem,
      created_at: data.created_at
    };
    
    toast.success(`Folha de pagamento de ${data.funcionario_nome} atualizada com sucesso!`);
    return folhaPagamento;
  } catch (error) {
    console.error('Erro ao atualizar registro de folha de pagamento:', error);
    toast.error('Erro ao atualizar registro de folha de pagamento');
    return null;
  }
};

// Função para excluir um registro de folha de pagamento
export const excluirRegistroFolhaPagamento = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Folha_Pagamento')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao excluir registro de folha de pagamento:', error);
      throw error;
    }
    
    toast.success('Registro de folha de pagamento excluído com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao excluir registro de folha de pagamento:', error);
    toast.error('Erro ao excluir registro de folha de pagamento');
    return false;
  }
};

// Função para gerar relatório de folha de pagamento por período
export const gerarRelatorioFolhaPagamento = async (mesReferencia: string, anoReferencia: string): Promise<FolhaPagamento[]> => {
  try {
    const { data, error } = await supabase
      .from('Folha_Pagamento')
      .select('*')
      .eq('mes_referencia', mesReferencia)
      .eq('ano_referencia', anoReferencia)
      .order('funcionario_nome', { ascending: true });
    
    if (error) {
      console.error('Erro ao gerar relatório de folha de pagamento:', error);
      throw error;
    }
    
    // Converter os dados para o formato esperado
    const folhaPagamentos: FolhaPagamento[] = (data || []).map(item => ({
      id: item.id,
      funcionario_nome: item.funcionario_nome,
      salario_base: item.salario_base,
      data_pagamento: item.data_pagamento,
      mes_referencia: item.mes_referencia,
      ano_referencia: item.ano_referencia,
      inss: item.inss,
      fgts: item.fgts,
      ir: item.ir,
      vale_transporte: item.vale_transporte,
      vale_refeicao: item.vale_refeicao,
      outros_descontos: item.outros_descontos,
      outros_beneficios: item.outros_beneficios,
      valor_liquido: item.valor_liquido,
      observacoes: item.observacoes,
      status: item.status as StatusItem,
      created_at: item.created_at
    }));
    
    return folhaPagamentos;
  } catch (error) {
    console.error('Erro ao gerar relatório de folha de pagamento:', error);
    toast.error('Erro ao gerar relatório de folha de pagamento');
    return [];
  }
};
