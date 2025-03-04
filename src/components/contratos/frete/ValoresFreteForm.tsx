
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/constants';

interface ValoresFreteFormProps {
  valorFreteContratado: number;
  onValorFreteChange: (valor: number) => void;
  valorAdiantamento: number;
  onValorAdiantamentoChange: (valor: number) => void;
  valorPedagio: number;
  onValorPedagioChange: (valor: number) => void;
}

const ValoresFreteForm: React.FC<ValoresFreteFormProps> = ({
  valorFreteContratado,
  onValorFreteChange,
  valorAdiantamento,
  onValorAdiantamentoChange,
  valorPedagio,
  onValorPedagioChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Valores do Frete</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$)</Label>
            <Input
              id="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={valorFreteContratado}
              onChange={(e) => onValorFreteChange(parseFloat(e.target.value) || 0)}
              className="mt-1"
              placeholder="0,00"
            />
          </div>
          
          <div>
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
            <Input
              id="valorAdiantamento"
              type="number"
              step="0.01"
              min="0"
              max={valorFreteContratado}
              value={valorAdiantamento}
              onChange={(e) => onValorAdiantamentoChange(parseFloat(e.target.value) || 0)}
              className="mt-1"
              placeholder="0,00"
            />
          </div>
          
          <div>
            <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
            <Input
              id="valorPedagio"
              type="number"
              step="0.01"
              min="0"
              value={valorPedagio}
              onChange={(e) => onValorPedagioChange(parseFloat(e.target.value) || 0)}
              className="mt-1"
              placeholder="0,00"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ValoresFreteForm;
