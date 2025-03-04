
// Re-exportar todas as funções dos serviços
export * from './usuarioService';
// Explicitamente re-exportar para resolver a ambiguidade
export { verificarPermissao as checkPermission } from './permissoesService';
export * from '../auth/authService';
