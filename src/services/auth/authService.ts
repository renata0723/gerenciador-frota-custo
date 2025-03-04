
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: LoginCredentials) => {
  try {
    console.log('Modo de desenvolvimento: simulando login com:', email);
    
    // No modo de desenvolvimento, podemos retornar um usuário simulado
    const usuarioSimulado: Usuario = {
      id: 9999,
      nome: 'Administrador',
      email: 'admin@slog.com.br',
      cargo: 'Administrador',
      status: 'ativo',
      ultimo_acesso: new Date().toISOString()
    };

    // Armazenar dados do usuário de forma consistente
    localStorage.setItem('userData', JSON.stringify(usuarioSimulado));
    localStorage.setItem('userToken', 'token-' + Date.now());
    localStorage.setItem('userName', usuarioSimulado.nome);
    localStorage.setItem('userEmail', usuarioSimulado.email);
    localStorage.setItem('userId', String(usuarioSimulado.id));

    console.log('Login em modo de desenvolvimento realizado com sucesso:', usuarioSimulado.nome);
    return usuarioSimulado;
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
  // No modo de desenvolvimento, sempre retornamos true para simular um usuário autenticado
  return true;
};

export const getUsuarioAutenticado = (): Usuario | null => {
  try {
    const userDataString = localStorage.getItem('userData');
    
    // Se não tiver dados no localStorage, criar um usuário simulado para desenvolvimento
    if (!userDataString) {
      console.log('Modo de desenvolvimento: criando usuário simulado');
      const usuarioSimulado: Usuario = {
        id: 9999,
        nome: 'Administrador',
        email: 'admin@slog.com.br',
        cargo: 'Administrador',
        status: 'ativo',
        ultimo_acesso: new Date().toISOString()
      };
      
      localStorage.setItem('userData', JSON.stringify(usuarioSimulado));
      localStorage.setItem('userToken', 'token-simulado-dev');
      localStorage.setItem('userName', usuarioSimulado.nome);
      localStorage.setItem('userId', String(usuarioSimulado.id));
      localStorage.setItem('userEmail', usuarioSimulado.email);
      
      return usuarioSimulado;
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
