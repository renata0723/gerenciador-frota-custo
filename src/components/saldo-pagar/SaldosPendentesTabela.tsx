
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  DollarSign, 
  FileText, 
  EllipsisVertical, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { SaldoPagar } from '@/types/saldoPagar';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SaldoItem extends SaldoPagar {
  selecionado: boolean;
}

interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onSelecionarSaldo: (id: number) => void;
  onPagarSelecionados: () => void;
  onVerDetalhes: (id: number) => void;
  onCancelarSaldo: (id: number) => void;
}

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  onSelecionarSaldo,
  onPagarSelecionados,
  onVerDetalhes,
  onCancelarSaldo
}) => {
  const getSaldoRestante = (saldo: SaldoPagar) => {
    const valorPago = saldo.valor_pago || 0;
    return saldo.valor_total - valorPago;
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="outline">Pendente</Badge>;
    
    switch (status.toLowerCase()) {
      case 'liberado':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Liberado</Badge>;
      case 'pago':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pago</Badge>;
      case 'parcial':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Parcial</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const saldosSelecionados = saldos.filter(s => s.selecionado);
  
  return (
    <div className="space-y-4">
      {saldosSelecionados.length > 0 && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-md flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              {saldosSelecionados.length} {saldosSelecionados.length === 1 ? 'saldo selecionado' : 'saldos selecionados'} - 
              Total: {formatCurrency(saldosSelecionados.reduce((acc, item) => acc + getSaldoRestante(item), 0))}
            </span>
          </div>
          <Button 
            size="sm" 
            onClick={onPagarSelecionados}
            className="bg-green-600 hover:bg-green-700"
          >
            Pagar Selecionados
          </Button>
        </div>
      )}
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <span className="sr-only">Selecionar</span>
              </TableHead>
              <TableHead>Parceiro</TableHead>
              <TableHead>Contrato</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Valor Total</TableHead>
              <TableHead>Valor Pago</TableHead>
              <TableHead>Saldo Restante</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {saldos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <FileText className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-gray-500">Nenhum saldo a pagar encontrado</p>
                </TableCell>
              </TableRow>
            ) : (
              saldos.map((saldo) => (
                <TableRow 
                  key={saldo.id}
                  className={saldo.selecionado ? 'bg-blue-50' : undefined}
                >
                  <TableCell>
                    <Checkbox 
                      checked={saldo.selecionado}
                      onCheckedChange={() => onSelecionarSaldo(saldo.id!)}
                      disabled={saldo.status === 'pago' || saldo.status === 'cancelado'}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{saldo.parceiro}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{saldo.contratos_associados || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{formatDate(saldo.vencimento || '')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{formatCurrency(saldo.valor_total)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {saldo.valor_pago ? formatCurrency(saldo.valor_pago) : '-'}
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(getSaldoRestante(saldo))}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(saldo.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EllipsisVertical className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onVerDetalhes(saldo.id!)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Ver detalhes
                        </DropdownMenuItem>
                        {saldo.status !== 'pago' && saldo.status !== 'cancelado' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => onSelecionarSaldo(saldo.id!)}
                              disabled={saldo.status === 'pago' || saldo.status === 'cancelado'}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {saldo.selecionado ? 'Desmarcar' : 'Selecionar'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCancelarSaldo(saldo.id!)}>
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar Saldo
                            </DropdownMenuItem>
                          </>
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
    </div>
  );
};

export default SaldosPendentesTabela;
