
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';

interface LatestMaintenanceTableProps {
  loading: boolean;
  data: any[];
  viewAllUrl: string;
}

export default function LatestMaintenanceTable({ loading, data, viewAllUrl }: LatestMaintenanceTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Últimas Manutenções</CardTitle>
        <Link to={viewAllUrl}>
          <Button variant="ghost" size="sm" className="text-sm text-gray-600">
            Ver todas
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            <p>Nenhuma manutenção encontrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Veículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((manutencao) => (
                <TableRow key={manutencao.id}>
                  <TableCell className="font-medium">{manutencao.placa_veiculo || "N/A"}</TableCell>
                  <TableCell>{manutencao.tipo_manutencao || "N/A"}</TableCell>
                  <TableCell>{manutencao.data_manutencao || "N/A"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(manutencao.valor_total || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
