
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Usuario } from '@/types/usuario';
import UsuariosTable from './UsuariosTable';

interface UsuariosContentProps {
  usuarios: Usuario[];
  loading: boolean;
  onEditar: (usuario: Usuario) => void;
  onGerenciarPermissoes: (usuario: Usuario) => void;
  onDesativar: (usuario: Usuario) => void;
  onNovoUsuario: () => void;
}

const UsuariosContent: React.FC<UsuariosContentProps> = ({
  usuarios,
  loading,
  onEditar,
  onGerenciarPermissoes,
  onDesativar,
  onNovoUsuario
}) => {
  if (usuarios.length === 0 && !loading) {
    return (
      <Alert>
        <AlertDescription className="flex flex-col items-center py-4">
          <Users className="h-12 w-12 text-gray-300 mb-2" />
          <h3 className="text-lg font-medium">Nenhum usuário cadastrado</h3>
          <p className="text-sm text-gray-500 mb-4">Cadastre o primeiro usuário para começar</p>
          <Button onClick={onNovoUsuario}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Usuário
          </Button>
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <UsuariosTable 
      usuarios={usuarios}
      onEditar={onEditar}
      onGerenciarPermissoes={onGerenciarPermissoes}
      onDesativar={onDesativar}
      loading={loading}
    />
  );
};

export default UsuariosContent;
