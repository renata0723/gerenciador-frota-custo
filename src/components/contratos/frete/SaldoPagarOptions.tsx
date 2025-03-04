
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/constants';

interface SaldoPagarOptionsProps {
  saldoPagar: number;
}

const SaldoPagarOptions: React.FC<SaldoPagarOptionsProps> = ({ saldoPagar }) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-blue-800">Saldo a Pagar</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(saldoPagar)}
          </div>
          <p className="text-blue-700 mt-1">
            Valor a ser pago ao parceiro após a entrega do canhoto
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaldoPagarOptions;
