
export const formataMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDate = (date: string) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString('pt-BR');
};

export const tiposDespesa = [
  "Descarga",
  "Reentrega",
  "No-Show",
  "Outros",
  "Administrativa",
  "Diária",
  "Pedágio",
  "Alimentação",
  "Hospedagem",
  "Multa",
  "Equipamentos"
];

// Atualização do nome da aplicação
export const APP_NAME = "SSLOG TRANSPORTES LTDA | Sistema de Controle de Frota e Logística";
export const APP_SUBTITLE = "Controladoria";

// Remover números de versão
export const APP_VERSION = "";

// Status do canhoto
export const canhotoStatus = {
  PENDENTE: 'Pendente' as const,
  RECEBIDO: 'Recebido' as const,
  CANCELADO: 'Cancelado' as const
};

export type CanhotoStatus = typeof canhotoStatus[keyof typeof canhotoStatus];

// Tipos de manutenção
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

// Ano atual do sistema
export const ANO_ATUAL = 2025;

// Informações da empresa
export const EMPRESA_CNPJ = "44.712.877/0001-80";
export const EMPRESA_NOME = "SSLOG Transportes LTDA";
