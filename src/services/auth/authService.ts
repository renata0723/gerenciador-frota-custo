import { supabase } from '@/integrations/supabase/client';
import { Usuario } from '@/types/usuario';
import { logOperation } from '@/utils/logOperations';

export const autenticarUsuario = async (email: string, senha: string): Promise<Usuario | null> => {
  try {
    console.log('Tentando autenticar usuário:', email);
    
    // Autenticação via Supabase
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
      
      return {
        ...data,
        status: data.status as Usuario['status']
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

export const getUsuarioAutenticado = (): Usuario | null => {
  try {
    const usuarioString = localStorage.getItem('userData');
    if (!usuarioString) return null;
    
    const usuario = JSON.parse(usuarioString) as Usuario;
    return usuario;
  } catch (error) {
    console.error('Erro ao obter usuário autenticado:', error);
    return null;
  }
};
