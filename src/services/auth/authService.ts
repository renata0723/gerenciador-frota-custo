
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const signIn = async ({ email, password }: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data?.user) {
      // Armazenar dados do usuário
      localStorage.setItem('userId', data.user.id);
      localStorage.setItem('userEmail', data.user.email || '');
      return data;
    }

    throw new Error('Falha na autenticação');
  } catch (error: any) {
    let message = 'Erro ao fazer login';
    if (error.message === 'Invalid login credentials') {
      message = 'Email ou senha inválidos';
    }
    toast.error(message);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Limpar dados do usuário
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    toast.error('Erro ao fazer logout');
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
};
