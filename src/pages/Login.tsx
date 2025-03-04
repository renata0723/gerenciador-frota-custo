
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { signIn, checkAuthStatus } from '@/services/auth/authService';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  useEffect(() => {
    const verificarSessao = async () => {
      try {
        toast.dismiss('auth-redirect');
        
        const isAutenticado = await checkAuthStatus();
        if (isAutenticado) {
          console.log('Usuário já autenticado, redirecionando...');
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    verificarSessao();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);

    try {
      await signIn({ email, password });
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      console.error('Erro de login:', error);
      toast.error(error.message || 'Falha no login, tente novamente');
    } finally {
      setLoading(false);
    }
  };

  // Login automático para desenvolvimento
  const handleFastLogin = async (preset: 'admin') => {
    setLoading(true);
    try {
      if (preset === 'admin') {
        await signIn({ email: 'admin@slog.com.br', password: 'admin123' });
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no login automático:', error);
      toast.error('Falha no login automático, tente manualmente');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-600">
            Controladoria de Custo
          </CardTitle>
          <CardDescription className="text-lg font-semibold text-gray-700">
            Sistema de Gestão de Frota
          </CardDescription>
          <p className="mt-2 text-gray-600">
            Faça login para acessar o sistema
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="Digite sua senha"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            
            <div className="mt-4 space-y-4">
              <div className="text-sm text-gray-500 text-center">
                <p>Credenciais para teste:</p>
                <p>Email: admin@slog.com.br</p>
                <p>Senha: admin123</p>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => handleFastLogin('admin')}
                disabled={loading}
              >
                Entrar como Administrador
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
