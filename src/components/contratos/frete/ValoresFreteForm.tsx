
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters'; // Corrigindo o import

interface ValoresFreteFormProps {
  valorFreteContratado: number;
  setValorFreteContratado: (valor: number) => void;
  valorAdiantamento: number;
  setValorAdiantamento: (valor: number) => void;
  valorPedagio: number;
  setValorPedagio: (valor: number) => void;
  saldoPagar: number;
}

const ValoresFreteForm: React.FC<ValoresFreteFormProps> = ({
  valorFreteContratado,
  setValorFreteContratado,
  valorAdiantamento,
  setValorAdiantamento,
  valorPedagio,
  setValorPedagio,
  saldoPagar
}) => {
  return (
    <Card className="p-4 shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="valorFreteContratado">Valor do Frete*</Label>
          <Input
            id="valorFreteContratado"
            type="number"
            min="0"
            step="0.01"
            value={valorFreteContratado}
            onChange={(e) => setValorFreteContratado(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="valorAdiantamento">Adiantamento</Label>
          <Input
            id="valorAdiantamento"
            type="number"
            min="0"
            max={valorFreteContratado}
            step="0.01"
            value={valorAdiantamento}
            onChange={(e) => setValorAdiantamento(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
          />
        </div>
        
        <div>
          <Label htmlFor="valorPedagio">Pedágio</Label>
          <Input
            id="valorPedagio"
            type="number"
            min="0"
            step="0.01"
            value={valorPedagio}
            onChange={(e) => setValorPedagio(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
          />
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded border">
        <div className="flex justify-between items-center">
          <span className="font-medium">Saldo a Pagar:</span>
          <span className="text-blue-600 font-semibold">
            {formatCurrency(saldoPagar)}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ValoresFreteForm;
