
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

/**
 * Formata CPF ou CNPJ para exibição
 * @param documento CPF ou CNPJ a ser formatado
 * @returns CPF ou CNPJ formatado
 */
export const formatCPFCNPJ = (documento: string | null | undefined): string => {
  if (!documento) return '';
  
  // Remove caracteres não numéricos
  const numeros = documento.replace(/\D/g, '');
  
  // CPF
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  // CNPJ
  if (numeros.length === 14) {
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  
  return documento;
};

/**
 * Formata um valor para moeda
 * @param valor Valor a ser formatado
 * @returns String formatada no padrão de moeda
 */
export const formatCurrency = (valor: number | string | null | undefined): string => {
  return formatarValorMonetario(valor);
};

/**
 * Formata CPF para exibição
 * @param cpf CPF a ser formatado
 * @returns CPF formatado
 */
export const formatarCPF = (cpf: string | null | undefined): string => {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  const numeros = cpf.replace(/\D/g, '');
  
  // Se não tiver 11 dígitos, retorna como está
  if (numeros.length !== 11) return cpf;
  
  return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Calcula a média de consumo de combustível
 * @param quilometragem Quilometragem percorrida
 * @param litros Quantidade de litros abastecidos
 * @returns Média de km/l com até 2 casas decimais
 */
export const calcularMediaConsumo = (quilometragem: number, litros: number): string => {
  if (!quilometragem || !litros || litros === 0) return 'N/A';
  
  const media = quilometragem / litros;
  return media.toFixed(2).replace('.', ',') + ' km/l';
};

/**
 * Alias para formatarData para compatibilidade
 */
export const formatDate = formatarData;
