
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';

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
      localStorage.setItem('userToken', data.session?.access_token || '');
      
      // Buscar informações adicionais do usuário no banco
      const { data: userData, error: userError } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .single();
      
      if (!userError && userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        console.log('Dados do usuário armazenados:', userData);
        
        // Atualizar último acesso
        await supabase
          .from('Usuarios')
          .update({ ultimo_acesso: new Date().toISOString() })
          .eq('id', userData.id);
      } else {
        // Se estamos em desenvolvimento, criar um usuário de teste
        if (process.env.NODE_ENV === 'development') {
          const testUser: Usuario = {
            id: 9999,
            nome: 'Usuário de Teste',
            email: email,
            cargo: 'Operador',
            status: 'ativo',
            ultimo_acesso: new Date().toISOString()
          };
          localStorage.setItem('userData', JSON.stringify(testUser));
          console.log('Usuário de teste criado para desenvolvimento');
        } else {
          console.log('Usuário autenticado, mas não encontrado na tabela Usuarios');
        }
      }
      
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
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    // Se temos uma sessão ativa, vamos garantir que temos todos os dados do usuário
    if (session) {
      const userEmail = session.user.email;
      const userId = session.user.id;
      
      // Verificar se já temos os dados do usuário
      const userData = localStorage.getItem('userData');
      if (!userData) {
        // Buscar informações adicionais do usuário no banco
        const { data: userDetails, error: userError } = await supabase
          .from('Usuarios')
          .select('*')
          .eq('email', userEmail)
          .single();
        
        if (!userError && userDetails) {
          localStorage.setItem('userData', JSON.stringify(userDetails));
          localStorage.setItem('userName', userDetails.nome);
        }
      }
      
      // Atualizar token se necessário
      localStorage.setItem('userId', userId);
      localStorage.setItem('userEmail', userEmail || '');
      localStorage.setItem('userToken', session?.access_token || '');
    }
    
    return session;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return null;
  }
};

// Função para obter o usuário autenticado
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
