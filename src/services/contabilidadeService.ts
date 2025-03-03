
import { supabase } from "@/integrations/supabase/client";
import { 
  LancamentoContabil, 
  ContaContabil, 
  CentroCusto, 
  DREData, 
  BalancoPatrimonialData, 
  LivroCaixaItem 
} from "@/types/contabilidade";

// Função para buscar lançamentos contábeis
export const buscarLancamentosContabeis = async (): Promise<LancamentoContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .order('data_lancamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar lançamentos contábeis:', error);
      return [];
    }

    return data as LancamentoContabil[];
  } catch (error) {
    console.error('Erro ao processar lançamentos contábeis:', error);
    return [];
  }
};

// Função para buscar um lançamento contábil específico
export const buscarLancamentoContabilPorId = async (id: number): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar lançamento contábil:', error);
      return null;
    }

    return data as LancamentoContabil;
  } catch (error) {
    console.error('Erro ao processar lançamento contábil:', error);
    return null;
  }
};

// Função para buscar contas contábeis (plano de contas)
export const buscarPlanoContas = async (): Promise<ContaContabil[]> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .order('codigo', { ascending: true });

    if (error) {
      console.error('Erro ao buscar plano de contas:', error);
      return [];
    }

    return data as ContaContabil[];
  } catch (error) {
    console.error('Erro ao processar plano de contas:', error);
    return [];
  }
};

// Função para buscar uma conta contábil específica
export const buscarContaContabilPorCodigo = async (codigo: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo', codigo)
      .single();

    if (error) {
      console.error('Erro ao buscar conta contábil:', error);
      return null;
    }

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao processar conta contábil:', error);
    return null;
  }
};

// Função para buscar centros de custo
export const buscarCentrosCusto = async (): Promise<CentroCusto[]> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .select('*')
      .order('codigo', { ascending: true });

    if (error) {
      console.error('Erro ao buscar centros de custo:', error);
      return [];
    }

    return data as CentroCusto[];
  } catch (error) {
    console.error('Erro ao processar centros de custo:', error);
    return [];
  }
};

// Função para buscar DREs
export const buscarDREs = async (): Promise<DREData[]> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .order('periodo_fim', { ascending: false });

    if (error) {
      console.error('Erro ao buscar DREs:', error);
      return [];
    }

    // Converter string para StatusItem
    const dres = data.map(dre => ({
      ...dre,
      status: dre.status as any
    }));

    return dres as DREData[];
  } catch (error) {
    console.error('Erro ao processar DREs:', error);
    return [];
  }
};

// Função para buscar uma DRE específica
export const buscarDREPorId = async (id: number): Promise<DREData | null> => {
  try {
    const { data, error } = await supabase
      .from('DRE')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar DRE:', error);
      return null;
    }

    return { ...data, status: data.status as any } as DREData;
  } catch (error) {
    console.error('Erro ao processar DRE:', error);
    return null;
  }
};

// Função para buscar balanços patrimoniais
export const buscarBalancosPatrimoniais = async (): Promise<BalancoPatrimonialData[]> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .order('data_fechamento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar balanços patrimoniais:', error);
      return [];
    }

    return data as BalancoPatrimonialData[];
  } catch (error) {
    console.error('Erro ao processar balanços patrimoniais:', error);
    return [];
  }
};

// Função para buscar um balanço patrimonial específico
export const buscarBalancoPatrimonialPorId = async (id: number): Promise<BalancoPatrimonialData | null> => {
  try {
    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar balanço patrimonial:', error);
      return null;
    }

    return data as BalancoPatrimonialData;
  } catch (error) {
    console.error('Erro ao processar balanço patrimonial:', error);
    return null;
  }
};

// Função para buscar lançamentos do livro caixa
export const buscarLivroCaixa = async (): Promise<LivroCaixaItem[]> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .order('data_movimento', { ascending: false });

    if (error) {
      console.error('Erro ao buscar livro caixa:', error);
      return [];
    }

    return data as LivroCaixaItem[];
  } catch (error) {
    console.error('Erro ao processar livro caixa:', error);
    return [];
  }
};

// Função para buscar um lançamento do livro caixa específico
export const buscarLivroCaixaPorId = async (id: number): Promise<LivroCaixaItem | null> => {
  try {
    const { data, error } = await supabase
      .from('Livro_Caixa')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao buscar lançamento do livro caixa:', error);
      return null;
    }

    return data as LivroCaixaItem;
  } catch (error) {
    console.error('Erro ao processar lançamento do livro caixa:', error);
    return null;
  }
};

// Função para criar um lançamento contábil
export const criarLancamentoContabil = async (lancamento: LancamentoContabil): Promise<LancamentoContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Lancamentos_Contabeis')
      .insert(lancamento)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lançamento contábil:', error);
      return null;
    }

    return data as LancamentoContabil;
  } catch (error) {
    console.error('Erro ao processar criação de lançamento contábil:', error);
    return null;
  }
};

// Função para fechar um período na DRE
export const fecharPeriodoDRE = async (dreId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('DRE')
      .update({ 
        periodo_fechado: true,
        status: 'fechado'
      })
      .eq('id', dreId);

    if (error) {
      console.error('Erro ao fechar período na DRE:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao processar fechamento de período na DRE:', error);
    return false;
  }
};

// Função para criar uma conta no plano de contas
export const criarContaContabil = async (conta: ContaContabil): Promise<ContaContabil | null> => {
  try {
    // Converter para o formato correto antes de enviar
    const contaParaEnviar = {
      codigo: conta.codigo,
      codigo_reduzido: conta.codigo_reduzido,
      nome: conta.nome,
      tipo: conta.tipo,
      natureza: conta.natureza,
      conta_pai: conta.conta_pai || null,
      nivel: conta.nivel,
      status: conta.status
    };

    const { data, error } = await supabase
      .from('Plano_Contas')
      .insert(contaParaEnviar)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar conta contábil:', error);
      return null;
    }

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao processar criação de conta contábil:', error);
    return null;
  }
};

// Função para buscar uma conta contábil pelo código reduzido
export const buscarContaPorCodigoReduzido = async (codigoReduzido: string): Promise<ContaContabil | null> => {
  try {
    const { data, error } = await supabase
      .from('Plano_Contas')
      .select('*')
      .eq('codigo_reduzido', codigoReduzido)
      .single();

    if (error) {
      console.error('Erro ao buscar conta por código reduzido:', error);
      return null;
    }

    return data as ContaContabil;
  } catch (error) {
    console.error('Erro ao processar busca de conta por código reduzido:', error);
    return null;
  }
};

// Função para criar uma DRE
export const criarDRE = async (dre: DREData): Promise<DREData | null> => {
  try {
    // Converter datas para string se forem objetos Date
    const dreParaEnviar = {
      ...dre,
      periodo_inicio: typeof dre.periodo_inicio === 'object' ? 
        (dre.periodo_inicio as Date).toISOString().split('T')[0] : dre.periodo_inicio,
      periodo_fim: typeof dre.periodo_fim === 'object' ? 
        (dre.periodo_fim as Date).toISOString().split('T')[0] : dre.periodo_fim
    };

    const { data, error } = await supabase
      .from('DRE')
      .insert(dreParaEnviar)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar DRE:', error);
      return null;
    }

    return data as DREData;
  } catch (error) {
    console.error('Erro ao processar criação de DRE:', error);
    return null;
  }
};

// Função para criar um balanço patrimonial
export const criarBalancoPatrimonial = async (balanco: BalancoPatrimonialData): Promise<BalancoPatrimonialData | null> => {
  try {
    // Converter datas para string se forem objetos Date
    const balancoParaEnviar = {
      ...balanco,
      data_fechamento: typeof balanco.data_fechamento === 'object' ? 
        (balanco.data_fechamento as Date).toISOString().split('T')[0] : balanco.data_fechamento
    };

    const { data, error } = await supabase
      .from('Balanco_Patrimonial')
      .insert(balancoParaEnviar)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar balanço patrimonial:', error);
      return null;
    }

    return data as BalancoPatrimonialData;
  } catch (error) {
    console.error('Erro ao processar criação de balanço patrimonial:', error);
    return null;
  }
};

// Função para criar um lançamento no livro caixa
export const criarLivroCaixaItem = async (item: LivroCaixaItem): Promise<LivroCaixaItem | null> => {
  try {
    // Converter datas para string se forem objetos Date
    const itemParaEnviar = {
      ...item,
      data_movimento: typeof item.data_movimento === 'object' ? 
        (item.data_movimento as Date).toISOString().split('T')[0] : item.data_movimento
    };

    const { data, error } = await supabase
      .from('Livro_Caixa')
      .insert(itemParaEnviar)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar lançamento no livro caixa:', error);
      return null;
    }

    return data as LivroCaixaItem;
  } catch (error) {
    console.error('Erro ao processar criação de lançamento no livro caixa:', error);
    return null;
  }
};

// Função para atualizar uma nota fiscal com status
export const atualizarStatusNota = async (notaId: number, statusNota: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Notas Fiscais')
      .update({ status_nota: statusNota })
      .eq('id', notaId);

    if (error) {
      console.error('Erro ao atualizar status da nota fiscal:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao processar atualização de status da nota fiscal:', error);
    return false;
  }
};

// Função para criar um centro de custo
export const criarCentroCusto = async (centroCusto: CentroCusto): Promise<CentroCusto | null> => {
  try {
    const { data, error } = await supabase
      .from('Centros_Custo')
      .insert(centroCusto)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar centro de custo:', error);
      return null;
    }

    return data as CentroCusto;
  } catch (error) {
    console.error('Erro ao processar criação de centro de custo:', error);
    return null;
  }
};

// Função para contabilizar despesa
export const contabilizarDespesa = async (
  despesaId: number, 
  contaContabil: string, 
  contraPartida: string = '1.1.1.1'
): Promise<boolean> => {
  try {
    // 1. Buscar dados da despesa
    const { data: despesa, error: despesaError } = await supabase
      .from('Despesas Gerais')
      .select('*')
      .eq('id', despesaId)
      .single();
    
    if (despesaError || !despesa) {
      console.error('Erro ao buscar despesa:', despesaError);
      return false;
    }
    
    // 2. Criar o lançamento contábil
    const lancamento: LancamentoContabil = {
      data_lancamento: new Date().toISOString().split('T')[0],
      data_competencia: despesa.data_despesa,
      conta_debito: contaContabil, // Conta de despesa
      conta_credito: contraPartida, // Conta de caixa ou banco
      valor: despesa.valor_despesa,
      historico: `Despesa: ${despesa.descricao_detalhada}`,
      documento_referencia: `DESP-${despesaId}`,
      tipo_documento: 'Despesa',
      status: 'ativo'
    };
    
    const { error: lancamentoError } = await supabase
      .from('Lancamentos_Contabeis')
      .insert(lancamento);
    
    if (lancamentoError) {
      console.error('Erro ao criar lançamento contábil:', lancamentoError);
      return false;
    }
    
    // 3. Atualizar a despesa marcando como contabilizada
    const { error: atualizacaoError } = await supabase
      .from('Despesas Gerais')
      .update({ 
        contabilizado: true,
        conta_contabil: contaContabil
      })
      .eq('id', despesaId);
    
    if (atualizacaoError) {
      console.error('Erro ao atualizar despesa:', atualizacaoError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao contabilizar despesa:', error);
    return false;
  }
};

// Aliases para compatibilidade com código existente
export const getPlanoContas = buscarPlanoContas;
export const getCentrosCusto = buscarCentrosCusto;
export const getLancamentosContabeis = buscarLancamentosContabeis;
export const getDREs = buscarDREs;
export const getBalancosPatrimoniais = buscarBalancosPatrimoniais;
export const getLivroCaixa = buscarLivroCaixa;
export const criarConta = criarContaContabil;
