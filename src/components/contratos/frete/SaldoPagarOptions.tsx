
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/utils/constants';

interface SaldoPagarOptionsProps {
  saldoPagar: number;
}

const SaldoPagarOptions: React.FC<SaldoPagarOptionsProps> = ({ saldoPagar }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Saldo a Pagar</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            O saldo a pagar é calculado automaticamente com base nos valores informados.
          </AlertDescription>
        </Alert>
        
        <div className="mt-4 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-gray-800 font-medium">Valor do frete:</span>
            <span className="text-gray-800">{formatCurrency(saldoPagar)}</span>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Este valor será registrado como saldo a pagar para o parceiro.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaldoPagarOptions;
