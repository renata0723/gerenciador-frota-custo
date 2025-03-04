
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { autenticarUsuario } from '@/services/usuarioService';
import { logOperation } from '@/utils/logOperations';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar se já está autenticado
    const token = localStorage.getItem('userToken');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const usuario = await autenticarUsuario(email, senha);
      
      if (usuario) {
        localStorage.setItem('userToken', 'token-simulado');
        localStorage.setItem('userData', JSON.stringify(usuario));
        
        // Registrar operação de login bem-sucedida
        logOperation('Login', 'Login bem-sucedido', 'true');
        
        // Navegação sem exibir toast
        navigate('/');
      } else {
        toast.error('Usuário ou senha incorretos');
        logOperation('Login', 'Tentativa de login com credenciais inválidas', 'false');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      toast.error('Ocorreu um erro ao tentar fazer login');
      logOperation('Login', 'Erro ao tentar fazer login', 'false');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center p-8">
          <div className="w-full text-center mb-6">
            <h1 className="text-2xl font-bold text-sistema-primary">Controladoria de Custo</h1>
            <h2 className="text-lg mt-2">Sistema de Gestão de Frota</h2>
            <p className="text-sm text-gray-500 mt-2">Faça login para acessar o sistema</p>
          </div>
          
          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="senha">Senha</Label>
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info('Funcionalidade em implementação');
                  }}
                  className="text-sm text-sistema-primary hover:underline"
                >
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-sistema-primary hover:bg-sistema-primary/90"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Usuário de demonstração: admin@slog.com.br / senha123</p>
          </div>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            © 2025 SLog Controladoria - Todos os direitos reservados
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
