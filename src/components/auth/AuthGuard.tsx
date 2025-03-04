
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

export default AuthGuard;
