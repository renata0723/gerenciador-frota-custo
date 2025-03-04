
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
