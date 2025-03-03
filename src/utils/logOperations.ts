
/**
 * Utilitário para registrar operações do sistema em log
 */

// Função para registrar operações
export const logOperation = (module: string, action: string, details?: string) => {
  // Obter timestamp atual
  const timestamp = new Date().toISOString();
  
  // Criar registro de log
  const logEntry = {
    timestamp,
    module,
    action,
    details,
    success: true
  };
  
  // Recuperar logs anteriores
  const previousLogs = JSON.parse(localStorage.getItem('system_logs') || '[]');
  
  // Adicionar novo log
  const updatedLogs = [logEntry, ...previousLogs].slice(0, 200); // Manter apenas os 200 logs mais recentes
  
  // Salvar logs atualizados
  localStorage.setItem('system_logs', JSON.stringify(updatedLogs));
  
  // Log no console apenas em ambiente de desenvolvimento
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[LOG ${timestamp}] ${module}: ${action} - ${details || 'OK'}`);
  }
  
  return logEntry;
};

// Função para limpar todos os logs
export const clearAllLogs = () => {
  localStorage.removeItem('system_logs');
  console.log('Todos os logs foram removidos');
};

// Função para recuperar logs
export const getLogs = (limit = 100) => {
  const logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
  return logs.slice(0, limit);
};

// Função para filtrar logs por módulo
export const getLogsByModule = (moduleName: string, limit = 100) => {
  const logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
  return logs
    .filter((log: any) => log.module === moduleName)
    .slice(0, limit);
};

// Função para filtrar logs por status (sucesso/pendente)
export const getLogsByStatus = (success: boolean, limit = 100) => {
  const logs = JSON.parse(localStorage.getItem('system_logs') || '[]');
  return logs
    .filter((log: any) => log.success === success)
    .slice(0, limit);
};
