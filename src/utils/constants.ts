
import { StatusItem } from '@/types/contabilidade';
import { format } from 'date-fns';

// Tipos de manutenção
export const TIPO_MANUTENCAO = {
  PREVENTIVA: 'preventiva',
  CORRETIVA: 'corretiva',
};

// Formatação de moeda e data
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formataMoeda = formatCurrency;

export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  try {
    const dataObj = typeof date === 'string' ? new Date(date) : date;
    return format(dataObj, 'dd/MM/yyyy');
  } catch (error) {
    return String(date);
  }
};

// Contas contábeis
export const CONTAS_CONTABEIS = {
  CAIXA: '1.1.1.01',
  BANCOS: '1.1.1.02',
  CLIENTES: '1.1.2.01',
  FORNECEDORES: '2.1.1.01',
  ADIANTAMENTO_FORNECEDORES: '1.1.5.01',
  IMPOSTOS_A_RECOLHER: '2.1.2.01',
  RECEITA_FRETE: '3.1.1.01',
  DESPESA_COMBUSTIVEL: '4.1.1.01',
  DESPESA_MANUTENCAO: '4.1.2.01',
  DESPESA_SALARIOS: '4.1.3.01',
  DESPESA_ADMINISTRATIVA: '4.2.1.01',
};

// Status para pagamentos
export const statusSaldoPagar = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'pago', label: 'Pago' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'liberado', label: 'Liberado' },
];

// Definição das propriedades para acesso facilitado
statusSaldoPagar.PENDENTE = 'pendente';
statusSaldoPagar.PARCIAL = 'parcial';
statusSaldoPagar.PAGO = 'pago';
statusSaldoPagar.CANCELADO = 'cancelado';
statusSaldoPagar.LIBERADO = 'liberado';

export const ANO_ATUAL = new Date().getFullYear();

// Lista de bancos brasileiros
export const bancos = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú' },
  { codigo: '077', nome: 'Inter' },
  { codigo: '260', nome: 'Nubank' },
  { codigo: '336', nome: 'C6 Bank' },
  { codigo: '756', nome: 'Sicoob' },
  { codigo: '748', nome: 'Sicredi' },
  { codigo: '212', nome: 'Banco Original' },
  { codigo: '655', nome: 'Votorantim' },
  { codigo: '422', nome: 'Safra' },
  { codigo: '399', nome: 'HSBC' },
  { codigo: '021', nome: 'Banestes' },
  { codigo: '041', nome: 'Banrisul' },
  { codigo: '003', nome: 'Banco da Amazônia' },
  { codigo: '004', nome: 'Banco do Nordeste' },
  { codigo: '025', nome: 'Banco Alfa' },
  { codigo: '600', nome: 'Luso Brasileiro' },
];

// Alíquotas de impostos para apuração tributária no Lucro Real
export const ALIQUOTAS_IMPOSTOS = {
  PIS: 0.0165,
  COFINS: 0.076,
  IRPJ: 0.15,
  IRPJ_ADICIONAL: 0.10,
  CSLL: 0.09,
};

export const LIMITE_MENSAL_IRPJ_ADICIONAL = 20000.00;

export const PERCENTUAIS_PRESUNCAO = {
  TRANSPORTE_CARGAS: 0.08, // 8% para IRPJ
  TRANSPORTE_CARGAS_CSLL: 0.12, // 12% para CSLL
};
