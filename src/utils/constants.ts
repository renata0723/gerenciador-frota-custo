// Constantes globais da aplicação
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  NOTAS: '/notas',
  VEICULOS: '/veiculos',
  MOTORISTAS: '/motoristas',
  CONTRATOS: '/contratos',
  ABASTECIMENTOS: '/abastecimentos',
  DESPESAS: '/despesas',
  MANUTENCAO: '/manutencao',
  CANHOTOS: '/canhotos',
  SALDO_PAGAR: '/saldo-pagar',
};

// Status para documentos e entidades
export const STATUS = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  PENDENTE: 'pendente',
  CONCLUIDO: 'concluído',
  EM_ANDAMENTO: 'em andamento',
  CANCELADO: 'cancelado',
};

// Tipos de veículos
export const TIPO_VEICULO = {
  CAVALO: 'cavalo',
  CARRETA: 'carreta',
};

// Status de veículos
export const STATUS_VEICULO = {
  ATIVO: 'ativo',
  INATIVO: 'inativo',
  MANUTENCAO: 'manutenção',
};

// Constantes para status do saldo a pagar
export const statusSaldoPagar = {
  PENDENTE: 'pendente',
  LIBERADO: 'liberado',
  PAGO: 'pago',
  CANCELADO: 'cancelado'
};

// Funções de formatação monetária
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

export const formataMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
};

// Constante para o ano atual
export const ANO_ATUAL = new Date().getFullYear();

// Formatar datas
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('pt-BR');
};

// Formatar números com pontos para milhares
export const formatNumber = (num: number): string => {
  return num.toLocaleString('pt-BR');
};

// Configurações padrão
export const DEFAULT_SETTINGS = {
  ITENS_POR_PAGINA: 10,
  MAX_UPLOAD_SIZE: 5242880, // 5MB
};

// Cargos
export const CARGOS = {
  ADMIN: 'Administrador',
  OPERADOR: 'Operador',
  FINANCEIRO: 'Financeiro',
  MOTORISTA: 'Motorista',
};

// Tipos de despesas
export const TIPOS_DESPESA = [
  'Abastecimento',
  'Alimentação',
  'Hospedagem',
  'Manutenção',
  'Pedágio',
  'Descarga',
  'Reentrega',
  'No-show',
  'Outros'
];

// Meses do ano
export const MESES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
];
