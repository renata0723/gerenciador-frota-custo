
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { checkAuthStatus, getUsuarioAutenticado } from '@/services/auth/authService';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verificarAutenticacao = async () => {
      try {
        toast.dismiss('auth-redirect');
        
        // Verificar se o usuário está autenticado
        const authenticated = await checkAuthStatus();
        const usuarioString = localStorage.getItem('userData');
        const userToken = localStorage.getItem('userToken');
        
        console.log('Verificando autenticação:');
        console.log('- usuarioString:', !!usuarioString);
        console.log('- userToken:', !!userToken);
        console.log('- authenticated:', authenticated);
        
        // Para desenvolvimento, vamos considerar a autorização mais flexível
        if (!authenticated && !usuarioString && process.env.NODE_ENV === 'development') {
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
          localStorage.setItem('userName', adminTestUser.nome);
          localStorage.setItem('userId', String(adminTestUser.id));
          localStorage.setItem('userEmail', adminTestUser.email);
          
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // Verificar se é usuário válido
        if (authenticated) {
          try {
            const usuario = getUsuarioAutenticado();
            
            if (usuario && (usuario.id || usuario.email)) {
              console.log('Usuário autenticado:', usuario.nome);
              
              // Garantir que o nome do usuário esteja disponível
              if (usuario.nome && !localStorage.getItem('userName')) {
                localStorage.setItem('userName', usuario.nome);
              }
              
              setIsAuthenticated(true);
            } else {
              console.log('Dados de usuário inválidos');
              setIsAuthenticated(false);
              // Limpar dados de autenticação inválidos
              localStorage.removeItem('userData');
              localStorage.removeItem('userToken');
            }
          } catch (error) {
            console.error('Erro ao processar dados de autenticação:', error);
            setIsAuthenticated(false);
            // Limpar dados de autenticação com erro
            localStorage.removeItem('userData');
            localStorage.removeItem('userToken');
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
