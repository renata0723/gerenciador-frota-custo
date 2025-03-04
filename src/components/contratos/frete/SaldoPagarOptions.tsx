
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/constants';

interface SaldoPagarOptionsProps {
  saldoPagar: number;
}

const SaldoPagarOptions: React.FC<SaldoPagarOptionsProps> = ({ saldoPagar }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Saldo a Pagar</Label>
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-xl font-bold text-blue-700">{formatCurrency(saldoPagar)}</p>
            <p className="text-sm text-blue-600 mt-1">Valor a ser pago ao parceiro após a entrega do canhoto</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SaldoPagarOptions;
