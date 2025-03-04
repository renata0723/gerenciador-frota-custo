
export const formataMoeda = (valor: number | null | undefined): string => {
  if (valor === null || valor === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

export const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('pt-BR');
};

export const tiposDespesa = [
  "Descarga", 
  "Reentrega", 
  "No-Show", 
  "Diária", 
  "Pedágio", 
  "Alimentação", 
  "Hospedagem", 
  "Multa", 
  "Equipamentos", 
  "Administrativa", 
  "Outros"
];

export const APP_NAME = "SSLOG TRANSPORTES LTDA | Controladoria de Custo";
export const APP_SUBTITLE = "Controladoria de Custo";

export const APP_VERSION = "";

export const canhotoStatus = {
  PENDENTE: 'Pendente' as const,
  RECEBIDO: 'Recebido' as const,
  CANCELADO: 'Cancelado' as const
};

export type CanhotoStatus = typeof canhotoStatus[keyof typeof canhotoStatus];

export const tiposManutencao = [
  "preventiva",
  "corretiva"
];

export type TipoManutencao = "preventiva" | "corretiva";

export const localRealizacao = [
  "patio",
  "externa"
];

export type LocalRealizacao = "patio" | "externa";

export const ANO_ATUAL = 2025;

export const EMPRESA_CNPJ = "44.712.877/0001-80";
export const EMPRESA_NOME = "SSLOG Transportes LTDA";
