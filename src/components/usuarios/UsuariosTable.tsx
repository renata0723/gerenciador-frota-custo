
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Key, UserX, UserCheck, MoreHorizontal } from 'lucide-react';
import { Usuario } from '@/types/usuario';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={16} />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Ações do Usuário</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEditar(usuario)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar Usuário</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onGerenciarPermissoes(usuario)}>
                      <Key className="mr-2 h-4 w-4" />
                      <span>Gerenciar Permissões</span>
                    </DropdownMenuItem>
                    {onDesativar && usuario.status !== 'inativo' && (
                      <DropdownMenuItem onClick={() => onDesativar(usuario)}>
                        <UserX className="mr-2 h-4 w-4" />
                        <span>Desativar Usuário</span>
                      </DropdownMenuItem>
                    )}
                    {onDesativar && usuario.status === 'inativo' && (
                      <DropdownMenuItem onClick={() => onDesativar(usuario)}>
                        <UserCheck className="mr-2 h-4 w-4" />
                        <span>Ativar Usuário</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
