
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Lock, LogIn, User, ShieldAlert } from 'lucide-react';
import { autenticarUsuario } from '@/services/usuarioService';
import { autenticarAdministradorGeral } from '@/services/administradorService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('usuario');
  const navigate = useNavigate();

  const handleUsuarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      const usuario = await autenticarUsuario(email, senha);
      
      if (usuario) {
        toast.success(`Bem-vindo, ${usuario.nome}!`);
        
        // Armazenar usuário na sessão
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        
        // Redirecionar para a página inicial
        navigate('/');
      } else {
        toast.error('E-mail ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao autenticar:', error);
      toast.error('Ocorreu um erro ao tentar fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      const autenticado = await autenticarAdministradorGeral({ email, senha });
      
      if (autenticado) {
        toast.success('Bem-vindo, Administrador Geral!');
        
        // Armazenar estado de administrador na sessão
        sessionStorage.setItem('adminGeral', 'true');
        
        // Redirecionar para a página inicial
        navigate('/');
      } else {
        toast.error('Credenciais de administrador inválidas');
      }
    } catch (error) {
      console.error('Erro ao autenticar administrador:', error);
      toast.error('Ocorreu um erro ao tentar fazer login como administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                <Lock className="text-white h-8 w-8" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">ControlFrota</CardTitle>
            <CardDescription className="text-center">
              Sistema de Gerenciamento de Frota e Logística
            </CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="usuario">Usuário</TabsTrigger>
                <TabsTrigger value="admin">Administrador</TabsTrigger>
              </TabsList>
            </div>
            
            <CardContent className="pt-6">
              <TabsContent value="usuario">
                <form onSubmit={handleUsuarioSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="senha">Senha</Label>
                      <Button variant="link" className="p-0 h-auto text-xs" type="button">
                        Esqueceu a senha?
                      </Button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <span className="animate-spin">◌</span>
                        Autenticando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        Entrar
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Acesso restrito</h4>
                      <p className="text-sm text-blue-700">
                        Área reservada para administradores do sistema.
                      </p>
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleAdminSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">E-mail administrador</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="admin@controlfrota.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminSenha">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="adminSenha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" variant="destructive" disabled={loading}>
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <span className="animate-spin">◌</span>
                        Autenticando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" />
                        Acessar como Administrador
                      </div>
                    )}
                  </Button>
                  
                  <div className="text-xs text-center text-gray-500 mt-2">
                    <p>E-mail padrão: admin@controlfrota.com.br</p>
                    <p>Senha padrão: admin123</p>
                  </div>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
          
          <CardFooter className="text-center text-sm text-gray-600">
            © 2023 ControlFrota - Todos os direitos reservados
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
