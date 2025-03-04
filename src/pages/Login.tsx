
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verificar login - simplificado para demonstração
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .single();

      if (error || !data) {
        toast.error('Email ou senha incorretos. Tente novamente.');
      } else {
        // Set session/auth info in localStorage or context
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('authenticated', 'true');
        localStorage.setItem('userName', data.nome);
        
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md space-y-8 p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-700">Controladoria de Custo</h1>
          <h2 className="mt-2 text-lg font-medium text-gray-900">Sistema de Gestão de Frota</h2>
          <p className="mt-2 text-sm text-gray-600">Faça login para acessar o sistema</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Senha</Label>
                <a href="#" className="text-sm text-blue-500 hover:text-blue-600">
                  Esqueceu a senha?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">Usuário de demonstração: admin@slog.com.br / senha123</p>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 SLog Controladoria - Todos os direitos reservados</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
