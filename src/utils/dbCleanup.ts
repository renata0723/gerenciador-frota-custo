
/**
 * Utilitário para limpar dados armazenados localmente e no Supabase
 */
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Chaves de armazenamento local usadas no sistema
const LOCAL_STORAGE_KEYS = [
  'controlfrota_notas_fiscais',
  'contratos',
  'canhotos',
  'motoristas',
  'proprietarios',
  'veiculos',
  'abastecimentos',
  'manutencoes',
  'despesas',
  'system_logs'
];

// Tabelas do Supabase
const SUPABASE_TABLES = [
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
];

// Função para limpar todos os dados armazenados localmente
export const clearAllLocalData = () => {
  LOCAL_STORAGE_KEYS.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('Todos os dados locais foram removidos');
  return true;
};

// Função para limpar dados específicos
export const clearLocalDataByKey = (key: string) => {
  if (LOCAL_STORAGE_KEYS.includes(key)) {
    localStorage.removeItem(key);
    console.log(`Dados de ${key} removidos`);
    return true;
  } else {
    console.warn(`Chave ${key} não reconhecida no sistema`);
    return false;
  }
};

// Função para restaurar dados iniciais para uma chave específica
export const resetToInitialData = (key: string, initialData: any) => {
  localStorage.setItem(key, JSON.stringify(initialData));
  console.log(`Dados de ${key} restaurados para valores iniciais`);
  return true;
};

// Função para verificar tamanho dos dados armazenados
export const getLocalStorageUsage = () => {
  const usage: Record<string, number> = {};
  let totalSize = 0;
  
  LOCAL_STORAGE_KEYS.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      const size = new Blob([data]).size;
      usage[key] = size;
      totalSize += size;
    } else {
      usage[key] = 0;
    }
  });
  
  return {
    byKey: usage,
    totalSize,
    formattedSize: `${(totalSize / 1024).toFixed(2)} KB`
  };
};

// Limpar dados de uma tabela específica do Supabase
export const clearSupabaseTable = async (tableName: string) => {
  if (!SUPABASE_TABLES.includes(tableName)) {
    console.warn(`Tabela ${tableName} não reconhecida no sistema`);
    return false;
  }

  try {
    const { error } = await supabase
      .from(tableName as any)
      .delete()
      .neq('id', 0); // Isso exclui todos os registros

    if (error) {
      console.error(`Erro ao limpar tabela ${tableName}:`, error);
      return false;
    }

    console.log(`Dados da tabela ${tableName} foram removidos`);
    return true;
  } catch (error) {
    console.error(`Erro ao limpar tabela ${tableName}:`, error);
    return false;
  }
};

// Limpar todas as tabelas do Supabase
export const clearAllSupabaseTables = async () => {
  let success = true;
  const failedTables: string[] = [];

  for (const table of SUPABASE_TABLES) {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .neq('id', 0);

      if (error) {
        console.error(`Erro ao limpar tabela ${table}:`, error);
        failedTables.push(table);
        success = false;
      }
    } catch (error) {
      console.error(`Erro ao limpar tabela ${table}:`, error);
      failedTables.push(table);
      success = false;
    }
  }

  if (failedTables.length > 0) {
    toast.error(`Não foi possível limpar as seguintes tabelas: ${failedTables.join(', ')}`);
  } else {
    toast.success('Todas as tabelas do Supabase foram limpas com sucesso');
  }

  return success;
};
