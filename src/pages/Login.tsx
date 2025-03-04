
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { EMPRESA_NOME, EMPRESA_CNPJ, ANO_ATUAL } from '@/utils/constants';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Tentando login com:', email);
      
      // Esta implementação é simplificada. Em um sistema real, usaríamos autenticação segura.
      const { data, error } = await supabase
        .from('Usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', password)
        .eq('status', 'ativo')
        .single();

      if (error || !data) {
        console.error('Erro de login:', error);
        toast.error('Credenciais inválidas. Verifique seu email e senha.');
        return;
      }

      // Registrar o último acesso
      await supabase
        .from('Usuarios')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('id', data.id);

      // Guardar informações do usuário em localStorage (em um sistema real usaríamos métodos mais seguros)
      localStorage.setItem('auth_user', JSON.stringify(data));
      localStorage.setItem('auth_token', 'simulated-jwt-token');

      toast.success('Login realizado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      toast.error('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-500 mb-2">{EMPRESA_NOME}</h1>
          <h2 className="text-lg text-gray-600">Sistema de Controle de Frotas e Logística</h2>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© {ANO_ATUAL} {EMPRESA_NOME} - CNPJ: {EMPRESA_CNPJ} - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
