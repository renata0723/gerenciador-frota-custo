
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield } from 'lucide-react';
import { Usuario, PermissaoUsuario } from '@/types/usuario';
import PermissaoUsuarioForm from './PermissaoUsuarioForm';
import { toast } from 'sonner';
import { getPermissoesUsuario, atribuirPermissao, removerPermissao } from '@/services/usuarios';

interface PermissoesModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
}

const PermissoesModal: React.FC<PermissoesModalProps> = ({
  isOpen,
  onOpenChange,
  usuario
}) => {
  const [permissoesUsuario, setPermissoesUsuario] = useState<PermissaoUsuario[]>([]);
  
  useEffect(() => {
    if (isOpen && usuario?.id) {
      carregarPermissoesUsuario(usuario.id);
    }
  }, [isOpen, usuario]);
  
  const carregarPermissoesUsuario = async (usuarioId: number) => {
    try {
      const data = await getPermissoesUsuario(usuarioId);
      setPermissoesUsuario(data);
    } catch (error) {
      console.error('Erro ao carregar permissões do usuário:', error);
      toast.error('Não foi possível carregar as permissões do usuário');
    }
  };
  
  const handleSubmitPermissoes = async (permissoesSelecionadas: number[]) => {
    if (!usuario?.id) {
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
        atribuirPermissao(usuario.id!, permissaoId)
      );
      
      // Executar todas as operações
      await Promise.all([...promisesRemocao, ...promisesAdicao]);
      
      toast.success('Permissões atualizadas com sucesso!');
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error);
      toast.error('Ocorreu um erro ao atualizar as permissões');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Gerenciar Permissões - {usuario?.nome}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="permissoes" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="permissoes">Permissões de Acesso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissoes" className="space-y-4 py-4">
            <PermissaoUsuarioForm 
              usuarioId={usuario?.id || 0}
              onSave={handleSubmitPermissoes}
              permissoesAtuais={permissoesUsuario.map(p => p.permissao_id)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PermissoesModal;
