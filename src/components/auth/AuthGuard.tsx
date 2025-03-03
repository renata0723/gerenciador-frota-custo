
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const usuarioString = sessionStorage.getItem('usuario');
    const adminGeral = sessionStorage.getItem('adminGeral');
    
    // Verificar se é usuário ou admin
    if (usuarioString) {
      try {
        const usuario: Usuario = JSON.parse(usuarioString);
        
        if (usuario && usuario.id) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao processar dados de autenticação:', error);
        setIsAuthenticated(false);
      }
    } else if (adminGeral === 'true') {
      // Se for administrador geral
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    // Mostrando um indicador de carregamento
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionando para a página de login
    toast.info('Faça login para acessar o sistema', {
      id: 'auth-redirect',
    });
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
