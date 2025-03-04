
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { FolhaPagamento } from '@/types/folhaPagamento';
import { format } from 'date-fns';
import { Edit2, Trash, EyeIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FolhaPagamentoTableProps {
  data: FolhaPagamento[];
  onEditar: (id: number) => Promise<void>;
  onExcluir: (id: number) => Promise<void>;
  onVisualizar?: (id: number) => void;
}

const FolhaPagamentoTable: React.FC<FolhaPagamentoTableProps> = ({
  data,
  onEditar,
  onExcluir,
  onVisualizar
}) => {
  const formatarValor = (valor: number | undefined) => {
    if (valor === undefined) return 'R$ 0,00';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };
  
  const statusVariant = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'success';
      case 'pendente':
        return 'warning';
      case 'cancelado':
        return 'destructive';
      case 'pago':
        return 'default';
      default:
        return 'secondary';
    }
  };
  
  const statusLabel = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'Concluído';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'pago':
        return 'Pago';
      default:
        return 'Desconhecido';
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Funcionário</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Data Pagamento</TableHead>
            <TableHead>Salário Base</TableHead>
            <TableHead>Valor Líquido</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Nenhum registro encontrado.
              </TableCell>
            </TableRow>
          ) : (
            data.map((folha) => (
              <TableRow key={folha.id}>
                <TableCell className="font-medium">{folha.id}</TableCell>
                <TableCell>{folha.funcionario_nome}</TableCell>
                <TableCell>{folha.mes_referencia}/{folha.ano_referencia}</TableCell>
                <TableCell>
                  {folha.data_pagamento ? format(new Date(folha.data_pagamento), 'dd/MM/yyyy') : '-'}
                </TableCell>
                <TableCell>{formatarValor(folha.salario_base)}</TableCell>
                <TableCell>{formatarValor(folha.valor_liquido)}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant(folha.status)}>
                    {statusLabel(folha.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    {onVisualizar && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => folha.id && onVisualizar(folha.id)}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => folha.id && onEditar(folha.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => folha.id && onExcluir(folha.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FolhaPagamentoTable;
