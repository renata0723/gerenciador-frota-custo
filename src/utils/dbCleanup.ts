
/**
 * Funções para limpeza de dados do sistema armazenados no localStorage
 */

/**
 * Remove todos os registros das tabelas especificadas do localStorage
 */
export const cleanupAllTables = (): void => {
  try {
    // Lista de todas as "tabelas" simuladas no localStorage
    const tables = [
      'veiculos',
      'motoristas',
      'contratos',
      'notas_fiscais',
      'abastecimentos',
      'manutencoes',
      'despesas',
      'system_logs'
    ];
    
    // Limpa cada tabela
    tables.forEach(table => {
      localStorage.removeItem(table);
    });
    
    localStorage.removeItem('localStorageSize');
    
    console.log('Todos os dados foram limpos com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
    throw new Error('Falha ao limpar os dados. Verifique o console para mais detalhes.');
  }
};

/**
 * Calcula o tamanho aproximado dos dados armazenados no localStorage
 */
export const calculateLocalStorageSize = (): { totalSize: string, items: { key: string, size: string }[] } => {
  let totalSize = 0;
  let items: { key: string, size: string }[] = [];
  
  try {
    // Verifica cada item no localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key) || '';
        const size = value.length * 2; // Aproximação em bytes (2 bytes por caractere)
        
        totalSize += size;
        items.push({
          key,
          size: formatBytes(size)
        });
      }
    }
    
    return {
      totalSize: formatBytes(totalSize),
      items: items.sort((a, b) => {
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        return sizeB - sizeA;
      })
    };
  } catch (error) {
    console.error('Erro ao calcular tamanho do localStorage:', error);
    return {
      totalSize: '0 B',
      items: []
    };
  }
};

/**
 * Formata bytes para formato legível (KB, MB, etc)
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
