
// Tabelas do Supabase
export const SUPABASE_TABLES = [
  'Abastecimentos',
  'Canhoto',
  'Contratos',
  'Despesas Gerais',
  'Manutenção',
  'Motorista',
  'Motoristas',
  'Notas Fiscais',
  'Proprietarios',
  'Relatórios',
  'Saldo a pagar',
  'TiposCombustivel',
  'VeiculoProprietarios',
  'Veiculos'
] as const;

export type SupabaseTable = typeof SUPABASE_TABLES[number];

// Status para Canhotos
export const CANHOTO_STATUS = ['Pendente', 'Recebido', 'Aguardando'] as const;
export type CanhotoStatus = typeof CANHOTO_STATUS[number];

// Tipos de manutenção
export const TIPOS_MANUTENCAO = ['preventiva', 'corretiva'] as const;
export type TipoManutencao = typeof TIPOS_MANUTENCAO[number];

// Tipos de log
export const LOG_TYPES = ['info', 'warning', 'error', 'success'] as const;
export type LogType = typeof LOG_TYPES[number];
