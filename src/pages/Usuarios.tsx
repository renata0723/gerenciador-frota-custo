
import React, { useState, useEffect } from 'react';
import NewPageLayout from '@/components/layout/NewPageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { toast } from 'sonner';
import { Usuario } from '@/types/usuario';
import { getUsuarios } from '@/services/usuarios';
import UsuariosSearch from '@/components/usuarios/UsuariosSearch';
import UsuariosContent from '@/components/usuarios/UsuariosContent';
import UsuarioModal from '@/components/usuarios/UsuarioModal';
import PermissoesModal from '@/components/usuarios/PermissoesModal';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
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
    setModalPermissaoOpen(true);
  };

  const handleDesativarUsuario = async (usuario: Usuario) => {
    if (!usuario.id) return;
    
    const confirmar = window.confirm(`Deseja realmente desativar o usuário ${usuario.nome}?`);
    if (!confirmar) return;
    
    try {
      const { atualizarUsuario } = await import('@/services/usuarios');
      await atualizarUsuario(usuario.id, { status: 'inativo' });
      toast.success('Usuário desativado com sucesso!');
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao desativar usuário:', error);
      toast.error('Ocorreu um erro ao desativar o usuário');
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
            <UsuariosSearch 
              filtro={filtro}
              setFiltro={setFiltro}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            
            <UsuariosContent 
              usuarios={filtrarUsuarios()}
              loading={loading}
              onEditar={handleEditarUsuario}
              onGerenciarPermissoes={handleGerenciarPermissoes}
              onDesativar={handleDesativarUsuario}
              onNovoUsuario={handleNovoUsuario}
            />
          </CardContent>
        </Card>
      </div>
      
      <UsuarioModal 
        isOpen={modalUsuarioOpen}
        onOpenChange={setModalUsuarioOpen}
        usuario={usuarioAtual}
        onUsuarioSalvo={carregarUsuarios}
      />
      
      <PermissoesModal 
        isOpen={modalPermissaoOpen}
        onOpenChange={setModalPermissaoOpen}
        usuario={usuarioAtual}
      />
    </NewPageLayout>
  );
};

export default Usuarios;
