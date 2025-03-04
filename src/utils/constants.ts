
export const formataMoeda = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return "R$ 0,00";
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(valor);
};

export const bancos = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú Unibanco' },
  { codigo: '260', nome: 'Nubank' },
  { codigo: '290', nome: 'PagBank' },
  { codigo: '380', nome: 'PicPay' },
  { codigo: '077', nome: 'Inter' },
  { codigo: '212', nome: 'Banco Original' },
  { codigo: '336', nome: 'C6 Bank' },
  { codigo: '655', nome: 'Neon' },
  { codigo: '323', nome: 'Mercado Pago' },
  { codigo: '748', nome: 'Sicredi' },
  { codigo: '756', nome: 'Sicoob' },
  { codigo: '041', nome: 'Banrisul' },
  { codigo: '422', nome: 'Safra' },
  { codigo: '070', nome: 'BRB - Banco de Brasília' },
  { codigo: '085', nome: 'Cecred/Ailos' },
];

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

// Formatações e funções úteis
export const formatCurrency = formataMoeda;

export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

export const ANO_ATUAL = new Date().getFullYear();

export const statusSaldoPagar = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'parcial', label: 'Parcialmente Pago' },
  { value: 'pago', label: 'Pago' },
  { value: 'cancelado', label: 'Cancelado' }
];

// Constantes para referências dos status
statusSaldoPagar.PENDENTE = statusSaldoPagar[0].value;
statusSaldoPagar.PARCIAL = statusSaldoPagar[1].value;
statusSaldoPagar.PAGO = statusSaldoPagar[2].value;
statusSaldoPagar.CANCELADO = statusSaldoPagar[3].value;
statusSaldoPagar.LIBERADO = 'liberado';

// Constantes para status de documentos e operações
export const STATUS_NOTAS = {
  AGUARDANDO_ENTREGA: 'aguardando_entrega',
  EM_TRANSITO: 'em_transito',
  CONCLUIDA: 'concluida',
  CANCELADA: 'cancelada'
};

// Constantes para impostos do lucro real
export const ALIQUOTAS_IMPOSTOS = {
  PIS: 0.0165, // 1,65%
  COFINS: 0.076, // 7,6%
  IRPJ_BASICO: 0.15, // 15%
  IRPJ_ADICIONAL: 0.10, // 10% adicional para lucro acima de R$ 20.000/mês
  CSLL: 0.09, // 9%
};

// Limite mensal para incidência da alíquota adicional do IRPJ
export const LIMITE_MENSAL_IRPJ_ADICIONAL = 20000;

// Percentuais de presunção do lucro para transportadoras
export const PERCENTUAIS_PRESUNCAO = {
  TRANSPORTE: 0.08, // 8% para IRPJ
  TRANSPORTE_CSLL: 0.12, // 12% para CSLL
};

// Constantes para contas contábeis padrão
export const CONTAS_CONTABEIS = {
  RECEITA_FRETE: '3.1.1.01', // Receita de fretes
  CAIXA: '1.1.1.01', // Caixa
  BANCOS: '1.1.1.02', // Bancos
  CLIENTES: '1.1.2.01', // Clientes
  ADIANTAMENTO_FORNECEDORES: '1.1.5.01', // Adiantamento a fornecedores
  FORNECEDORES: '2.1.1.01', // Fornecedores
  IMPOSTOS_A_RECOLHER: '2.1.2.01', // Impostos a recolher
  COMBUSTIVEL: '4.1.1.01', // Despesa com combustível
  MANUTENCAO: '4.1.2.01', // Despesa com manutenção
  PEDÁGIO: '4.1.3.01', // Despesa com pedágio
  DESPESAS_VIAGEM: '4.1.4.01', // Despesas de viagem
};
