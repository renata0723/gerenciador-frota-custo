
import React from 'react';
import { User, Shield, Pencil, Trash, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Usuario } from '@/types/usuario';

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onGerenciarPermissoes: (usuario: Usuario) => void;
  onDesativar: (usuario: Usuario) => void;
  loading?: boolean;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  onEditar,
  onGerenciarPermissoes,
  onDesativar,
  loading = false
}) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativo':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5" />
            Ativo
          </Badge>
        );
      case 'inativo':
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5" />
            Inativo
          </Badge>
        );
      case 'bloqueado':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
            <AlertCircle className="h-3.5 w-3.5" />
            Bloqueado
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum usuário encontrado com os filtros selecionados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
          {usuarios.map((usuario) => (
            <TableRow key={usuario.id}>
              <TableCell>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                  <span className="font-medium">{usuario.nome}</span>
                </div>
              </TableCell>
              <TableCell>{usuario.email}</TableCell>
              <TableCell>{usuario.cargo || '-'}</TableCell>
              <TableCell>{getStatusBadge(usuario.status)}</TableCell>
              <TableCell>
                {usuario.ultimo_acesso 
                  ? new Date(usuario.ultimo_acesso).toLocaleDateString('pt-BR')
                  : 'Nunca acessou'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onGerenciarPermissoes(usuario)}
                    className="h-8 px-2"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="sr-only">Permissões</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditar(usuario)}
                    className="h-8 px-2"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  {usuario.status === 'ativo' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onDesativar(usuario)}
                      className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Desativar</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsuariosTable;
