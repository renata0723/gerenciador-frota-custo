
import { supabase } from '@/integrations/supabase/client';
import { SupabaseTable } from '@/utils/constants';

interface DbCleanupResponse {
  success: boolean;
  message: string;
  details?: { table: string; count: number }[];
}

// Interface para rastrear dados de usuário
interface UserData {
  userId: string;
  email: string;
  createdAt: string;
}

/**
 * Limpa todas as tabelas do banco de dados, exceto dados de usuários e configurações do sistema.
 */
export const cleanupAllTables = async (): Promise<DbCleanupResponse> => {
  try {
    const tables: SupabaseTable[] = [
      'Abastecimentos',
      'Canhoto',
      'Contratos',
      'Despesas Gerais',
      'Manutenção',
      'Motorista',
      'Notas Fiscais',
      'Proprietarios',
      'Relatórios',
      'Saldo a pagar',
      'TiposCombustivel',
      'VeiculoProprietarios',
      'Veiculos'
    ];

    const results = [];

    // Limpa cada tabela
    for (const table of tables) {
      const { data, error, count } = await supabase
        .from(table)
        .delete()
        .neq('id', 0) // Isso garante que todos os registros serão deletados
        .select('count');

      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
      } else {
        results.push({ table, count: count || 0 });
      }
    }

    return {
      success: true,
      message: 'Todas as tabelas foram limpas com sucesso.',
      details: results
    };
  } catch (error) {
    console.error('Erro durante a limpeza das tabelas:', error);
    return {
      success: false,
      message: 'Ocorreu um erro durante a limpeza das tabelas.'
    };
  }
};

/**
 * Limpa uma tabela específica do banco de dados.
 */
export const cleanupTable = async (tableName: SupabaseTable): Promise<DbCleanupResponse> => {
  try {
    const { error, count } = await supabase
      .from(tableName)
      .delete()
      .neq('id', 0) // Isso garante que todos os registros serão deletados
      .select('count');

    if (error) {
      return {
        success: false,
        message: `Erro ao limpar a tabela ${tableName}: ${error.message}`
      };
    }

    return {
      success: true,
      message: `Tabela ${tableName} foi limpa com sucesso.`,
      details: [{ table: tableName, count: count || 0 }]
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      success: false,
      message: `Ocorreu um erro durante a limpeza da tabela ${tableName}: ${errorMessage}`
    };
  }
};

/**
 * Restaura dados de demonstração para uma tabela específica.
 * Esta função ainda não está implementada.
 */
export const restoreDemoData = async (tableName: SupabaseTable): Promise<DbCleanupResponse> => {
  // Implementação futura para restaurar dados de demonstração
  return {
    success: false,
    message: 'A função de restaurar dados de demonstração ainda não está implementada.'
  };
};
