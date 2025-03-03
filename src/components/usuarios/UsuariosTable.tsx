
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Key, UserX } from 'lucide-react';
import { Usuario } from '@/types/usuario';

interface UsuariosTableProps {
  usuarios: Usuario[];
  onEditar: (usuario: Usuario) => void;
  onGerenciarPermissoes: (usuario: Usuario) => void;
  onDesativar?: (usuario: Usuario) => void;
  loading?: boolean;
}

const UsuariosTable: React.FC<UsuariosTableProps> = ({
  usuarios,
  onEditar,
  onGerenciarPermissoes,
  onDesativar,
  loading = false
}) => {
  return (
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
                <StatusBadge status={usuario.status} />
              </TableCell>
              <TableCell>
                {usuario.ultimo_acesso 
                  ? new Date(usuario.ultimo_acesso).toLocaleString('pt-BR') 
                  : 'Nunca acessou'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onEditar(usuario)}
                    title="Editar Usuário"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => onGerenciarPermissoes(usuario)}
                    title="Gerenciar Permissões"
                  >
                    <Key size={16} />
                  </Button>
                  {onDesativar && usuario.status !== 'inativo' && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onDesativar(usuario)}
                      title="Desativar Usuário"
                    >
                      <UserX size={16} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

// Componente auxiliar para o badge de status
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'ativo':
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Ativo
        </Badge>
      );
    case 'inativo':
      return (
        <Badge variant="secondary" className="bg-gray-500 hover:bg-gray-600">
          Inativo
        </Badge>
      );
    case 'bloqueado':
      return (
        <Badge variant="destructive">
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

export default UsuariosTable;
