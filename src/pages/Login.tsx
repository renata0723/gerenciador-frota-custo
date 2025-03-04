
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { autenticarUsuario } from '@/services/usuarioService';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const usuarioString = localStorage.getItem('auth_user');
    if (usuarioString) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !senha.trim()) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }
    
    setLoading(true);
    setErro(null);
    
    try {
      const usuario = await autenticarUsuario(email, senha);
      
      if (usuario) {
        // Remover a senha por questões de segurança
        const { senha, ...usuarioSemSenha } = usuario;
        
        // Salvar o usuário na localStorage
        localStorage.setItem('auth_user', JSON.stringify(usuarioSemSenha));
        
        // Verificar se é o primeiro acesso (admin padrão)
        if (email === 'admin@sistema.com' && senha === 'admin123') {
          toast.warning('Você está usando o usuário padrão. Por favor, altere a senha assim que possível.', {
            duration: 6000,
          });
        }
        
        toast.success('Login realizado com sucesso!');
        navigate('/');
      } else {
        setErro('E-mail ou senha incorretos.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErro('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/71799dec-cc99-4b56-acca-9a51cb405da0.png" 
            alt="SLog Controladoria" 
            className="mx-auto h-24 mb-4" 
          />
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Gestão de Frota</h2>
          <p className="text-gray-600 mt-1">Faça login para acessar o sistema</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais de acesso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {erro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="senha">Senha</Label>
                  <Button variant="link" className="p-0 h-auto text-xs" type="button">
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} SLog Controladoria - Todos os direitos reservados
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
