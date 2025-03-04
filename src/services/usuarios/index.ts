
// Re-exportar todas as funções dos serviços
export * from './usuarioService';
// Explicitamente re-exportar as funções de permissões
export { 
  getPermissoes, 
  getPermissoesUsuario, 
  atribuirPermissao, 
  removerPermissao,
  verificarPermissao as checkUserPermission 
} from './permissoesService';
export * from '../auth/authService';
