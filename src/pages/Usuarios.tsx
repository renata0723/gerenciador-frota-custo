
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Edit, Key, Shield, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Usuario, StatusUsuario, Permissao, PermissaoUsuario } from '@/types/usuario';
import { getUsuarios, criarUsuario, atualizarUsuario, getPermissoes, getPermissoesUsuario, atribuirPermissao, removerPermissao } from '@/services/usuarioService';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [permissoesUsuario, setPermissoesUsuario] = useState<PermissaoUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [modalPermissaoOpen, setModalPermissaoOpen] = useState(false);
  const [usuarioAtual, setUsuarioAtual] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<Usuario>({
    nome: '',
    email: '',
    senha: '',
    cargo: '',
    status: 'ativo'
  });
  const [permissaoSelecionada, setPermissaoSelecionada] = useState<number | null>(null);

  useEffect(() => {
    carregarUsuarios();
    carregarPermissoes();
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

  const carregarPermissoes = async () => {
    try {
      const data = await getPermissoes();
      setPermissoes(data);
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      toast.error('Não foi possível carregar as permissões');
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (value: StatusUsuario) => {
    setFormData(prev => ({
      ...prev,
      status: value
    }));
  };

  const handleNovoUsuario = () => {
    setUsuarioAtual(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      cargo: '',
      status: 'ativo'
    });
    setModalUsuarioOpen(true);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setUsuarioAtual(usuario);
    setFormData({
      ...usuario,
      senha: '' // Não exibir senha atual por segurança
    });
    setModalUsuarioOpen(true);
  };

  const handleGerenciarPermissoes = (usuario: Usuario) => {
    setUsuarioAtual(usuario);
    carregarPermissoesUsuario(usuario.id!);
    setModalPermissaoOpen(true);
  };

  const handleSubmitUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.email) {
      toast.error('Nome e e-mail são obrigatórios');
      return;
    }
    
    // Se for novo usuário, senha é obrigatória
    if (!usuarioAtual && !formData.senha) {
      toast.error('Senha é obrigatória para novos usuários');
      return;
    }
    
    try {
      if (usuarioAtual) {
        // Editar usuário
        const dadosAtualizados: Partial<Usuario> = {
          nome: formData.nome,
          email: formData.email,
          cargo: formData.cargo,
          status: formData.status
        };
        
        // Incluir senha apenas se foi digitada
        if (formData.senha) {
          dadosAtualizados.senha = formData.senha;
        }
        
        await atualizarUsuario(usuarioAtual.id!, dadosAtualizados);
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

  const handleSubmitPermissao = async () => {
    if (!usuarioAtual || !permissaoSelecionada) {
      toast.error('Selecione uma permissão para adicionar');
      return;
    }
    
    try {
      // Verificar se a permissão já foi atribuída
      const permissaoExistente = permissoesUsuario.find(p => p.permissao_id === permissaoSelecionada);
      
      if (permissaoExistente) {
        toast.error('Esta permissão já foi atribuída ao usuário');
        return;
      }
      
      await atribuirPermissao(usuarioAtual.id!, permissaoSelecionada);
      toast.success('Permissão atribuída com sucesso!');
      carregarPermissoesUsuario(usuarioAtual.id!);
    } catch (error) {
      console.error('Erro ao atribuir permissão:', error);
      toast.error('Ocorreu um erro ao atribuir a permissão');
    }
  };

  const handleRemoverPermissao = async (permissaoId: number) => {
    try {
      await removerPermissao(permissaoId);
      toast.success('Permissão removida com sucesso!');
      carregarPermissoesUsuario(usuarioAtual!.id!);
    } catch (error) {
      console.error('Erro ao remover permissão:', error);
      toast.error('Ocorreu um erro ao remover a permissão');
    }
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
              placeholder="Buscar usuário por nome ou e-mail..." 
              className="max-w-md"
            />
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Último Acesso</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Carregando...</TableCell>
                </TableRow>
              ) : usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">Nenhum usuário encontrado</TableCell>
                </TableRow>
              ) : (
                usuarios.map((usuario) => (
                  <TableRow key={usuario.id}>
                    <TableCell className="font-medium">{usuario.nome}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.cargo || '-'}</TableCell>
                    <TableCell>
                      <span className={
                        usuario.status === 'ativo' 
                          ? 'text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs' 
                          : usuario.status === 'inativo'
                          ? 'text-gray-600 bg-gray-100 px-2 py-1 rounded-full text-xs'
                          : 'text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs'
                      }>
                        {usuario.status === 'ativo' ? 'Ativo' : usuario.status === 'inativo' ? 'Inativo' : 'Bloqueado'}
                      </span>
                    </TableCell>
                    <TableCell>{usuario.ultimo_acesso ? new Date(usuario.ultimo_acesso).toLocaleString('pt-BR') : 'Nunca acessou'}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditarUsuario(usuario)}
                          title="Editar Usuário"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleGerenciarPermissoes(usuario)}
                          title="Gerenciar Permissões"
                        >
                          <Key size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Modal de Usuário */}
      <Dialog open={modalUsuarioOpen} onOpenChange={setModalUsuarioOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{usuarioAtual ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitUsuario} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome*</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">{usuarioAtual ? 'Nova Senha (opcional)' : 'Senha*'}</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                required={!usuarioAtual}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleStatusChange(value as StatusUsuario)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="bloqueado">Bloqueado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setModalUsuarioOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Modal de Permissões */}
      <Dialog open={modalPermissaoOpen} onOpenChange={setModalPermissaoOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield size={20} />
              Gerenciar Permissões - {usuarioAtual?.nome}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="atribuidas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="atribuidas">Permissões Atribuídas</TabsTrigger>
              <TabsTrigger value="adicionar">Adicionar Permissão</TabsTrigger>
            </TabsList>
            
            <TabsContent value="atribuidas" className="space-y-4 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Módulo</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead className="text-right">Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissoesUsuario.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Nenhuma permissão atribuída a este usuário
                      </TableCell>
                    </TableRow>
                  ) : (
                    permissoesUsuario.map((permissao) => (
                      <TableRow key={permissao.id}>
                        <TableCell>{permissao.modulo}</TableCell>
                        <TableCell>{permissao.acao}</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoverPermissao(permissao.id!)}
                          >
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="adicionar" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="permissao">Selecione uma permissão</Label>
                  <Select
                    value={permissaoSelecionada?.toString() || ''}
                    onValueChange={(value) => setPermissaoSelecionada(parseInt(value))}
                  >
                    <SelectTrigger id="permissao">
                      <SelectValue placeholder="Selecione uma permissão" />
                    </SelectTrigger>
                    <SelectContent>
                      {permissoes.map((permissao) => (
                        <SelectItem key={permissao.id} value={permissao.id!.toString()}>
                          {permissao.modulo} - {permissao.acao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleSubmitPermissao}
                  disabled={!permissaoSelecionada}
                >
                  <UserCheck size={18} />
                  Atribuir Permissão
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Usuarios;
