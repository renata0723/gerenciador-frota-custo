
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: LoginCredentials) => {
  try {
    // Buscar usuário diretamente da tabela Usuarios
    const { data: usuario, error: userError } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', email)
      .eq('senha', password)
      .single();

    if (userError || !usuario) {
      throw new Error('Email ou senha inválidos');
    }

    // Armazenar dados do usuário
    localStorage.setItem('userData', JSON.stringify(usuario));
    localStorage.setItem('userToken', 'token-' + Date.now()); // Token simulado
    localStorage.setItem('userName', usuario.nome);

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
    // Limpar dados do usuário
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    
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
    
    return !!(userData && userToken);
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return false;
  }
};

export const getUsuarioAutenticado = (): Usuario | null => {
  try {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) return null;
    
    const userData: Usuario = JSON.parse(userDataString);
    return userData;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};
