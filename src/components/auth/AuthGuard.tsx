
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAdminUser } from '@/services/auth/authService';

// Este componente agora simplesmente garante que o usuário está logado automaticamente
const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Garantir que o usuário está autenticado
    const userData = localStorage.getItem('userData');
    if (!userData) {
      // Se não estiver autenticado, autenticar automaticamente
      setupAdminUser();
    }
  }, [navigate]);

  // Sempre renderizar o conteúdo, não há mais redirecionamento para login
  return <>{children}</>;
};

export const setupAdminUser = () => {
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

export default AuthGuard;
