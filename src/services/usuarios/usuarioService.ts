
import { supabase } from '@/integrations/supabase/client';
import { Usuario, StatusUsuario } from '@/types/usuario';
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
