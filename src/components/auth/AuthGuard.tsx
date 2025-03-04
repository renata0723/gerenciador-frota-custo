
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
    const verificarAutenticacao = () => {
      try {
        // Verificar se o usuário está autenticado
        const usuarioString = sessionStorage.getItem('usuario');
        const adminGeral = sessionStorage.getItem('adminGeral');
        
        console.log('Verificando autenticação:');
        console.log('- usuarioString:', !!usuarioString);
        console.log('- adminGeral:', adminGeral);
        
        // Para desenvolvimento, vamos criar uma sessão de teste se não existir
        if (!usuarioString && !adminGeral && process.env.NODE_ENV === 'development') {
          console.log('Criando sessão de desenvolvimento');
          sessionStorage.setItem('adminGeral', 'true');
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // Verificar se é usuário ou admin
        if (usuarioString) {
          try {
            const usuario: Usuario = JSON.parse(usuarioString);
            
            if (usuario && usuario.id) {
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
        } else if (adminGeral === 'true') {
          // Se for administrador geral
          console.log('Administrador geral autenticado');
          setIsAuthenticated(true);
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
