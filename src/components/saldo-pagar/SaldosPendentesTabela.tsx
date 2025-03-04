
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Ban, CheckSquare, ArrowRightSquare, Receipt, DollarSign } from 'lucide-react';
import { SaldoItem } from '@/types/saldoPagar';
import { StatusItem } from '@/types/status';
import { formatCurrency, formatDate, STATUS_SALDO_PAGAR } from '@/utils/constants';

interface SaldosPendentesProps {
  saldos: SaldoItem[];
  isLoading: boolean;
  somenteLeitura?: boolean;
  onPagar?: (saldo: SaldoItem) => void;
  onCancelar?: (saldo: SaldoItem) => void;
  onLiberar?: (saldo: SaldoItem) => void;
  onVerDetalhes?: (saldo: SaldoItem) => void;
}

const statusColors = {
  pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  parcial: 'bg-blue-100 text-blue-800 border-blue-200',
  pago: 'bg-green-100 text-green-800 border-green-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
  liberado: 'bg-purple-100 text-purple-800 border-purple-200'
};

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  isLoading,
  somenteLeitura = false,
  onPagar,
  onCancelar,
  onLiberar,
  onVerDetalhes
}) => {
  // Função para obter cor baseada no status
  const getStatusColor = (status: string) => {
    if (status === STATUS_SALDO_PAGAR.PENDENTE.value) {
      return statusColors.pendente;
    }
    if (status === STATUS_SALDO_PAGAR.PARCIAL.value) {
      return statusColors.parcial;
    }
    if (status === STATUS_SALDO_PAGAR.PAGO.value) {
      return statusColors.pago;
    }
    if (status === STATUS_SALDO_PAGAR.CANCELADO.value) {
      return statusColors.cancelado;
    }
    if (status === STATUS_SALDO_PAGAR.LIBERADO.value) {
      return statusColors.liberado;
    }
    
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };
  
  // Função para obter o label do status
  const getStatusLabel = (status: string) => {
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
    
    return 'Desconhecido';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Carregando saldos...</span>
      </div>
    );
  }

  if (saldos.length === 0) {
    return (
      <div className="text-center py-8">
        <DollarSign className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-900">Nenhum saldo encontrado</h3>
        <p className="text-gray-500 mt-1">Não há saldos a pagar registrados no momento.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Vencimento</TableHead>
            <TableHead>Parceiro</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Valor Pago</TableHead>
            <TableHead>Saldo Restante</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saldos.map((saldo) => (
            <TableRow key={saldo.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                {formatDate(saldo.vencimento)}
              </TableCell>
              <TableCell>{saldo.parceiro}</TableCell>
              <TableCell>{formatCurrency(saldo.valor_total)}</TableCell>
              <TableCell>{formatCurrency(saldo.valor_pago)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(saldo.saldo_restante)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(saldo.status)}>
                  {getStatusLabel(saldo.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  {saldo.status === STATUS_SALDO_PAGAR.PENDENTE.value && !somenteLeitura && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onPagar && onPagar(saldo)}
                        title="Pagar"
                      >
                        <CheckSquare className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onCancelar && onCancelar(saldo)}
                        title="Cancelar"
                      >
                        <Ban className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onLiberar && onLiberar(saldo)}
                        title="Liberar"
                      >
                        <ArrowRightSquare className="h-4 w-4 text-purple-600" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onVerDetalhes && onVerDetalhes(saldo)}
                    title="Ver detalhes"
                  >
                    <Receipt className="h-4 w-4 text-blue-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaldosPendentesTabela;
