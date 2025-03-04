
import { supabase } from '@/integrations/supabase/client';
import { Permissao, PermissaoUsuario } from '@/types/usuario';
import { logOperation } from '@/utils/logOperations';
import { getUsuarioAutenticado } from '../auth/authService';

export const getPermissoes = async (): Promise<Permissao[]> => {
  try {
    const { data, error } = await supabase
      .from('Permissoes')
      .select('*')
      .order('modulo');
    
    if (error) {
      console.error('Erro ao buscar permissões:', error);
      logOperation('Usuários', 'Buscar permissões', 'false');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar permissões:', error);
    logOperation('Usuários', 'Buscar permissões', 'false');
    return [];
  }
};

export const getPermissoesUsuario = async (usuarioId: number): Promise<PermissaoUsuario[]> => {
  try {
    const { data, error } = await supabase
      .from('UsuarioPermissoes')
      .select(`
        *,
        permissao:permissao_id (
          modulo, 
          acao
        )
      `)
      .eq('usuario_id', usuarioId);
    
    if (error) {
      console.error('Erro ao buscar permissões do usuário:', error);
      logOperation('Usuários', 'Buscar permissões do usuário', 'false');
      return [];
    }
    
    // Converter para o formato esperado
    return (data || []).map(item => ({
      id: item.id,
      usuario_id: item.usuario_id,
      permissao_id: item.permissao_id,
      concedido_por: item.concedido_por,
      created_at: item.created_at,
      modulo: item.permissao?.modulo,
      acao: item.permissao?.acao
    }));
  } catch (error) {
    console.error('Erro ao buscar permissões do usuário:', error);
    logOperation('Usuários', 'Buscar permissões do usuário', 'false');
    return [];
  }
};

export const atribuirPermissao = async (usuarioId: number, permissaoId: number, concedidoPor?: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('UsuarioPermissoes')
      .insert({
        usuario_id: usuarioId,
        permissao_id: permissaoId,
        concedido_por: concedidoPor
      });
    
    if (error) {
      console.error('Erro ao atribuir permissão:', error);
      logOperation('Usuários', 'Atribuir permissão', 'false');
      return false;
    }
    
    logOperation('Usuários', 'Atribuir permissão', 'true');
    return true;
  } catch (error) {
    console.error('Erro ao atribuir permissão:', error);
    logOperation('Usuários', 'Atribuir permissão', 'false');
    return false;
  }
};

export const removerPermissao = async (id: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('UsuarioPermissoes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erro ao remover permissão:', error);
      logOperation('Usuários', 'Remover permissão', 'false');
      return false;
    }
    
    logOperation('Usuários', 'Remover permissão', 'true');
    return true;
  } catch (error) {
    console.error('Erro ao remover permissão:', error);
    logOperation('Usuários', 'Remover permissão', 'false');
    return false;
  }
};

// Função para verificar se o usuário atual tem permissão para uma ação específica
export const verificarPermissao = (modulo: string, acao: string): boolean => {
  try {
    const usuario = getUsuarioAutenticado();
    if (!usuario) return false;
    
    // Administrador tem todas as permissões
    if (usuario.cargo === 'Administrador' || usuario.email === 'admin@slog.com.br') {
      return true;
    }
    
    // Se não for administrador, vamos negar por enquanto para simplificar
    // Em uma implementação completa, verificaríamos as permissões no banco
    return false;
  } catch (error) {
    console.error('Erro ao verificar permissão:', error);
    return false;
  }
};
