
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

/**
 * Limpa todos os dados do localStorage
 */
export const clearAllLocalData = (): { success: boolean; message: string } => {
  try {
    localStorage.clear();
    return { 
      success: true, 
      message: 'Todos os dados locais foram limpos com sucesso.' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: 'Erro ao limpar dados locais.' 
    };
  }
};

/**
 * Limpa dados específicos do localStorage por chave
 */
export const clearLocalDataByKey = (key: string): { success: boolean; message: string } => {
  try {
    localStorage.removeItem(key);
    return { 
      success: true, 
      message: `Dados da chave '${key}' foram limpos com sucesso.` 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `Erro ao limpar dados da chave '${key}'.` 
    };
  }
};

/**
 * Obtém informações sobre o uso do localStorage
 */
export const getLocalStorageUsage = (): { 
  totalSize: string; 
  items: { key: string; size: string; }[]; 
} => {
  const items: { key: string; size: string }[] = [];
  let totalBytes = 0;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      const bytes = new Blob([value]).size;
      totalBytes += bytes;
      items.push({ 
        key, 
        size: formatBytes(bytes) 
      });
    }
  }

  return {
    totalSize: formatBytes(totalBytes),
    items: items.sort((a, b) => b.key.localeCompare(a.key))
  };
};

/**
 * Formata bytes para uma representação legível
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Apelidos para compatibilidade
 */
export const clearAllSupabaseTables = cleanupAllTables;
export const clearSupabaseTable = cleanupTable;
