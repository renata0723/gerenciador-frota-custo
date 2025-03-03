
/**
 * Utilitário para limpar dados armazenados localmente
 */

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
