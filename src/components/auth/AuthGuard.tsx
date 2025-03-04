
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';
import { getUsuarioAutenticado } from '@/services/auth/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verificarAutenticacao = () => {
      try {
        // Verificar se o usuário está autenticado
        const usuarioString = localStorage.getItem('userData');
        const userToken = localStorage.getItem('userToken');
        
        console.log('Verificando autenticação:');
        console.log('- userData:', !!usuarioString);
        console.log('- userToken:', !!userToken);
        
        // Para desenvolvimento, vamos criar uma sessão de teste se não existir
        if (!usuarioString && !userToken && process.env.NODE_ENV === 'development') {
          console.log('Criando sessão de desenvolvimento');
          
          // Criar um usuário administrador de teste para desenvolvimento
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
          
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // Verificar se é usuário válido
        if (usuarioString && userToken) {
          try {
            const usuario: Usuario = JSON.parse(usuarioString);
            
            if (usuario && (usuario.id || usuario.email)) {
              console.log('Usuário autenticado:', usuario.nome);
              setIsAuthenticated(true);
            } else {
              console.log('Dados de usuário inválidos');
              setIsAuthenticated(false);
            }
          } catch (error) {
            console.error('Erro ao processar dados de autenticação:', error);
            setIsAuthenticated(false);
          }
        } else {
          console.log('Nenhum usuário autenticado');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verificarAutenticacao();
  }, []);

  if (loading) {
    // Mostrando um indicador de carregamento
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirecionando para a página de login
    console.log('Redirecionando para login');
    toast.info('Faça login para acessar o sistema', {
      id: 'auth-redirect',
    });
    
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('Renderizando conteúdo protegido');
  return <>{children}</>;
};

export default AuthGuard;
