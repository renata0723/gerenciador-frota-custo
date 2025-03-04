
import { supabase } from './client';

/**
 * Executa uma função SQL criada no banco de dados para verificar se uma tabela existe
 * @param tableName Nome da tabela para verificar
 * @returns true se a tabela existe, false caso contrário
 */
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_table_exists', {
      table_name: tableName
    });
    
    if (error) {
      console.error('Erro ao verificar tabela:', error);
      return false;
    }
    
    return data === 1;
  } catch (error) {
    console.error('Erro ao verificar tabela:', error);
    return false;
  }
};

/**
 * Executa uma função SQL criada no banco de dados para verificar se uma função existe
 * @param functionName Nome da função para verificar
 * @returns true se a função existe, false caso contrário
 */
export const checkFunctionExists = async (functionName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_function_exists', {
      function_name: functionName
    });
    
    if (error) {
      console.error('Erro ao verificar função:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erro ao verificar função:', error);
    return false;
  }
};

/**
 * Executa SQL dinamicamente no banco de dados
 * ATENÇÃO: Esta função pode representar um risco de segurança se mal utilizada
 * @param sqlQuery Query SQL para executar
 * @returns true se a execução for bem-sucedida, false caso contrário
 */
export const execSQL = async (sqlQuery: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sqlQuery
    });
    
    if (error) {
      console.error('Erro ao executar SQL:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao executar SQL:', error);
    return false;
  }
};
