
import { toast } from 'sonner';

/**
 * Utility function to log operations in the system
 * @param operation The type of operation being performed
 * @param details Additional details about the operation
 * @param showToast Whether to show a toast notification
 */
export const logOperation = (
  operation: string, 
  details: string, 
  showToast: boolean = true
) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    operation,
    details,
    user: 'admin', // In a real app, this would come from auth context
  };
  
  // Log to console
  console.log(`[${timestamp}] ${operation}: ${details}`);
  
  // Store in localStorage for persistence
  const existingLogs = JSON.parse(localStorage.getItem('operationLogs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('operationLogs', JSON.stringify(existingLogs));
  
  // Show toast notification if enabled
  if (showToast) {
    toast.success(`Operação registrada: ${operation}`);
  }
  
  return logEntry;
};

/**
 * Get all logged operations
 */
export const getOperationLogs = () => {
  return JSON.parse(localStorage.getItem('operationLogs') || '[]');
};

/**
 * Clear all operation logs
 */
export const clearOperationLogs = () => {
  localStorage.removeItem('operationLogs');
  return [];
};
