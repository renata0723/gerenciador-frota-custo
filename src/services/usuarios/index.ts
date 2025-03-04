
// Re-exportar todas as funções dos serviços
export * from './usuarioService';
// Explicitamente re-exportar as funções de permissões exceto verificarPermissao
export { 
  getPermissoes, 
  getPermissoesUsuario, 
  atribuirPermissao, 
  removerPermissao
} from './permissoesService';
// Re-exportar verificarPermissao como checkUserPermission para evitar conflito
export { verificarPermissao as checkUserPermission } from './permissoesService';
export * from '../auth/authService';
