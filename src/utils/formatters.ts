export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (date: string): string => {
  if (!date) return 'N/A';
  
  try {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('pt-BR');
  } catch (error) {
    return date;
  }
};

export const formatCPFCNPJ = (value: string | null | undefined): string => {
  if (!value) return 'N/A';
  
  // Remove caracteres não numéricos
  const numbers = value.replace(/\D/g, '');
  
  // CPF (11 dígitos)
  if (numbers.length === 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // CNPJ (14 dígitos)
  if (numbers.length === 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return value;
};

/**
 * Formata um valor numérico para o formato monetário brasileiro (R$)
 * @param valor O valor a ser formatado
 * @returns String formatada no padrão monetário brasileiro
 */
export const formatarValorMonetario = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

/**
 * Formata uma data string para o formato brasileiro (dd/mm/yyyy)
 * @param data A data em formato ISO ou string
 * @returns String formatada no padrão brasileiro
 */
export const formatarData = (data: string | Date | null | undefined): string => {
  if (!data) return '';
  
  try {
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return new Intl.DateTimeFormat('pt-BR').format(dataObj);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return String(data);
  }
};
