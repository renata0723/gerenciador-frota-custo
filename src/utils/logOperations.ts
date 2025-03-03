
interface LogEntry {
  module: string;
  action: string;
  timestamp: string;
  success: boolean;
}

/**
 * Registra operações realizadas no sistema para fins de auditoria e monitoramento.
 * 
 * @param module Nome do módulo onde a operação foi realizada
 * @param action Descrição da ação realizada
 * @param success Indica se a operação foi bem-sucedida
 */
export const logOperation = (module: string, action: string, success: string | boolean): void => {
  const timestamp = new Date().toISOString();
  // Converte o parâmetro success para boolean se for uma string
  const isSuccess = typeof success === 'string' 
    ? success === 'true' 
    : Boolean(success);
  
  const logEntry: LogEntry = {
    module,
    action,
    timestamp,
    success: isSuccess
  };
  
  // Registrar no console para debug
  console.log(`[LOG] ${timestamp} - ${module}: ${action} (${isSuccess ? 'Sucesso' : 'Pendente'})`);
  
  // Aqui poderia salvar em um banco de dados ou enviar para um serviço de logging
  // Por enquanto, armazenamos no localStorage
  try {
    const logs = localStorage.getItem('system_logs');
    const existingLogs = logs ? JSON.parse(logs) : [];
    
    existingLogs.unshift(logEntry); // Adiciona no início do array para mostrar os mais recentes primeiro
    
    // Limita a quantidade de logs armazenados localmente (mantém os 500 mais recentes)
    const limitedLogs = existingLogs.slice(0, 500);
    
    localStorage.setItem('system_logs', JSON.stringify(limitedLogs));
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
};
