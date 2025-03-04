
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Função para formatar valores monetários
export function formatarValorMonetario(valor: number | string): string {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  
  const valorNumerico = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  return valorNumerico.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Função para formatar datas
export function formatarData(data: string | Date | null | undefined): string {
  if (!data) return '';
  
  try {
    const dataObj = typeof data === 'string' ? new Date(data) : data;
    return format(dataObj, 'dd/MM/yyyy', { locale: ptBR });
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return String(data);
  }
}

// Aliases para compatibilidade
export const formatCurrency = formatarValorMonetario;
export const formatDate = formatarData;
