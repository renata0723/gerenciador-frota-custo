
import { supabase } from "@/integrations/supabase/client";
import { 
  BalancoPatrimonialData, 
  CentroCusto, 
  ContaContabil, 
  DREData, 
  LancamentoContabil, 
  LivroCaixaItem,
  StatusItem
} from "@/types/contabilidade";

// Funções para gerenciar lançamentos contábeis
export const getLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from("Lancamentos_Contabeis")
      .select("*");

    if (error) throw error;
    return data as LancamentoContabil[];
  } catch (error) {
    console.error("Erro ao buscar lançamentos contábeis:", error);
    return [];
  }
};

export const getLancamentoContabilById = async (id: number): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from("Lancamentos_Contabeis")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as LancamentoContabil;
  } catch (error) {
    console.error(`Erro ao buscar lançamento contábil com ID ${id}:`, error);
    return null;
  }
};

export const getPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from("Plano_Contas")
      .select("*");

    if (error) throw error;
    return data as ContaContabil[];
  } catch (error) {
    console.error("Erro ao buscar plano de contas:", error);
    return [];
  }
};

export const getContaContabilByCodigo = async (codigo: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from("Plano_Contas")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) throw error;
    return data as ContaContabil;
  } catch (error) {
    console.error(`Erro ao buscar conta contábil com código ${codigo}:`, error);
    return null;
  }
};

export const getContaContabilByCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from("Plano_Contas")
      .select("*")
      .eq("codigo_reduzido", codigoReduzido)
      .single();

    if (error) throw error;
    return data as ContaContabil;
  } catch (error) {
    console.error(`Erro ao buscar conta contábil com código reduzido ${codigoReduzido}:`, error);
    return null;
  }
};

export const getCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from("Centros_Custo")
      .select("*");

    if (error) throw error;
    return data as CentroCusto[];
  } catch (error) {
    console.error("Erro ao buscar centros de custo:", error);
    return [];
  }
};

export const adicionarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("Lancamentos_Contabeis")
      .insert([{
        data_lancamento: lancamento.data_lancamento,
        data_competencia: lancamento.data_competencia,
        conta_debito: lancamento.conta_debito,
        conta_credito: lancamento.conta_credito,
        valor: lancamento.valor,
        historico: lancamento.historico,
        documento_referencia: lancamento.documento_referencia,
        tipo_documento: lancamento.tipo_documento,
        centro_custo: lancamento.centro_custo,
        status: lancamento.status
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao adicionar lançamento contábil:", error);
    return false;
  }
};

export const criarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from("Lancamentos_Contabeis")
      .insert([{
        data_lancamento: lancamento.data_lancamento,
        data_competencia: lancamento.data_competencia,
        conta_debito: lancamento.conta_debito,
        conta_credito: lancamento.conta_credito,
        valor: lancamento.valor,
        historico: lancamento.historico,
        documento_referencia: lancamento.documento_referencia,
        tipo_documento: lancamento.tipo_documento,
        centro_custo: lancamento.centro_custo,
        status: lancamento.status,
        periodo_fiscal_fechado: lancamento.periodo_fiscal_fechado || false
      }])
      .select()
      .single();

    if (error) throw error;
    return data as LancamentoContabil;
  } catch (error) {
    console.error("Erro ao criar lançamento contábil:", error);
    return null;
  }
};

export const getDRE = async (inicio?: string, fim?: string): Promise<DREData[]> => {
  try {
    let query = supabase.from("DRE").select("*");
    
    if (inicio && fim) {
      query = query
        .gte("periodo_inicio", inicio)
        .lte("periodo_fim", fim);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as DREData[];
  } catch (error) {
    console.error("Erro ao buscar DRE:", error);
    return [];
  }
};

export const getDREs = async (): Promise<DREData[]> => {
  return getDRE();
};

export const criarDRE = async (dre: DREData): Promise<DREData | null> => {
  try {
    const { data, error } = await supabase
      .from("DRE")
      .insert([{
        periodo_inicio: dre.periodo_inicio,
        periodo_fim: dre.periodo_fim,
        receita_bruta: dre.receita_bruta,
        receita_liquida: dre.receita_liquida,
        custos_operacionais: dre.custos_operacionais,
        despesas_administrativas: dre.despesas_administrativas,
        resultado_periodo: dre.resultado_periodo,
        folha_pagamento: dre.folha_pagamento || 0,
        status: dre.status
      }])
      .select()
      .single();

    if (error) throw error;
    return data as DREData;
  } catch (error) {
    console.error("Erro ao criar DRE:", error);
    return null;
  }
};

export const getBalancoPatrimonial = async (): Promise<BalancoPatrimonialData[]> => {
  try {
    const { data, error } = await supabase
      .from("Balanco_Patrimonial")
      .select("*");

    if (error) {
      // Se a tabela não existir ainda, retorna array vazio
      if (error.code === "42P01") {
        return [];
      }
      throw error;
    }
    return data as BalancoPatrimonialData[];
  } catch (error) {
    console.error("Erro ao buscar Balanço Patrimonial:", error);
    return [];
  }
};

export const getBalancosPatrimoniais = async (): Promise<BalancoPatrimonialData[]> => {
  return getBalancoPatrimonial();
};

export const getBalancoPatrimonialById = async (id: number): Promise<BalancoPatrimonialData | null> => {
  try {
    const { data, error } = await supabase
      .from("Balanco_Patrimonial")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as BalancoPatrimonialData;
  } catch (error) {
    console.error(`Erro ao buscar Balanço Patrimonial com ID ${id}:`, error);
    return null;
  }
};

export const criarBalancoPatrimonial = async (balanco: BalancoPatrimonialData): Promise<BalancoPatrimonialData | null> => {
  try {
    const { data, error } = await supabase
      .from("Balanco_Patrimonial")
      .insert([{
        data_fechamento: balanco.data_fechamento,
        ativo_circulante: balanco.ativo_circulante || 0,
        ativo_nao_circulante: balanco.ativo_nao_circulante || 0,
        passivo_circulante: balanco.passivo_circulante || 0,
        passivo_nao_circulante: balanco.passivo_nao_circulante || 0,
        patrimonio_liquido: balanco.patrimonio_liquido || 0,
        status: balanco.status
      }])
      .select()
      .single();

    if (error) throw error;
    return data as BalancoPatrimonialData;
  } catch (error) {
    console.error("Erro ao criar Balanço Patrimonial:", error);
    return null;
  }
};

export const getLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from("Livro_Caixa")
      .select("*");

    if (error) {
      // Se a tabela não existir ainda, retorna array vazio
      if (error.code === "42P01") {
        return [];
      }
      throw error;
    }
    return data as LivroCaixaItem[];
  } catch (error) {
    console.error("Erro ao buscar Livro Caixa:", error);
    return [];
  }
};

export const getLivroCaixaById = async (id: number): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from("Livro_Caixa")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data as LivroCaixaItem;
  } catch (error) {
    console.error(`Erro ao buscar item do Livro Caixa com ID ${id}:`, error);
    return null;
  }
};

export const adicionarLivroCaixa = async (item: LivroCaixaItem): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("Livro_Caixa")
      .insert([{
        data_movimento: item.data_movimento,
        descricao: item.descricao,
        tipo: item.tipo,
        valor: item.valor,
        saldo: item.saldo,
        documento_referencia: item.documento_referencia,
        lancamento_contabil_id: item.lancamento_contabil_id,
        status: item.status
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao adicionar item ao Livro Caixa:", error);
    return false;
  }
};

export const criarLivroCaixaItem = async (item: LivroCaixaItem): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from("Livro_Caixa")
      .insert([{
        data_movimento: item.data_movimento,
        descricao: item.descricao,
        tipo: item.tipo,
        valor: item.valor,
        saldo: item.saldo,
        documento_referencia: item.documento_referencia,
        lancamento_contabil_id: item.lancamento_contabil_id,
        status: item.status
      }])
      .select()
      .single();

    if (error) throw error;
    return data as LivroCaixaItem;
  } catch (error) {
    console.error("Erro ao criar item do Livro Caixa:", error);
    return null;
  }
};

export const atualizarStatusNotaFiscal = async (numeroNota: number, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("Notas Fiscais")
      .update({ status_nota: status })
      .eq("numero_nota_fiscal", numeroNota);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar status da nota fiscal ${numeroNota}:`, error);
    return false;
  }
};

export const contabilizarDespesa = async (despesaId: number, contaContabil: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("Despesas Gerais")
      .update({ 
        contabilizado: true,
        conta_contabil: contaContabil 
      })
      .eq("id", despesaId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Erro ao contabilizar despesa ${despesaId}:`, error);
    return false;
  }
};

export const getCentroCustoByCodigo = async (codigo: string): Promise<CentroCusto | null> => {
  try {
    const { data, error } = await supabase
      .from("Centros_Custo")
      .select("*")
      .eq("codigo", codigo)
      .single();

    if (error) throw error;
    return data as CentroCusto;
  } catch (error) {
    console.error(`Erro ao buscar centro de custo com código ${codigo}:`, error);
    return null;
  }
};

export const limparSaldoAPagar = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("Saldo a pagar")
      .delete()
      .neq("id", 0); // Deleta todos os registros, essa condição sempre é verdadeira

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao limpar tabela de Saldo a Pagar:", error);
    return false;
  }
};

export const adicionarLancamentoManual = async (lancamento: LancamentoContabil): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("Lancamentos_Contabeis")
      .insert([{
        data_lancamento: lancamento.data_lancamento,
        data_competencia: lancamento.data_competencia,
        conta_debito: lancamento.conta_debito,
        conta_credito: lancamento.conta_credito,
        valor: lancamento.valor,
        historico: lancamento.historico,
        documento_referencia: lancamento.documento_referencia,
        tipo_documento: lancamento.tipo_documento,
        centro_custo: lancamento.centro_custo,
        status: lancamento.status,
        periodo_fiscal_fechado: lancamento.periodo_fiscal_fechado || false
      }]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Erro ao adicionar lançamento contábil manual:", error);
    return false;
  }
};

export const getContasReceita = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from("Plano_Contas")
      .select("*")
      .eq("tipo", "receita");

    if (error) throw error;
    return data as ContaContabil[];
  } catch (error) {
    console.error("Erro ao buscar contas de receita:", error);
    return [];
  }
};

export const getContasDespesa = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from("Plano_Contas")
      .select("*")
      .eq("tipo", "despesa");

    if (error) throw error;
    return data as ContaContabil[];
  } catch (error) {
    console.error("Erro ao buscar contas de despesa:", error);
    return [];
  }
};

export const getContasContabeisPorTipo = async (tipo: string): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from("Plano_Contas")
      .select("*")
      .eq("tipo", tipo);

    if (error) throw error;
    return data as ContaContabil[];
  } catch (error) {
    console.error(`Erro ao buscar contas do tipo ${tipo}:`, error);
    return [];
  }
};

export const buscarPlanoContas = async (): Promise<ContaContabil[]> => {
  return getPlanoContas();
};
