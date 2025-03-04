
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata um valor para moeda brasileira
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Formata uma data no padrão brasileiro (dd/MM/yyyy)
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '-';
  
  try {
    const dateValue = typeof date === 'string' ? parseISO(date) : date;
    return format(dateValue, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error, date);
    return String(date);
  }
};

/**
 * Formata um número com precisão definida
 */
export const formatNumber = (value: number, precision: number = 2): string => {
  return value.toFixed(precision);
};

/**
 * Converte uma string para booleano
 */
export const parseBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') return value;
  return value?.toLowerCase() === 'true' || value === '1';
};
