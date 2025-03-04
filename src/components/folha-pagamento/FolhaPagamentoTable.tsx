
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { FolhaPagamento } from '@/services/contabilidadeService';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FolhaPagamentoTableProps {
  data: FolhaPagamento[];
  onEdit?: (folha: FolhaPagamento) => void;
  onDelete?: (id: number) => void;
  onView?: (folha: FolhaPagamento) => void;
}

const FolhaPagamentoTable: React.FC<FolhaPagamentoTableProps> = ({
  data,
  onEdit,
  onDelete,
  onView
}) => {
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  const formatarValor = (valor: number | undefined) => {
    if (valor === undefined) return 'R$ 0,00';
    return `R$ ${valor.toFixed(2).replace('.', ',')}`;
  };

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Funcionário</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Data Pgto.</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Salário Base</TableHead>
            <TableHead className="text-right">Valor Líquido</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                Nenhum registro de folha de pagamento encontrado
              </TableCell>
            </TableRow>
          ) : (
            data.map((folha) => (
              <TableRow key={folha.id}>
                <TableCell className="font-medium">{folha.funcionario_nome}</TableCell>
                <TableCell>{folha.cargo || '-'}</TableCell>
                <TableCell>{formatarData(folha.data_pagamento)}</TableCell>
                <TableCell>
                  {capitalizeFirstLetter(folha.mes_referencia)}/{folha.ano_referencia}
                </TableCell>
                <TableCell className="text-right">{formatarValor(folha.salario_base)}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatarValor(folha.valor_total)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(folha)}
                        title="Visualizar detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(folha)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && folha.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(folha.id!)}
                        title="Excluir"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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
