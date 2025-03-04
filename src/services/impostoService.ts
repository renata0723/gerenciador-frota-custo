
import { supabase } from "@/integrations/supabase/client";
import { ApuracaoImpostos, CreditoTributario, OperacaoTributavel } from "@/types/impostos";
import { ALIQUOTAS_IMPOSTO, ALIQUOTAS_PRESUNCAO, LIMITE_MENSAL_IRPJ_ADICIONAL } from "@/utils/constants";

/**
 * Calcula a base de presunção para o IRPJ e CSLL com base na receita bruta 
 * @param receitaBruta Valor da receita bruta do período
 * @returns Objeto com bases de cálculo
 */
export const calcularBasePresuncao = (receitaBruta: number) => {
  if (!receitaBruta || receitaBruta <= 0) {
    return {
      baseIRPJ: 0,
      baseCSLL: 0
    };
  }
  
  const baseIRPJ = receitaBruta * (ALIQUOTAS_PRESUNCAO.TRANSPORTE_CARGAS / 100);
  const baseCSLL = receitaBruta * (ALIQUOTAS_PRESUNCAO.TRANSPORTE_CARGAS_CSLL / 100);
  
  return {
    baseIRPJ,
    baseCSLL
  };
};

/**
 * Calcula o valor do imposto de renda com base na base de cálculo
 * @param baseCalculo Valor da base de cálculo 
 * @param meses Número de meses do período
 * @returns Valor do imposto calculado
 */
export const calcularIRPJ = (baseCalculo: number, meses: number = 1) => {
  if (!baseCalculo || baseCalculo <= 0) return 0;
  
  const limiteAdicional = LIMITE_MENSAL_IRPJ_ADICIONAL * meses;
  const valorIRPJBasico = baseCalculo * (ALIQUOTAS_IMPOSTO.IRPJ / 100);
  
  let adicional = 0;
  if (baseCalculo > limiteAdicional) {
    adicional = (baseCalculo - limiteAdicional) * (ALIQUOTAS_IMPOSTO.IRPJ_ADICIONAL / 100);
  }
  
  return valorIRPJBasico + adicional;
};

/**
 * Calcula o valor da CSLL com base na base de cálculo
 * @param baseCalculo Valor da base de cálculo 
 * @returns Valor do imposto calculado
 */
export const calcularCSLL = (baseCalculo: number) => {
  if (!baseCalculo || baseCalculo <= 0) return 0;
  
  return baseCalculo * (ALIQUOTAS_IMPOSTO.CSLL / 100);
};

/**
 * Calcula os valores de PIS e COFINS com base na receita bruta
 * @param receitaBruta Valor da receita bruta
 * @returns Objeto com valores calculados
 */
export const calcularPISCOFINS = (receitaBruta: number) => {
  if (!receitaBruta || receitaBruta <= 0) {
    return {
      valorPIS: 0,
      valorCOFINS: 0
    };
  }
  
  const valorPIS = receitaBruta * (ALIQUOTAS_IMPOSTO.PIS / 100);
  const valorCOFINS = receitaBruta * (ALIQUOTAS_IMPOSTO.COFINS / 100);
  
  return {
    valorPIS,
    valorCOFINS
  };
};

/**
 * Busca apurações de impostos no período especificado
 */
export const buscarApuracaoImpostos = async (periodoInicio: string, periodoFim: string): Promise<ApuracaoImpostos | null> => {
  try {
    // Em produção, usar a tabela correta
    const { data, error } = await supabase
      .from('Contratos') // Substitua pela tabela correta 'Apuracao_Impostos' quando existir
      .select('*')
      .gte('data_saida', periodoInicio)
      .lte('data_saida', periodoFim)
      .single();
    
    if (error) {
      console.error('Erro ao buscar apuração de impostos:', error);
      return null;
    }
    
    // Adaptar formato dos dados quando tiver a tabela correta
    const apuracao: ApuracaoImpostos = {
      id: data.id,
      periodo_inicio: periodoInicio,
      periodo_fim: periodoFim,
      receita_bruta: data.valor_frete || 0,
      base_calculo_pis_cofins: data.valor_frete || 0,
      valor_pis: 0,
      valor_cofins: 0,
      base_calculo_irpj: 0,
      valor_irpj: 0,
      valor_irpj_adicional: 0,
      base_calculo_csll: 0,
      valor_csll: 0,
      status: 'pendente',
      data_apuracao: new Date().toISOString()
    };
    
    return apuracao;
  } catch (error) {
    console.error('Erro ao processar apuração de impostos:', error);
    return null;
  }
};

/**
 * Salva uma nova apuração de impostos
 */
export const salvarApuracaoImpostos = async (apuracao: ApuracaoImpostos): Promise<ApuracaoImpostos | null> => {
  try {
    // Em produção, usar a tabela correta
    const { data, error } = await supabase
      .from('Contratos') // Substitua pela tabela correta 'Apuracao_Impostos' quando existir
      .insert([apuracao])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao salvar apuração de impostos:', error);
      return null;
    }
    
    return data as unknown as ApuracaoImpostos;
  } catch (error) {
    console.error('Erro ao processar salvamento de apuração:', error);
    return null;
  }
};

/**
 * Lista as apurações de impostos
 */
export const listarApuracoesImpostos = async (): Promise<ApuracaoImpostos[]> => {
  try {
    // Em produção, usar a tabela correta
    const { data, error } = await supabase
      .from('Contratos') // Substitua pela tabela correta 'Apuracao_Impostos' quando existir
      .select('*')
      .order('data_saida', { ascending: false });
    
    if (error) {
      console.error('Erro ao listar apurações de impostos:', error);
      return [];
    }
    
    // Adaptar formato dos dados quando tiver a tabela correta
    return (data || []).map(item => ({
      id: item.id,
      periodo_inicio: item.data_saida,
      periodo_fim: item.data_saida,
      receita_bruta: item.valor_frete || 0,
      base_calculo_pis_cofins: item.valor_frete || 0,
      valor_pis: 0,
      valor_cofins: 0,
      base_calculo_irpj: 0,
      valor_irpj: 0,
      valor_irpj_adicional: 0,
      base_calculo_csll: 0,
      valor_csll: 0,
      status: 'pendente',
      data_apuracao: item.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Erro ao processar listagem de apurações:', error);
    return [];
  }
};

/**
 * Busca créditos tributários
 */
export const buscarCreditosTributarios = async (): Promise<CreditoTributario[]> => {
  try {
    // Em produção, usar a tabela correta
    const { data, error } = await supabase
      .from('Contratos') // Substitua pela tabela correta 'Creditos_Tributarios' quando existir
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Erro ao buscar créditos tributários:', error);
      return [];
    }
    
    // Adaptar formato dos dados quando tiver a tabela correta
    const creditos: CreditoTributario[] = [];
    
    // Criar alguns créditos tributários de exemplo
    if (data && data.length > 0) {
      // Simulação para desenvolvimento
      creditos.push({
        id: 1,
        tipo_credito: 'PIS',
        descricao: 'Crédito de PIS sobre insumos',
        valor: 1200.50,
        data_aquisicao: '2023-01-15',
        data_vencimento: '2023-12-31',
        utilizado: false,
        status: 'Ativo'
      });
      
      creditos.push({
        id: 2,
        tipo_credito: 'COFINS',
        descricao: 'Crédito de COFINS sobre combustíveis',
        valor: 3560.75,
        data_aquisicao: '2023-02-10',
        data_vencimento: '2023-12-31',
        utilizado: false,
        status: 'Ativo'
      });
    }
    
    return creditos;
  } catch (error) {
    console.error('Erro ao processar créditos tributários:', error);
    return [];
  }
};

/**
 * Salva um novo crédito tributário
 */
export const salvarCreditoTributario = async (credito: CreditoTributario): Promise<CreditoTributario | null> => {
  try {
    // Em produção, usar a tabela correta
    const { data, error } = await supabase
      .from('Contratos') // Substitua pela tabela correta 'Creditos_Tributarios' quando existir
      .insert([credito])
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao salvar crédito tributário:', error);
      return null;
    }
    
    return data as unknown as CreditoTributario;
  } catch (error) {
    console.error('Erro ao processar salvamento de crédito:', error);
    return null;
  }
};

/**
 * Busca operações tributáveis
 */
export const buscarOperacoesTributaveis = async (): Promise<OperacaoTributavel[]> => {
  try {
    // Em produção, usar a tabela correta
    const { data, error } = await supabase
      .from('Contratos') // Substitua pela tabela correta 'Operacoes_Tributaveis' quando existir
      .select('*')
      .limit(10);
    
    if (error) {
      console.error('Erro ao buscar operações tributáveis:', error);
      return [];
    }
    
    // Adaptar formato dos dados quando tiver a tabela correta - implementação de exemplo
    const operacoes: OperacaoTributavel[] = (data || []).map((contrato, index) => ({
      id: index + 1,
      tipo_documento: 'Nota Fiscal',
      numero_documento: `NF-${1000 + index}`,
      data_emissao: contrato.data_saida || new Date().toISOString(),
      valor_operacao: contrato.valor_frete || 1000,
      base_calculo: contrato.valor_frete || 1000,
      aliquota: 17,
      valor_imposto: (contrato.valor_frete || 1000) * 0.17,
      cliente: contrato.cliente_destino || 'Cliente Padrão',
      fornecedor: 'Fornecedor Exemplo',
      status: 'Ativo'
    }));
    
    return operacoes;
  } catch (error) {
    console.error('Erro ao processar operações tributáveis:', error);
    return [];
  }
};
