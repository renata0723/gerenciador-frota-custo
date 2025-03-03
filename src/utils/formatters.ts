
/**
 * Formatadores para valores e datas
 */

/**
 * Formata um valor para moeda brasileira (R$)
 * @param value - Valor a ser formatado
 * @returns string formatada
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata um valor monetário sem o símbolo da moeda
 * @param value - Valor a ser formatado
 * @returns string formatada apenas com o valor (sem símbolo da moeda)
 */
export const formatarValorMonetario = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Formata data no padrão brasileiro dd/mm/yyyy
 * @param date - Data a ser formatada
 * @returns string formatada
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Formata uma data para o formato ISO (yyyy-mm-dd)
 * @param date - Data a ser formatada
 * @returns string no formato ISO
 */
export const formatDateToISO = (date: Date | string): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toISOString().split('T')[0];
};

/**
 * Formata número com duas casas decimais
 * @param value - Valor a ser formatado
 * @returns string formatada
 */
export const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
  if (value === null || value === undefined) return '0';
  
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};
