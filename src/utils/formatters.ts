
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

// Função para formatar CPF
export function formatarCPF(cpf: string): string {
  if (!cpf) return '';
  
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Adiciona a formatação
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Função para formatar CNPJ
export function formatarCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Adiciona a formatação
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

// Função para formatar número de telefone
export function formatarTelefone(telefone: string): string {
  if (!telefone) return '';
  
  // Remove caracteres não numéricos
  telefone = telefone.replace(/\D/g, '');
  
  // Verifica se é celular ou fixo
  if (telefone.length === 11) {
    return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
}

// Função para formatar CEP
export function formatarCEP(cep: string): string {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  cep = cep.replace(/\D/g, '');
  
  // Adiciona a formatação
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Aliases para compatibilidade
export const formatCurrency = formatarValorMonetario;
export const formatDate = formatarData;
export const formataMoeda = formatarValorMonetario;
export const formatCPF = formatarCPF;
export const formatCNPJ = formatarCNPJ;
export const formatTelefone = formatarTelefone;
export const formatCEP = formatarCEP;
