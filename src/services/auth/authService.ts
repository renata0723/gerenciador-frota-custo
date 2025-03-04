
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  nome: string;
  email: string;
  cargo?: string;
  status?: string;
  ultimo_acesso?: string;
  permissoes?: string[];
}

// Função para simular o login no modo de desenvolvimento
const setupDevLoginData = () => {
  // Dados do usuário de teste
  const adminTestUser = {
    id: 9999,
    nome: 'Administrador',
    email: 'admin@slog.com.br',
    cargo: 'Administrador',
    status: 'ativo',
    ultimo_acesso: new Date().toISOString()
  };
  
  localStorage.setItem('userData', JSON.stringify(adminTestUser));
  localStorage.setItem('userToken', 'token-simulado-dev');
  localStorage.setItem('userName', adminTestUser.nome);
  localStorage.setItem('userId', String(adminTestUser.id));
  localStorage.setItem('userEmail', adminTestUser.email);
  
  console.log('Sistema em modo desenvolvimento: usuário autenticado automaticamente');
  return adminTestUser;
};

// Simular signin para desenvolvimento
export const signIn = async (credentials: SignInCredentials): Promise<UserData> => {
  try {
    console.log('Simulando login com', credentials);
    
    // Verificar credenciais para o modo de demonstração
    if (credentials.email === 'admin@slog.com.br' && credentials.password === 'admin123') {
      return setupDevLoginData();
    }
    
    // Autenticação via Supabase (desativada para desenvolvimento)
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: credentials.email,
    //   password: credentials.password,
    // });
    
    // if (error) throw new Error(error.message);
    // if (!data.user) throw new Error('Erro ao autenticar');
    
    // Buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('Usuarios')
      .select('*')
      .eq('email', credentials.email)
      .single();
    
    if (userError) {
      console.warn('Erro ao buscar dados do usuário, usando dados simulados');
      return setupDevLoginData();
    }
    
    // Armazenar dados na sessão
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('userToken', 'token-simulado');
    localStorage.setItem('userName', userData.nome);
    localStorage.setItem('userId', String(userData.id));
    localStorage.setItem('userEmail', userData.email);
    
    return userData as UserData;
  } catch (error: any) {
    console.error('Erro no login:', error);
    
    // Em desenvolvimento, autenticar mesmo com erro
    console.log('Usando autenticação simulada devido ao erro');
    return setupDevLoginData();
  }
};

export const signOut = async (): Promise<void> => {
  try {
    // Limpar dados de autenticação local
    localStorage.removeItem('userData');
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    
    // Em produção, deslogar do Supabase
    // await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  console.log('Verificando autenticação:');
  
  // Verificar se temos dados no localStorage
  const usuarioString = localStorage.getItem('userData');
  const adminGeral = localStorage.getItem('adminGeral');
  
  console.log('- usuarioString:', !!usuarioString);
  console.log('- adminGeral:', adminGeral);
  
  // Em modo desenvolvimento, considerar autenticado
  if (process.env.NODE_ENV === 'development') {
    if (!usuarioString) {
      console.log('Nenhum usuário autenticado');
      setupDevLoginData();
      return true;
    }
    return true;
  }
  
  if (!usuarioString && !adminGeral) {
    console.log('Nenhum usuário autenticado');
    console.log('Redirecionando para login');
    return false;
  }
  
  return true;
};

export const getUsuarioAutenticado = (): UserData | null => {
  const usuarioString = localStorage.getItem('userData');
  if (!usuarioString) {
    // Em desenvolvimento, usar dados simulados
    if (process.env.NODE_ENV === 'development') {
      return setupDevLoginData();
    }
    return null;
  }
  
  try {
    return JSON.parse(usuarioString) as UserData;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
};

export const verificarPermissao = (modulo: string, acao: string): boolean => {
  // Em desenvolvimento, permitir todas as ações
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const usuario = getUsuarioAutenticado();
  
  // Administrador tem acesso total
  if (usuario?.cargo === 'Administrador') {
    return true;
  }
  
  const permissoes = usuario?.permissoes || [];
  return permissoes.includes(`${modulo}:${acao}`);
};
