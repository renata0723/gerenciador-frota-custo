
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';

interface LatestInvoicesTableProps {
  loading: boolean;
  data: any[];
  viewAllUrl: string;
}

export default function LatestInvoicesTable({ loading, data, viewAllUrl }: LatestInvoicesTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Últimas Notas Fiscais</CardTitle>
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
            <p>Nenhuma nota fiscal encontrada.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nota Fiscal</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((nota) => (
                <TableRow key={nota.numero_nota_fiscal || nota.id}>
                  <TableCell className="font-medium">{nota.numero_nota_fiscal || "N/A"}</TableCell>
                  <TableCell>{nota.cliente_destinatario || "N/A"}</TableCell>
                  <TableCell>{nota.data_coleta || "N/A"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(nota.valor_nota_fiscal || 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
