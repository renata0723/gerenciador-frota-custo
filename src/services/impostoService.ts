
import { supabase } from "@/integrations/supabase/client";
import { ApuracaoImpostos, CreditoTributario, OperacaoTributavel } from "@/types/contabilidade";
import { ALIQUOTAS_IMPOSTOS, LIMITE_MENSAL_IRPJ_ADICIONAL, PERCENTUAIS_PRESUNCAO } from "@/utils/constants";

export const buscarCTEsPorPeriodo = async (dataInicio: string, dataFim: string) => {
  try {
    const { data, error } = await supabase
      .from('Contratos')
      .select(`
        id,
        cte_numero,
        cte_data_emissao,
        valor_frete,
        status,
        documentos:Documentos(*)
      `)
      .gte('cte_data_emissao', dataInicio)
      .lte('cte_data_emissao', dataFim)
      .not('cte_numero', 'is', null);

    if (error) {
      console.error('Erro ao buscar CTEs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar CTEs:', error);
    return [];
  }
};

export const calcularTributacaoLucroReal = (
  receita: number,
  creditos: number = 0,
  mesAnterior: ApuracaoImpostos | null = null
) => {
  // Calcular PIS e COFINS
  const baseCalculoPisCofins = Math.max(0, receita - creditos);
  const valorPis = baseCalculoPisCofins * ALIQUOTAS_IMPOSTOS.PIS;
  const valorCofins = baseCalculoPisCofins * ALIQUOTAS_IMPOSTOS.COFINS;

  // Calcular base de cálculo do IRPJ (presunção de 8% para transportadoras)
  const baseCalculoIrpj = receita * PERCENTUAIS_PRESUNCAO.TRANSPORTE;

  // Compensação de prejuízo fiscal (até 30% do lucro real)
  let compensacaoPrejuizo = 0;
  if (mesAnterior?.prejuizo_acumulado && mesAnterior.prejuizo_acumulado > 0) {
    compensacaoPrejuizo = Math.min(
      baseCalculoIrpj * 0.3, // Máximo de 30% do lucro real
      mesAnterior.prejuizo_acumulado
    );
  }

  // Base de cálculo após compensação
  const baseCalculoIrpjAposCompensacao = baseCalculoIrpj - compensacaoPrejuizo;

  // Calcular IRPJ
  let valorIrpj = baseCalculoIrpjAposCompensacao * ALIQUOTAS_IMPOSTOS.IRPJ_BASICO;
  
  // Adicional de 10% para valores superiores a R$20.000/mês
  if (baseCalculoIrpjAposCompensacao > LIMITE_MENSAL_IRPJ_ADICIONAL) {
    valorIrpj += (baseCalculoIrpjAposCompensacao - LIMITE_MENSAL_IRPJ_ADICIONAL) * ALIQUOTAS_IMPOSTOS.IRPJ_ADICIONAL;
  }

  // Calcular base de cálculo da CSLL (presunção de 12% para transportadoras)
  const baseCalculoCsll = receita * PERCENTUAIS_PRESUNCAO.TRANSPORTE_CSLL;
  const valorCsll = baseCalculoCsll * ALIQUOTAS_IMPOSTOS.CSLL;

  // Calcular a alíquota efetiva
  const totalImpostos = valorPis + valorCofins + valorIrpj + valorCsll;
  const aliquotaEfetiva = receita > 0 ? totalImpostos / receita : 0;

  return {
    baseCalculoPisCofins,
    valorPis,
    valorCofins,
    baseCalculoIrpj,
    baseCalculoCsll,
    valorIrpj,
    valorCsll,
    totalImpostos,
    aliquotaEfetiva,
    compensacaoPrejuizo
  };
};

export const salvarApuracaoImpostos = async (apuracao: Partial<ApuracaoImpostos>): Promise<ApuracaoImpostos | null> => {
  try {
    const { data, error } = await supabase
      .from('Apuracao_Impostos')
      .insert(apuracao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar apuração de impostos:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao salvar apuração de impostos:', error);
    return null;
  }
};

export const buscarApuracoesImpostos = async (ano?: number): Promise<ApuracaoImpostos[]> => {
  try {
    let query = supabase.from('Apuracao_Impostos').select('*').order('periodo_fim', { ascending: false });

    if (ano) {
      const inicioAno = `${ano}-01-01`;
      const fimAno = `${ano}-12-31`;
      query = query.gte('periodo_inicio', inicioAno).lte('periodo_fim', fimAno);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar apurações de impostos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar apurações de impostos:', error);
    return [];
  }
};

export const salvarCreditoTributario = async (credito: Partial<CreditoTributario>): Promise<CreditoTributario | null> => {
  try {
    const { data, error } = await supabase
      .from('Creditos_Tributarios')
      .insert(credito)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar crédito tributário:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao salvar crédito tributário:', error);
    return null;
  }
};

export const buscarCreditosTributarios = async (
  tipo?: string,
  status?: string,
  periodoApuracao?: string
): Promise<CreditoTributario[]> => {
  try {
    let query = supabase.from('Creditos_Tributarios').select('*');

    if (tipo) {
      query = query.eq('tipo_credito', tipo);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (periodoApuracao) {
      query = query.eq('periodo_apuracao', periodoApuracao);
    }

    const { data, error } = await query.order('data_aquisicao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar créditos tributários:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar créditos tributários:', error);
    return [];
  }
};

export const salvarOperacaoTributavel = async (operacao: Partial<OperacaoTributavel>): Promise<OperacaoTributavel | null> => {
  try {
    const { data, error } = await supabase
      .from('Operacoes_Tributaveis')
      .insert(operacao)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar operação tributável:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao salvar operação tributável:', error);
    return null;
  }
};

export const buscarOperacoesTributaveis = async (
  tipoDocumento?: string,
  dataInicio?: string,
  dataFim?: string
): Promise<OperacaoTributavel[]> => {
  try {
    let query = supabase.from('Operacoes_Tributaveis').select('*');

    if (tipoDocumento) {
      query = query.eq('tipo_documento', tipoDocumento);
    }

    if (dataInicio) {
      query = query.gte('data_emissao', dataInicio);
    }

    if (dataFim) {
      query = query.lte('data_emissao', dataFim);
    }

    const { data, error } = await query.order('data_emissao', { ascending: false });

    if (error) {
      console.error('Erro ao buscar operações tributáveis:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar operações tributáveis:', error);
    return [];
  }
};
