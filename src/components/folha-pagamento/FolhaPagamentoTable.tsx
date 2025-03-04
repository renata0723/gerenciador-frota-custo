
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FolhaPagamento } from '@/types/contabilidade';
import { Edit, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formataMoeda } from '@/utils/constants';

export interface FolhaPagamentoTableProps {
  dados: FolhaPagamento[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

const FolhaPagamentoTable: React.FC<FolhaPagamentoTableProps> = ({ dados, onEdit, onDelete, onView }) => {
  const formatarData = (dataString: string): string => {
    try {
      const data = new Date(dataString);
      return format(data, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Funcionário</TableHead>
            <TableHead>Data Pagamento</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead className="text-right">Salário Base</TableHead>
            <TableHead className="text-right">Valor Líquido</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                Nenhum registro de folha de pagamento encontrado.
              </TableCell>
            </TableRow>
          ) : (
            dados.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.funcionario_nome}</TableCell>
                <TableCell>{formatarData(item.data_pagamento)}</TableCell>
                <TableCell>{item.mes_referencia}/{item.ano_referencia}</TableCell>
                <TableCell className="text-right">{formataMoeda(Number(item.salario_base))}</TableCell>
                <TableCell className="text-right">{formataMoeda(Number(item.valor_liquido))}</TableCell>
                <TableCell className="text-center">
                  <span 
                    className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'concluido' 
                        ? 'bg-green-100 text-green-800' 
                        : item.status === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status === 'concluido' ? 'Concluído' : 
                     item.status === 'pendente' ? 'Pendente' : 
                     item.status === 'cancelado' ? 'Cancelado' : 
                     item.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onView(item.id!)}
                      title="Visualizar"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(item.id!)}
                      title="Editar"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onDelete(item.id!)}
                      title="Excluir"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
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
