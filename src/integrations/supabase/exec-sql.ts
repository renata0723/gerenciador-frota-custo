
import { supabase } from './client';

/**
 * Executa uma consulta SQL direta no Supabase.
 * ATENÇÃO: Essa função deve ser usada com extremo cuidado para evitar injeção de SQL.
 * Ideal para operações de DDL e outras que não sejam possíveis via API Supabase.
 * 
 * @param sql A consulta SQL a ser executada
 * @returns Uma promessa que resolve com o resultado da operação
 */
export const executeSql = async (sql: string): Promise<boolean> => {
  try {
    // Tenta executar o SQL via RPC
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
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

/**
 * Verifica se uma tabela existe no banco de dados
 * 
 * @param tableName Nome da tabela a verificar
 * @returns Uma promessa que resolve com true se a tabela existir, false caso contrário
 */
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    // Primeiro verifica se a função RPC existe
    const { data: funcExists, error: funcError } = await supabase.rpc('check_function_exists', { function_name: 'check_table_exists' });
    
    if (funcError || !funcExists) {
      // Se a função não existir, cria-a
      const createFuncSql = `
        CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
        RETURNS integer
        LANGUAGE plpgsql
        AS $$
        DECLARE
          count_tables integer;
        BEGIN
          SELECT COUNT(*) INTO count_tables
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = $1;
          
          RETURN count_tables;
        END;
        $$;
      `;
      
      const { error: createError } = await executeSql(createFuncSql);
      
      if (createError) {
        console.error('Erro ao criar função check_table_exists:', createError);
        return false;
      }
    }
    
    // Agora verifica se a tabela existe
    const { data, error } = await supabase.rpc('check_table_exists', { table_name: tableName });
    
    if (error) {
      console.error('Erro ao verificar existência da tabela:', error);
      return false;
    }
    
    return data > 0;
  } catch (error) {
    console.error('Erro ao verificar existência da tabela:', error);
    return false;
  }
};

/**
 * Cria a tabela Folha_Pagamento se ela não existir
 * 
 * @returns Uma promessa que resolve com true se a operação for bem-sucedida
 */
export const createFolhaPagamentoTable = async (): Promise<boolean> => {
  try {
    const exists = await tableExists('Folha_Pagamento');
    
    if (!exists) {
      console.log('Tabela Folha_Pagamento não existe, criando...');
      
      const sql = `
        CREATE TABLE IF NOT EXISTS "Folha_Pagamento" (
          id SERIAL PRIMARY KEY,
          funcionario_nome TEXT NOT NULL,
          salario_base NUMERIC NOT NULL,
          data_pagamento DATE NOT NULL,
          mes_referencia TEXT NOT NULL,
          ano_referencia TEXT NOT NULL,
          inss NUMERIC,
          fgts NUMERIC,
          ir NUMERIC,
          vale_transporte NUMERIC,
          vale_refeicao NUMERIC,
          outros_descontos NUMERIC,
          outros_beneficios NUMERIC,
          valor_liquido NUMERIC NOT NULL,
          observacoes TEXT,
          status TEXT NOT NULL DEFAULT 'concluido',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `;
      
      const success = await executeSql(sql);
      
      if (!success) {
        console.error('Erro ao criar tabela Folha_Pagamento');
        return false;
      }
      
      console.log('Tabela Folha_Pagamento criada com sucesso!');
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela Folha_Pagamento:', error);
    return false;
  }
};
