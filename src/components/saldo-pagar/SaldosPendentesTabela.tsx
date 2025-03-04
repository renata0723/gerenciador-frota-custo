
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
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { DollarSign, XCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { SaldoItem } from '@/types/saldoPagar';
import { formatCurrency } from '@/utils/constants';

interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onPagar: (saldo: SaldoItem) => void;
  onCancelar: (saldo: SaldoItem) => void;
  onLiberar: (saldo: SaldoItem) => void;
  isLoading?: boolean;
  somenteLeitura?: boolean;
}

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  onPagar,
  onCancelar,
  onLiberar,
  isLoading = false,
  somenteLeitura = false
}) => {
  const getBadgeVariant = (status: string): string => {
    switch (status) {
      case 'pendente':
        return 'secondary';
      case 'parcial':
        return 'default';
      case 'pago':
        return 'success';
      case 'cancelado':
        return 'destructive';
      case 'liberado':
        return 'outline';
      default:
        return 'default';
    }
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return '-';
    try {
      const data = new Date(dataString);
      return format(data, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <Skeleton key={n} className="w-full h-12" />
        ))}
      </div>
    );
  }

  if (saldos.length === 0) {
    return (
      <div className="text-center py-10">
        <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum saldo encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Não existem registros de saldo a pagar nesta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Parceiro</TableHead>
            <TableHead>Contratos</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor Total</TableHead>
            <TableHead className="text-right">Valor Pago</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {saldos.map((saldo) => (
            <TableRow key={saldo.id}>
              <TableCell className="font-medium">{saldo.id}</TableCell>
              <TableCell>{saldo.parceiro}</TableCell>
              <TableCell>
                {saldo.contratos_associados || "-"}
              </TableCell>
              <TableCell>{formatarData(saldo.vencimento)}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(saldo.valor_total)}
              </TableCell>
              <TableCell className="text-right">
                {saldo.valor_pago ? formatCurrency(saldo.valor_pago) : "R$ 0,00"}
              </TableCell>
              <TableCell>
                <Badge variant={getBadgeVariant(saldo.status)}>
                  {saldo.status}
                </Badge>
              </TableCell>
              <TableCell>
                {!somenteLeitura && (
                  <div className="flex justify-end space-x-1">
                    {saldo.status !== 'cancelado' && saldo.status !== 'pago' && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => onPagar(saldo)}
                          disabled={saldo.status !== 'liberado'}
                        >
                          <DollarSign className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onCancelar(saldo)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        
                        {saldo.status !== 'liberado' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onLiberar(saldo)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SaldosPendentesTabela;
