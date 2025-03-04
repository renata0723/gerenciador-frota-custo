
import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Search, 
  UserPlus, 
  Users, 
  Shield, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { Usuario, PermissaoUsuario } from '@/types/usuario';
import { getUsuarios, criarUsuario, atualizarUsuario, getPermissoesUsuario, atribuirPermissao, removerPermissao } from '@/services/usuarioService';
import UsuarioForm from '@/components/usuarios/UsuarioForm';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import PermissaoUsuarioForm from '@/components/usuarios/PermissaoUsuarioForm';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoesUsuario, setPermissoesUsuario] = useState<PermissaoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [modalPermissaoOpen, setModalPermissaoOpen] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [filtro, setFiltro] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Não foi possível carregar os usuários');
    } finally {
      setLoading(false);
    }
  };

  const carregarPermissoesUsuario = async (usuarioId: number) => {
    try {
      const data = await getPermissoesUsuario(usuarioId);
      setPermissoesUsuario(data);
    } catch (error) {
      console.error('Erro ao carregar permissões do usuário:', error);
      toast.error('Não foi possível carregar as permissões do usuário');
    }
  };

  const handleNovoUsuario = () => {
    setUsuarioAtual(null);
    setModalUsuarioOpen(true);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioAtual(usuario);
    setModalUsuarioOpen(true);
  };

  const handleGerenciarPermissoes = (usuario: Usuario) => {
    setUsuarioAtual(usuario);
    carregarPermissoesUsuario(usuario.id!);
    setModalPermissaoOpen(true);
  };

  const handleDesativarUsuario = async (usuario: Usuario) => {
    if (!usuario.id) return;
    
    const confirmar = window.confirm(`Deseja realmente desativar o usuário ${usuario.nome}?`);
    if (!confirmar) return;
    
    try {
      await atualizarUsuario(usuario.id, { status: 'inativo' });
      toast.success('Usuário desativado com sucesso!');
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      toast.error('Ocorreu um erro ao desativar o usuário');
    }
  };

  const handleSubmitUsuario = async (formData: Usuario) => {
    try {
      if (usuarioAtual?.id) {
        // Editar usuário
        await atualizarUsuario(usuarioAtual.id, formData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Novo usuário
        await criarUsuario(formData);
        toast.success('Usuário criado com sucesso!');
      }
      
      setModalUsuarioOpen(false);
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Ocorreu um erro ao salvar o usuário');
    }
  };

  const handleSubmitPermissoes = async (permissoesSelecionadas: number[]) => {
    if (!usuarioAtual?.id) {
      toast.error('Usuário não encontrado');
      return;
    }
    
    try {
      // 1. Verificar quais permissões existem e precisam ser removidas
      const permissoesParaRemover = permissoesUsuario.filter(
        p => !permissoesSelecionadas.includes(p.permissao_id)
      );
      
      // 2. Verificar quais permissões precisam ser adicionadas
      const permissoesExistentesIds = permissoesUsuario.map(p => p.permissao_id);
      const permissoesParaAdicionar = permissoesSelecionadas.filter(
        id => !permissoesExistentesIds.includes(id)
      );
      
      // 3. Remover permissões desnecessárias
      const promisesRemocao = permissoesParaRemover.map(p => 
        removerPermissao(p.id!)
      );
      
      // 4. Adicionar novas permissões
      const promisesAdicao = permissoesParaAdicionar.map(permissaoId => 
        atribuirPermissao(usuarioAtual.id!, permissaoId)
      );
      
      // Executar todas as operações
      await Promise.all([...promisesRemocao, ...promisesAdicao]);
      
      toast.success('Permissões atualizadas com sucesso!');
      setModalPermissaoOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toast.error('Ocorreu um erro ao atualizar as permissões');
    }
  };

  const filtrarUsuarios = () => {
    let usuariosFiltrados = usuarios;
    
    // Filtrar por texto
    if (filtro) {
      const termoBusca = filtro.toLowerCase();
      usuariosFiltrados = usuariosFiltrados.filter(usuario => 
        usuario.nome.toLowerCase().includes(termoBusca) || 
        usuario.email.toLowerCase().includes(termoBusca) ||
        (usuario.cargo && usuario.cargo.toLowerCase().includes(termoBusca))
      );
    }
    
    // Filtrar por tab
    if (activeTab !== 'todos') {
      usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.status === activeTab);
    }
    
    return usuariosFiltrados;
  };

  return (
    <NewPageLayout>
      <PageHeader 
        title="Usuários" 
        description="Gerenciamento de usuários e permissões do sistema"
        icon={<Users className="h-6 w-6 text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Usuários' }
        ]}
        actions={
          <Button onClick={handleNovoUsuario} className="flex items-center gap-2">
            <UserPlus size={18} />
            <span>Novo Usuário</span>
          </Button>
        }
      />
      
      <div className="mt-6 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>
              Cadastre e gerencie os usuários do sistema e suas permissões de acesso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input 
                  placeholder="Buscar usuário por nome, e-mail ou cargo..." 
                  className="pl-10"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="todos">Todos</TabsTrigger>
                  <TabsTrigger value="ativo">Ativos</TabsTrigger>
                  <TabsTrigger value="inativo">Inativos</TabsTrigger>
                  <TabsTrigger value="bloqueado">Bloqueados</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {usuarios.length === 0 && !loading ? (
              <Alert>
                <AlertDescription className="flex flex-col items-center py-4">
                  <Users className="h-12 w-12 text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium">Nenhum usuário cadastrado</h3>
                  <p className="text-sm text-gray-500 mb-4">Cadastre o primeiro usuário para começar</p>
                  <Button onClick={handleNovoUsuario}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <UsuariosTable 
                usuarios={filtrarUsuarios()}
                onEditar={handleEditarUsuario}
                onGerenciarPermissoes={handleGerenciarPermissoes}
                onDesativar={handleDesativarUsuario}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Modal de Usuário */}
      <Dialog open={modalUsuarioOpen} onOpenChange={setModalUsuarioOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{usuarioAtual ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          
          <UsuarioForm 
            onSave={handleSubmitUsuario}
            initialData={usuarioAtual || undefined}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de Permissões */}
      <Dialog open={modalPermissaoOpen} onOpenChange={setModalPermissaoOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Gerenciar Permissões - {usuarioAtual?.nome}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="permissoes" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="permissoes">Permissões de Acesso</TabsTrigger>
            </TabsList>
            
            <TabsContent value="permissoes" className="space-y-4 py-4">
              <PermissaoUsuarioForm 
                usuarioId={usuarioAtual?.id || 0}
                onSave={handleSubmitPermissoes}
                permissoesAtuais={permissoesUsuario.map(p => p.permissao_id)}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </NewPageLayout>
  );
};

export default Usuarios;
