
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  Ban, 
  Info, 
  CheckCircle, 
  AlertCircle, 
  ClockIcon, 
  Loader2 
} from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { SaldoItem } from '@/types/saldoPagar';
import { formatCurrency, formatDate, STATUS_SALDO_PAGAR } from '@/utils/constants';

interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onPagar: (saldo: SaldoItem) => void;
  onCancelar: (saldo: SaldoItem) => void;
  onLiberar: (saldo: SaldoItem) => void;
  isLoading?: boolean;
  somenteLeitura?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case STATUS_SALDO_PAGAR.PENDENTE:
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendente</Badge>;
    case STATUS_SALDO_PAGAR.PARCIAL:
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Parcial</Badge>;
    case STATUS_SALDO_PAGAR.PAGO:
      return <Badge className="bg-green-500">Pago</Badge>;
    case STATUS_SALDO_PAGAR.CANCELADO:
      return <Badge variant="destructive">Cancelado</Badge>;
    case STATUS_SALDO_PAGAR.LIBERADO:
      return <Badge className="bg-blue-500">Liberado</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  onPagar,
  onCancelar,
  onLiberar,
  isLoading = false,
  somenteLeitura = false
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-500">Carregando saldos...</span>
      </div>
    );
  }

  if (saldos.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <AlertCircle className="h-8 w-8 mx-auto text-gray-400" />
        <p className="mt-2 text-gray-500">Nenhum saldo encontrado.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
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
              <TableCell className="font-medium">
                {saldo.parceiro}
              </TableCell>
              <TableCell>
                {saldo.contratos_associados || 'N/A'}
              </TableCell>
              <TableCell>
                {saldo.vencimento ? formatDate(saldo.vencimento) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(saldo.valor_total || 0)}
              </TableCell>
              <TableCell className="text-right">
                {saldo.valor_pago ? formatCurrency(saldo.valor_pago) : 'R$ 0,00'}
              </TableCell>
              <TableCell>
                {getStatusBadge(saldo.status)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  {!somenteLeitura && saldo.status !== STATUS_SALDO_PAGAR.PAGO && saldo.status !== STATUS_SALDO_PAGAR.CANCELADO && (
                    <>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onPagar(saldo)}
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Registrar Pagamento</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onCancelar(saldo)}
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cancelar Saldo</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {saldo.status !== STATUS_SALDO_PAGAR.LIBERADO && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onLiberar(saldo)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Liberar para Pagamento</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </>
                  )}

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver Detalhes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
