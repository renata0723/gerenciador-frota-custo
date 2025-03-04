
import React from 'react';
import { getUsuarioAutenticado } from '@/services/auth/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Durante o desenvolvimento, este componente apenas renderiza as crianças sem verificar autenticação
const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  React.useEffect(() => {
    // Verificar se já existe usuário simulado no localStorage
    const usuario = getUsuarioAutenticado();
    if (!usuario) {
      console.log('Modo de desenvolvimento: usuário simulado será criado pelo AuthGuard');
    } else {
      console.log('Modo de desenvolvimento: usuário encontrado no localStorage', usuario.nome);
    }
  }, []);

  // Modo desenvolvimento: sempre renderiza o conteúdo
  return <>{children}</>;
};

export default AuthGuard;
