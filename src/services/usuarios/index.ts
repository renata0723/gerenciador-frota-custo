
// Re-exportar todas as funções dos serviços
export * from './usuarioService';
// Explicitamente re-exportar para resolver a ambiguidade com prefixo para evitar colisão
export { verificarPermissao as checkUserPermission } from './permissoesService';
export * from '../auth/authService';
