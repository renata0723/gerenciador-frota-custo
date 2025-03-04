
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
import { formatCurrency, formatarData } from '@/utils/formatters';
import { SaldoItem } from '@/types/saldoPagar';
import { STATUS_SALDO_PAGAR } from '@/utils/constants';
import { Pencil, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

export interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onSubmit: (saldo: SaldoItem) => void;
  onNext?: () => void;
  somenteLeitura?: boolean;
  isLoading?: boolean;
}

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  onSubmit,
  somenteLeitura = false,
  isLoading = false
}) => {
  // Função para determinar o status badge
  const getStatusBadge = (status: string) => {
    if (status === STATUS_SALDO_PAGAR.PENDENTE.value) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
          <Clock className="h-3 w-3 mr-1" />
          Pendente
        </Badge>
      );
    } else if (status === STATUS_SALDO_PAGAR.PARCIAL.value) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
          <AlertCircle className="h-3 w-3 mr-1" />
          Parcial
        </Badge>
      );
    } else if (status === STATUS_SALDO_PAGAR.PAGO.value) {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Pago
        </Badge>
      );
    } else if (status === STATUS_SALDO_PAGAR.CANCELADO.value) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
          <XCircle className="h-3 w-3 mr-1" />
          Cancelado
        </Badge>
      );
    } else if (status === STATUS_SALDO_PAGAR.LIBERADO.value) {
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
          <CheckCircle className="h-3 w-3 mr-1" />
          Liberado
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
          {status}
        </Badge>
      );
    }
  };

  // Verificar se a data de vencimento está próxima ou vencida
  const isVencido = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    return vencimento < hoje;
  };

  const isVencimentoProximo = (dataVencimento: string) => {
    const hoje = new Date();
    const vencimento = new Date(dataVencimento);
    const diferencaDias = Math.floor((vencimento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    return diferencaDias >= 0 && diferencaDias <= 3;
  };

  // Estilo para célula de vencimento
  const getVencimentoStyle = (dataVencimento: string) => {
    if (isVencido(dataVencimento)) {
      return "font-medium text-red-600";
    } else if (isVencimentoProximo(dataVencimento)) {
      return "font-medium text-yellow-600";
    }
    return "font-medium";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (saldos.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md bg-gray-50">
        <p className="text-gray-500">Não há saldos pendentes no momento</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parceiro</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Valor Pago</TableHead>
            <TableHead>Saldo Restante</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            {!somenteLeitura && <TableHead className="text-right">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {saldos.map((saldo) => (
            <TableRow key={saldo.id}>
              <TableCell className="font-medium">{saldo.parceiro}</TableCell>
              <TableCell>{formatCurrency(saldo.valor_total)}</TableCell>
              <TableCell>{formatCurrency(saldo.valor_pago)}</TableCell>
              <TableCell className="font-semibold text-blue-600">
                {formatCurrency(saldo.saldo_restante)}
              </TableCell>
              <TableCell className={getVencimentoStyle(saldo.vencimento)}>
                {formatarData(saldo.vencimento)}
              </TableCell>
              <TableCell>{getStatusBadge(saldo.status)}</TableCell>
              {!somenteLeitura && (
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    className="px-2"
                    onClick={() => onSubmit(saldo)}
                    disabled={saldo.status === STATUS_SALDO_PAGAR.PAGO.value || saldo.status === STATUS_SALDO_PAGAR.CANCELADO.value}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Pagar
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaldosPendentesTabela;
