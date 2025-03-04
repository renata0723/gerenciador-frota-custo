
// Função para adicionar balancete
export const adicionarBalancete = async (balancete: Partial<Balancete>): Promise<Balancete | null> => {
  try {
    // Garantir que o balancete tenha todos os campos obrigatórios
    if (!balancete.conta_codigo || !balancete.conta_nome || !balancete.nivel || 
        !balancete.periodo_inicio || !balancete.periodo_fim) {
      console.error('Erro ao adicionar balancete: campos obrigatórios ausentes');
      return null;
    }
    
    const { data, error } = await supabase
      .from('balancete')
      .insert({
        conta_codigo: balancete.conta_codigo,
        conta_nome: balancete.conta_nome,
        periodo_inicio: balancete.periodo_inicio,
        periodo_fim: balancete.periodo_fim,
        saldo_anterior: balancete.saldo_anterior || 0,
        debitos: balancete.debitos || 0,
        creditos: balancete.creditos || 0,
        saldo_atual: balancete.saldo_atual || 0,
        nivel: balancete.nivel,
        natureza: balancete.natureza || 'devedora',
        status: balancete.status || 'ativo'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao adicionar balancete:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao adicionar balancete:', error);
    return null;
  }
};

// Substitui a implementação anterior com problema
export const criarBalancete = adicionarBalancete;
