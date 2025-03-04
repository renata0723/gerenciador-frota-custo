
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
export const APP_NAME = "ControlFrota | Sistema de Controle de Frota e Logística";
export const APP_SUBTITLE = "Controladoria";

// Remover números de versão
export const APP_VERSION = "";

// Status do canhoto
export const canhotoStatus = [
  "Pendente",
  "Recebido",
  "Entregue",
  "Arquivado",
  "Cancelado",
  "Aguardando Pagamento"
];

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
