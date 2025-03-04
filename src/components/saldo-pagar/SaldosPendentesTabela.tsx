
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SaldoItem } from '@/types/saldoPagar';
import { Edit, FileText, MoreHorizontal, Receipt, Trash2, Coins } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { formatarValorMonetario as formatCurrency, formatarData as formatDate } from '@/utils/formatters';
import { STATUS_SALDO_PAGAR } from '@/utils/constants';

interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onVisualizarDetalhes: (id: number) => void;
  onRegistrarPagamento: (id: number) => void;
  onCancelarSaldo: (id: number) => void;
  onLiberarSaldo: (id: number) => void;
  onImprimirRelatorio?: (id: number) => void;
}

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  onVisualizarDetalhes,
  onRegistrarPagamento,
  onCancelarSaldo,
  onLiberarSaldo,
  onImprimirRelatorio
}) => {
  // Função para obter a cor do status baseado no valor
  const getStatusColor = (status: string) => {
    if (status === STATUS_SALDO_PAGAR.PENDENTE.value) {
      return "warning";
    }
    if (status === STATUS_SALDO_PAGAR.PARCIAL.value) {
      return "warning";
    }
    if (status === STATUS_SALDO_PAGAR.PAGO.value) {
      return "success";
    }
    if (status === STATUS_SALDO_PAGAR.CANCELADO.value) {
      return "destructive";
    }
    if (status === STATUS_SALDO_PAGAR.LIBERADO.value) {
      return "default";
    }
    return "secondary";
  };

  // Função para obter o texto do status baseado no valor
  const getStatusText = (status: string) => {
    if (status === STATUS_SALDO_PAGAR.PENDENTE.value) {
      return STATUS_SALDO_PAGAR.PENDENTE.label;
    }
    if (status === STATUS_SALDO_PAGAR.PARCIAL.value) {
      return STATUS_SALDO_PAGAR.PARCIAL.label;
    }
    if (status === STATUS_SALDO_PAGAR.PAGO.value) {
      return STATUS_SALDO_PAGAR.PAGO.label;
    }
    if (status === STATUS_SALDO_PAGAR.CANCELADO.value) {
      return STATUS_SALDO_PAGAR.CANCELADO.label;
    }
    if (status === STATUS_SALDO_PAGAR.LIBERADO.value) {
      return STATUS_SALDO_PAGAR.LIBERADO.label;
    }
    return status;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Parceiro</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saldos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Nenhum saldo pendente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            saldos.map((saldo) => (
              <TableRow key={saldo.id}>
                <TableCell className="font-medium">{saldo.id}</TableCell>
                <TableCell>{saldo.parceiro}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(saldo.valor_total)}
                </TableCell>
                <TableCell>{saldo.vencimento ? formatDate(saldo.vencimento) : '-'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(saldo.status)}>
                    {getStatusText(saldo.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onVisualizarDetalhes(saldo.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Detalhes</span>
                      </DropdownMenuItem>
                      
                      {(saldo.status === STATUS_SALDO_PAGAR.PENDENTE.value || 
                        saldo.status === STATUS_SALDO_PAGAR.PARCIAL.value) && (
                        <DropdownMenuItem onClick={() => onRegistrarPagamento(saldo.id)}>
                          <Coins className="mr-2 h-4 w-4" />
                          <span>Registrar Pagamento</span>
                        </DropdownMenuItem>
                      )}
                      
                      {(saldo.status === STATUS_SALDO_PAGAR.PENDENTE.value || 
                        saldo.status === STATUS_SALDO_PAGAR.PARCIAL.value) && (
                        <DropdownMenuItem onClick={() => onCancelarSaldo(saldo.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Cancelar</span>
                        </DropdownMenuItem>
                      )}
                      
                      {(saldo.status === STATUS_SALDO_PAGAR.PENDENTE.value || 
                        saldo.status === STATUS_SALDO_PAGAR.PARCIAL.value) && (
                        <DropdownMenuItem onClick={() => onLiberarSaldo(saldo.id)}>
                          <Receipt className="mr-2 h-4 w-4" />
                          <span>Liberar</span>
                        </DropdownMenuItem>
                      )}
                      
                      {onImprimirRelatorio && (
                        <DropdownMenuItem onClick={() => onImprimirRelatorio(saldo.id)}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Imprimir</span>
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
    </div>
  );
};

export default SaldosPendentesTabela;
