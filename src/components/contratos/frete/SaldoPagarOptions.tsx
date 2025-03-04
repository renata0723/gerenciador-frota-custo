
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { formatCurrency } from '@/utils/formatters'; // Corrigindo o import
import { Card } from '@/components/ui/card';

interface SaldoPagarOptionsProps {
  valor: number;
  gerarSaldoPagar: boolean;
  setGerarSaldoPagar: (value: boolean) => void;
  dataVencimento: Date | undefined;
  setDataVencimento: (data: Date | undefined) => void;
  proprietario: string;
}

const SaldoPagarOptions: React.FC<SaldoPagarOptionsProps> = ({
  valor,
  gerarSaldoPagar,
  setGerarSaldoPagar,
  dataVencimento,
  setDataVencimento,
  proprietario
}) => {
  return (
    <Card className="p-4 bg-gray-50 shadow-sm border">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-800">Gerar saldo a pagar</h3>
            <p className="text-sm text-gray-600">
              Valor: {formatCurrency(valor)}
            </p>
            <p className="text-sm text-gray-600">
              Proprietário: {proprietario || 'Não informado'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              checked={gerarSaldoPagar}
              onCheckedChange={setGerarSaldoPagar}
              id="gerarSaldoPagar"
              disabled={!proprietario || valor <= 0}
            />
            <Label htmlFor="gerarSaldoPagar" className="cursor-pointer">
              {gerarSaldoPagar ? 'Ativado' : 'Desativado'}
            </Label>
          </div>
        </div>

        {gerarSaldoPagar && (
          <div className="pt-2">
            <Label htmlFor="dataVencimento" className="block mb-2">
              Data de vencimento*
            </Label>
            <DatePicker
              value={dataVencimento}
              onChange={setDataVencimento}
              placeholder="Selecione a data de vencimento"
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default SaldoPagarOptions;
