
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
        const session = await checkAuthStatus();
        if (session) {
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
    setLoading(true);

    try {
      await signIn({ email, password });
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error: any) {
      // Erro já tratado no serviço
      console.error('Erro de login:', error);
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <a 
                  href="#" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Funcionalidade em desenvolvimento');
                  }}
                >
                  Esqueceu a senha?
                </a>
              </div>
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
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 text-sm text-gray-500 text-center">
                <p>Credenciais para teste:</p>
                <p>Email: operador@slog.com.br</p>
                <p>Senha: slog123</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
