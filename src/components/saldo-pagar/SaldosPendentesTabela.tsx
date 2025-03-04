
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle2,
  ChevronDown,
  Coins,
  DollarSign,
  EyeIcon,
  Filter,
  MoreHorizontal,
  Printer,
  Search,
} from 'lucide-react';
import { SaldoItem } from '@/types/saldoPagar';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { STATUS_SALDO_PAGAR } from '@/utils/constants';

interface SaldosPendentesProps {
  saldos: SaldoItem[];
  onVisualizarClick: (saldo: SaldoItem) => void;
  onRealizarPagamento: (saldo: SaldoItem) => void;
  onFiltraStatus?: (status: string) => void;
  onSearch?: (term: string) => void;
}

const SaldosPendentesTabela: React.FC<SaldosPendentesProps> = ({
  saldos,
  onVisualizarClick,
  onRealizarPagamento,
  onFiltraStatus,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === STATUS_SALDO_PAGAR.PENDENTE.value) {
      return 'bg-yellow-100 text-yellow-800';
    } else if (status === STATUS_SALDO_PAGAR.PARCIAL.value) {
      return 'bg-blue-100 text-blue-800';
    } else if (status === STATUS_SALDO_PAGAR.PAGO.value) {
      return 'bg-green-100 text-green-800';
    } else if (status === STATUS_SALDO_PAGAR.CANCELADO.value) {
      return 'bg-red-100 text-red-800';
    } else if (status === STATUS_SALDO_PAGAR.LIBERADO.value) {
      return 'bg-purple-100 text-purple-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (statusValue: string) => {
    const status = Object.values(STATUS_SALDO_PAGAR).find(
      s => s.value === statusValue
    );
    return status ? status.label : statusValue;
  };

  const totalPendente = saldos
    .filter(s => s.status === STATUS_SALDO_PAGAR.PENDENTE.value || s.status === STATUS_SALDO_PAGAR.PARCIAL.value)
    .reduce((acc, curr) => acc + curr.saldo_restante, 0);
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Saldos a Pagar</span>
          <span className="text-xl font-bold text-blue-600">
            Total Pendente: {formatCurrency(totalPendente)}
          </span>
        </CardTitle>
        <CardDescription>
          Gerencie os pagamentos pendentes aos parceiros e motoristas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar parceiro..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-1">
                  <Filter size={16} />
                  <span className="hidden md:inline">Status</span>
                  <ChevronDown size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onFiltraStatus && onFiltraStatus('')}>
                  Todos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltraStatus && onFiltraStatus(STATUS_SALDO_PAGAR.PENDENTE.value)}>
                  Pendente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltraStatus && onFiltraStatus(STATUS_SALDO_PAGAR.PARCIAL.value)}>
                  Parcial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltraStatus && onFiltraStatus(STATUS_SALDO_PAGAR.PAGO.value)}>
                  Pago
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFiltraStatus && onFiltraStatus(STATUS_SALDO_PAGAR.LIBERADO.value)}>
                  Liberado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" className="flex gap-1">
              <Printer size={16} />
              <span className="hidden md:inline">Imprimir</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Parceiro</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Restante</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {saldos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    Nenhum saldo a pagar encontrado
                  </TableCell>
                </TableRow>
              ) : (
                saldos.map((saldo) => (
                  <TableRow key={saldo.id}>
                    <TableCell className="font-medium">{saldo.id}</TableCell>
                    <TableCell>{saldo.parceiro}</TableCell>
                    <TableCell>{formatCurrency(saldo.valor_total)}</TableCell>
                    <TableCell>{formatCurrency(saldo.valor_pago)}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(saldo.saldo_restante)}
                    </TableCell>
                    <TableCell>{formatDate(saldo.vencimento)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          saldo.status
                        )}`}
                      >
                        {getStatusLabel(saldo.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onVisualizarClick(saldo)}
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Detalhes</span>
                        </Button>
                        {(saldo.status === STATUS_SALDO_PAGAR.PENDENTE.value || 
                          saldo.status === STATUS_SALDO_PAGAR.PARCIAL.value) && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => onRealizarPagamento(saldo)}
                          >
                            <Coins className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Pagar</span>
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onVisualizarClick(saldo)}>
                              <EyeIcon className="h-4 w-4 mr-2" />
                              Detalhes
                            </DropdownMenuItem>
                            {(saldo.status === STATUS_SALDO_PAGAR.PENDENTE.value || 
                              saldo.status === STATUS_SALDO_PAGAR.PARCIAL.value) && (
                              <DropdownMenuItem onClick={() => onRealizarPagamento(saldo)}>
                                <Coins className="h-4 w-4 mr-2" />
                                Registrar Pagamento
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Printer className="h-4 w-4 mr-2" />
                              Imprimir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaldosPendentesTabela;
