
import { supabase } from '@/integrations/supabase/client';
import { Usuario, Permissao, PermissaoUsuario, StatusUsuario } from '@/types/usuario';
import { logOperation } from '@/utils/logOperations';

// Serviço para Usuários
export const getUsuarios = async (): Promise<Usuario[]> => {
  try {
    const { data, error } = await supabase
      .from('Usuarios')
      .select('*')
      .order('nome');
    
    if (error) {
      console.error('Erro ao buscar usuários:', error);
      logOperation('Usuários', 'Buscar usuários', 'false');
      return [];
    }
    
    // Converter o tipo status para StatusUsuario
    const usuariosConvertidos: Usuario[] = data.map(usuario => ({
      ...usuario,
      status: usuario.status as StatusUsuario
    }));
    
    return usuariosConvertidos;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    logOperation('Usuários', 'Buscar usuários', 'false');
    return [];
  }
};

export const criarUsuario = async (usuario: Usuario): Promise<Usuario | null> => {
  try {
    // Remove senha do log para segurança
    const usuarioLog = { ...usuario };
    delete usuarioLog.senha;
    
    // Garante que o senha esteja presente no objeto (exigido pelo Supabase)
    const dadosInsercao = {
      nome: usuario.nome,
      email: usuario.email,
      senha: usuario.senha || '', // Garante que tenha uma string
      cargo: usuario.cargo,
      status: usuario.status
    };
    
    const { data, error } = await supabase
      .from('Usuarios')
      .insert(dadosInsercao)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao criar usuário:', error);
      logOperation('Usuários', 'Criar usuário', 'false');
      return null;
    }
    
    logOperation('Usuários', 'Criar usuário', 'true');
    
    // Converter o tipo status para StatusUsuario
    return {
      ...data,
      status: data.status as StatusUsuario
    };
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    logOperation('Usuários', 'Criar usuário', 'false');
    return null;
  }
};

export const atualizarUsuario = async (id: number, usuario: Partial<Usuario>): Promise<Usuario | null> => {
  try {
    // Remove senha do log para segurança
    const usuarioLog = { ...usuario };
    delete usuarioLog.senha;
    
    const { data, error } = await supabase
      .from('Usuarios')
      .update(usuario)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao atualizar usuário:', error);
      logOperation('Usuários', 'Atualizar usuário', 'false');
      return null;
    }
    
    logOperation('Usuários', 'Atualizar usuário', 'true');
    
    // Converter o tipo status para StatusUsuario
    return {
      ...data,
      status: data.status as StatusUsuario
    };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    logOperation('Usuários', 'Atualizar usuário', 'false');
    return null;
  }
};

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

// Autenticação simples
export const autenticarUsuario = async (email: string, senha: string): Promise<Usuario | null> => {
  try {
    console.log('Tentando autenticar usuário:', email);
    
    const { data, error } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', senha) // Em produção, usar hash de senha
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao autenticar usuário:', error);
      logOperation('Usuários', 'Login', 'false');
      return null;
    }
    
    if (data) {
      // Atualizar último acesso
      const { error: updateError } = await supabase
        .from('Usuarios')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('id', data.id);
        
      if (updateError) {
        console.error('Erro ao atualizar último acesso:', updateError);
      }
      
      logOperation('Usuários', 'Login', 'true');
      
      // Converter o tipo status para StatusUsuario
      return {
        ...data,
        status: data.status as StatusUsuario
      };
    } else {
      console.log('Usuário ou senha incorretos');
      return null;
    }
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    logOperation('Usuários', 'Login', 'false');
    return null;
  }
};
