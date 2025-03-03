
import { LogType } from './constants';

// Interface para registros de logs
interface LogEntry {
  timestamp: string;
  module: string;
  action: string;
  details: string;
  type: LogType;
}

/**
 * Função para registrar operações no sistema
 * @param module Módulo onde a operação ocorreu
 * @param action Ação realizada
 * @param details Detalhes adicionais (opcional)
 * @param type Tipo de log (info, warning, error, success)
 */
export const logOperation = (
  module: string, 
  action: string, 
  details: string = '', 
  type: LogType = 'info'
): void => {
  const timestamp = new Date().toISOString();
  
  const logEntry: LogEntry = {
    timestamp,
    module,
    action,
    details,
    type
  };
  
  // Recuperar logs existentes
  const existingLogsString = localStorage.getItem('system_logs');
  const existingLogs: LogEntry[] = existingLogsString ? JSON.parse(existingLogsString) : [];
  
  // Adicionar novo log e limitar a 1000 entradas (manter os mais recentes)
  const updatedLogs = [logEntry, ...existingLogs].slice(0, 1000);
  
  // Salvar logs atualizados
  localStorage.setItem('system_logs', JSON.stringify(updatedLogs));
  
  // Console log para depuração
  console.log(`[${type.toUpperCase()}] ${module}: ${action}${details ? ` - ${details}` : ''}`);
};

/**
 * Função para recuperar logs do sistema
 * @param limit Número máximo de logs a retornar
 * @param type Filtrar por tipo de log
 * @returns Array de logs
 */
export const getLogs = (limit = 100, type?: LogType): LogEntry[] => {
  const logsString = localStorage.getItem('system_logs');
  if (!logsString) return [];
  
  const logs: LogEntry[] = JSON.parse(logsString);
  
  // Filtrar por tipo se especificado
  const filteredLogs = type ? logs.filter(log => log.type === type) : logs;
  
  // Retornar os logs mais recentes
  return filteredLogs.slice(0, limit);
};

/**
 * Função para limpar todos os logs
 */
export const clearLogs = (): void => {
  localStorage.removeItem('system_logs');
  console.log('Todos os logs foram removidos');
};
