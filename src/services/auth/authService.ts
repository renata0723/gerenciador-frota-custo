
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: LoginCredentials) => {
  try {
    console.log('Tentando login com:', email);
    
    // Buscar usuário diretamente da tabela Usuarios
    const { data: usuario, error: userError } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', password)
      .single();

    if (userError || !usuario) {
      console.error('Erro ao buscar usuário:', userError);
      throw new Error('Email ou senha inválidos');
    }

    console.log('Usuário encontrado:', usuario);

    // Armazenar dados do usuário de forma consistente
    localStorage.setItem('userData', JSON.stringify(usuario));
    localStorage.setItem('userToken', 'token-' + Date.now());
    localStorage.setItem('userName', usuario.nome);
    localStorage.setItem('userEmail', usuario.email);
    localStorage.setItem('userId', String(usuario.id));

    // Atualizar último acesso (não aguardamos a conclusão para não atrasar o login)
    supabase
      .from('Usuarios')
      .update({ ultimo_acesso: new Date().toISOString() })
      .eq('id', usuario.id)
      .then(() => console.log('Último acesso atualizado'))
      .catch(err => console.error('Erro ao atualizar último acesso:', err));

    console.log('Login realizado com sucesso:', usuario.nome);
    return usuario;
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    let message = 'Erro ao fazer login';
    if (error.message === 'Email ou senha inválidos') {
      message = 'Email ou senha inválidos';
    }
    toast.error(message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Limpar todos os dados do usuário
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    
    console.log('Logout realizado com sucesso');
    toast.success('Logout realizado com sucesso');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    toast.error('Erro ao fazer logout');
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    
    if (userData && userToken) {
      // Verificar se os dados do usuário são válidos
      try {
        const user = JSON.parse(userData);
        if (user && user.id && user.email) {
          console.log('Usuário autenticado:', user.nome);
          return true;
        }
      } catch (e) {
        console.error('Erro ao analisar dados do usuário:', e);
        return false;
      }
    }
    
    console.log('Usuário não autenticado');
    return false;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

export const getUsuarioAutenticado = (): Usuario | null => {
  try {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      console.log('Nenhum dado de usuário encontrado no localStorage');
      return null;
    }
    
    const userData: Usuario = JSON.parse(userDataString);
    if (!userData || !userData.id) {
      console.log('Dados de usuário inválidos no localStorage');
      return null;
    }
    
    return userData;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};
