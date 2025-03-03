
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { autenticarUsuario } from '@/services/usuarioService';
import { verificarAdministrador } from '@/services/administradorService';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Autenticar o usuário
      const usuario = await autenticarUsuario(email, senha);
      
      if (!usuario) {
        toast.error('Email ou senha incorretos');
        setLoading(false);
        return;
      }
      
      // Verificar se é administrador
      const admin = await verificarAdministrador(usuario.id!);
      
      // Armazenar dados do usuário na sessão
      sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
      if (admin) {
        sessionStorage.setItem('adminGeral', 'true');
      }
      
      toast.success(`Bem-vindo, ${usuario.nome}!`);
      navigate('/');
    } catch (error) {
      console.error('Erro no login:', error);
      toast.error('Ocorreu um erro ao tentar fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Controladoria</CardTitle>
          <CardDescription>
            Sistema de Controle de Frotas e Logística
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="senha">Senha</Label>
                </div>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          © {new Date().getFullYear()} Controladoria - Todos os direitos reservados
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
