
// Constantes globais usadas no sistema

export const estados = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' },
  { nome: 'Amapá', sigla: 'AP' },
  { nome: 'Amazonas', sigla: 'AM' },
  { nome: 'Bahia', sigla: 'BA' },
  { nome: 'Ceará', sigla: 'CE' },
  { nome: 'Distrito Federal', sigla: 'DF' },
  { nome: 'Espírito Santo', sigla: 'ES' },
  { nome: 'Goiás', sigla: 'GO' },
  { nome: 'Maranhão', sigla: 'MA' },
  { nome: 'Mato Grosso', sigla: 'MT' },
  { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { nome: 'Minas Gerais', sigla: 'MG' },
  { nome: 'Pará', sigla: 'PA' },
  { nome: 'Paraíba', sigla: 'PB' },
  { nome: 'Paraná', sigla: 'PR' },
  { nome: 'Pernambuco', sigla: 'PE' },
  { nome: 'Piauí', sigla: 'PI' },
  { nome: 'Rio de Janeiro', sigla: 'RJ' },
  { nome: 'Rio Grande do Norte', sigla: 'RN' },
  { nome: 'Rio Grande do Sul', sigla: 'RS' },
  { nome: 'Rondônia', sigla: 'RO' },
  { nome: 'Roraima', sigla: 'RR' },
  { nome: 'Santa Catarina', sigla: 'SC' },
  { nome: 'São Paulo', sigla: 'SP' },
  { nome: 'Sergipe', sigla: 'SE' },
  { nome: 'Tocantins', sigla: 'TO' }
];

export const statusItems = [
  'ativo', 
  'inativo', 
  'pendente', 
  'concluido', 
  'aberto', 
  'fechado',
  'aguardando_saida',
  'saida_concluida'
];

// Status das notas fiscais
export const statusNotas = {
  AGUARDANDO_SAIDA: 'Aguardando Saída',
  SAIDA_CONCLUIDA: 'Saída Concluída',
  EM_TRANSITO: 'Em Trânsito', 
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada'
};

// Tipos de documento para cancelamento
export const tiposDocumento = [
  'Nota Fiscal',
  'Contrato',
  'Manifesto',
  'CTe'
];

// Motivos comuns de cancelamento
export const motivosCancelamento = [
  'Erro de preenchimento',
  'Duplicidade',
  'Cliente desistiu',
  'Problema operacional',
  'Veículo indisponível',
  'Motorista indisponível',
  'Outros'
];

// Função para formatação de valores monetários
export const formataMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

// Função para formatação de datas
export const formataData = (data: string | Date): string => {
  if (!data) return '';
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleDateString('pt-BR');
};

// Tipos de veículos
export const tiposVeiculo = [
  'Truck',
  'Carreta',
  'Bitrem',
  'Rodotrem',
  'VUC',
  'Toco',
  'Van',
  'Furgão',
  'Utilitário'
];

// Tipos de manutenção
export const tiposManutencao = [
  'Preventiva',
  'Corretiva',
  'Preditiva',
  'Emergencial'
];

// Locais de manutenção
export const locaisManutencao = [
  'Pátio',
  'Oficina Própria',
  'Oficina Terceirizada',
  'Concessionária'
];

// Tipos de combustível
export const tiposCombustivel = [
  'Diesel S10',
  'Diesel Comum',
  'Gasolina',
  'Etanol',
  'GNV'
];

// Tipos de despesa
export const tiposDespesa = [
  'Descarga',
  'Reentrega', 
  'No-Show',
  'Diária',
  'Pedagio',
  'Alimentação',
  'Hospedagem',
  'Multa',
  'Equipamentos',
  'Outros'
];

// Categorias para DRE
export const categoriasDRE = [
  'Receita',
  'Deduções',
  'Custos',
  'Despesas Operacionais',
  'Despesas Administrativas',
  'Resultado Financeiro',
  'Impostos'
];
