
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Usuario, PermissaoUsuario } from '@/types/usuario';
import { getUsuarios, criarUsuario, atualizarUsuario, getPermissoesUsuario, atribuirPermissao, removerPermissao } from '@/services/usuarioService';
import UsuarioForm from '@/components/usuarios/UsuarioForm';
import UsuariosTable from '@/components/usuarios/UsuariosTable';
import PermissaoUsuarioForm from '@/components/usuarios/PermissaoUsuarioForm';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoesUsuario, setPermissoesUsuario] = useState<PermissaoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [modalPermissaoOpen, setModalPermissaoOpen] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [filtro, setFiltro] = useState('');

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
    if (!filtro) return usuarios;
    
    const termoBusca = filtro.toLowerCase();
    return usuarios.filter(usuario => 
      usuario.nome.toLowerCase().includes(termoBusca) || 
      usuario.email.toLowerCase().includes(termoBusca) ||
      (usuario.cargo && usuario.cargo.toLowerCase().includes(termoBusca))
    );
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Usuários" 
        description="Gerenciamento de usuários e permissões do sistema"
      />
      
      <div className="flex justify-end mb-6">
        <Button onClick={handleNovoUsuario} className="flex items-center gap-2">
          <PlusCircle size={18} />
          Novo Usuário
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <Input 
              placeholder="Buscar usuário por nome, e-mail ou cargo..." 
              className="max-w-md"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>
          
          <UsuariosTable 
            usuarios={filtrarUsuarios()}
            onEditar={handleEditarUsuario}
            onGerenciarPermissoes={handleGerenciarPermissoes}
            onDesativar={handleDesativarUsuario}
            loading={loading}
          />
        </CardContent>
      </Card>
      
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
            <DialogTitle>
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
    </PageLayout>
  );
};

export default Usuarios;
