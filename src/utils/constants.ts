
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
