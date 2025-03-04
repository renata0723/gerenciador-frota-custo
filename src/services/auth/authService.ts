
import { supabase } from '@/integrations/supabase/client';

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

// Função para configurar os dados de autenticação (sempre autenticado)
const setupAdminUser = () => {
  // Dados do usuário administrador
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
  
  console.log('Sistema configurado com usuário administrador');
  return adminTestUser;
};

// Sempre autenticar como administrador
export const signIn = async (credentials?: SignInCredentials): Promise<UserData> => {
  console.log('Login automático realizado');
  return setupAdminUser();
};

export const signOut = async (): Promise<void> => {
  try {
    console.log('Logout realizado, mas usuário será autenticado novamente');
    setupAdminUser(); // Autenticar novamente ao fazer logout
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
  }
};

export const checkAuthStatus = async (): Promise<boolean> => {
  console.log('Verificando autenticação (sempre retorna true)');
  
  // Verificar se temos dados no localStorage
  const usuarioString = localStorage.getItem('userData');
  
  // Se não tiver usuário, configuramos automaticamente
  if (!usuarioString) {
    console.log('Configurando usuário administrador automaticamente');
    setupAdminUser();
  }
  
  return true; // Sempre retornar autenticado
};

export const getUsuarioAutenticado = (): UserData => {
  const usuarioString = localStorage.getItem('userData');
  if (!usuarioString) {
    return setupAdminUser();
  }
  
  try {
    return JSON.parse(usuarioString) as UserData;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return setupAdminUser();
  }
};

export const verificarPermissao = (modulo: string, acao: string): boolean => {
  // Sempre permitir todas as ações
  return true;
};
