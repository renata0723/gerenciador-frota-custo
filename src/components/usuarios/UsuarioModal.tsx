
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Usuario } from '@/types/usuario';
import UsuarioForm from './UsuarioForm';
import { toast } from 'sonner';

interface UsuarioModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  usuario: Usuario | null;
  onUsuarioSalvo: () => void;
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({
  isOpen,
  onOpenChange,
  usuario,
  onUsuarioSalvo
}) => {
  const handleSubmitUsuario = async (formData: Usuario) => {
    try {
      const { criarUsuario, atualizarUsuario } = await import('@/services/usuarios');
      
      if (usuario?.id) {
        // Editar usuário
        await atualizarUsuario(usuario.id, formData);
        toast.success('Usuário atualizado com sucesso!');
      } else {
        // Novo usuário
        await criarUsuario(formData);
        toast.success('Usuário criado com sucesso!');
      }
      
      onOpenChange(false);
      onUsuarioSalvo();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast.error('Ocorreu um erro ao salvar o usuário');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{usuario ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
        </DialogHeader>
        
        <UsuarioForm 
          onSave={handleSubmitUsuario}
          initialData={usuario || undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UsuarioModal;
