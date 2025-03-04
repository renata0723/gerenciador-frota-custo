
/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param valor Valor a ser formatado
 * @returns String formatada no padrão R$ 0,00
 */
export const formatarValorMonetario = (valor: number | string | null | undefined): string => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(valorNumerico);
};

/**
 * Formata uma data no formato ISO para o formato brasileiro
 * @param data Data no formato ISO ou string
 * @returns Data formatada como dd/mm/yyyy
 */
export const formatarData = (data: string | Date | null | undefined): string => {
  if (!data) return '';
  
  const dataObj = data instanceof Date ? data : new Date(data);
  
  if (isNaN(dataObj.getTime())) return '';
  
  const dia = String(dataObj.getDate()).padStart(2, '0');
  const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
  const ano = dataObj.getFullYear();
  
  return `${dia}/${mes}/${ano}`;
};

/**
 * Formata um valor em número para exibição formatada
 * @param valor Valor numérico
 * @returns Número formatado com separadores de milhar
 */
export const formatarNumero = (valor: number | string | null | undefined): string => {
  if (valor === null || valor === undefined) return '0';
  
  const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  return new Intl.NumberFormat('pt-BR').format(valorNumerico);
};
