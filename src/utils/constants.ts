
export const CONTAS_CONTABEIS = {
  // Contas de Ativo
  CAIXA: '11101',
  BANCOS: '11102',
  CLIENTES: '11201',
  ADIANTAMENTO_FORNECEDORES: '11501',
  
  // Contas de Passivo
  FORNECEDORES: '21101',
  IMPOSTOS_A_RECOLHER: '21201',
  
  // Contas de Receita
  RECEITA_FRETE: '31101',
  
  // Contas de Despesa
  DESPESA_COMBUSTIVEL: '41101',
  DESPESA_MANUTENCAO: '41201',
  DESPESA_SALARIOS: '41301',
  DESPESA_ADMINISTRATIVA: '41401',
  COMBUSTIVEL: '41101', // Sinônimo para DESPESA_COMBUSTIVEL
  DESPESAS_VIAGEM: '41501'
};

export const formataMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

export const STATUS_SALDO_PAGAR = {
  PENDENTE: { value: 'pendente', label: 'Pendente' },
  PARCIAL: { value: 'parcial', label: 'Parcial' },
  PAGO: { value: 'pago', label: 'Pago' },
  CANCELADO: { value: 'cancelado', label: 'Cancelado' },
  LIBERADO: { value: 'liberado', label: 'Liberado' }
};

export const estadosBrasileiros = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' }
];

export const ALIQUOTAS_PRESUNCAO = {
  TRANSPORTE_CARGAS: 8.0, // 8.0% para transportes de cargas
  TRANSPORTE_CARGAS_CSLL: 12.0 // 12.0% para CSLL em transportes
};

export const ALIQUOTAS_IMPOSTO = {
  PIS: 0.65,
  COFINS: 3.0,
  IRPJ: 15.0,
  IRPJ_ADICIONAL: 10.0,
  CSLL: 9.0
};

// Constantes para códigos reduzidos
export const CODIGOS_REDUZIDOS = {
  // Ativos
  CAIXA: '1001',
  BANCOS: '1002', 
  APLICACOES_FINANCEIRAS: '1003',
  CLIENTES: '1101',
  ADIANTAMENTOS: '1201',
  IMPOSTOS_A_RECUPERAR: '1301',
  ESTOQUES: '1401',
  VEICULOS: '1501',
  EQUIPAMENTOS: '1502',
  MOVEIS_UTENSILIOS: '1503',
  DEPRECIACAO_ACUMULADA: '1599',
  
  // Passivos
  FORNECEDORES: '2001',
  SALARIOS_A_PAGAR: '2101',
  IMPOSTOS_A_RECOLHER: '2201',
  EMPRESTIMOS: '2301',
  CAPITAL_SOCIAL: '2901',
  LUCROS_ACUMULADOS: '2902',
  
  // Receitas
  RECEITA_FRETES: '3001',
  RECEITA_SERVICOS: '3002',
  RECEITA_FINANCEIRA: '3101',
  
  // Despesas
  COMBUSTIVEL: '4001',
  MANUTENCAO: '4002',
  PNEUS: '4003',
  SALARIOS: '4101',
  ENCARGOS_SOCIAIS: '4102',
  ALUGUEIS: '4201',
  SERVICOS_TERCEIROS: '4301',
  DEPRECIACAO: '4401',
  DESPESAS_FINANCEIRAS: '4501'
};
