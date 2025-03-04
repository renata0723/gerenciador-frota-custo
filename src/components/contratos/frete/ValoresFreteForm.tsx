
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/formatters";

interface ValoresFreteFormProps {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  setValorFreteContratado: (valor: number) => void;
  setValorAdiantamento: (valor: number) => void;
  setValorPedagio: (valor: number) => void;
  disabled: boolean;
}

const ValoresFreteForm: React.FC<ValoresFreteFormProps> = ({
  valorFreteContratado,
  valorAdiantamento,
  valorPedagio,
  saldoPagar,
  setValorFreteContratado,
  setValorAdiantamento,
  setValorPedagio,
  disabled
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$)</Label>
          <Input
            id="valorFreteContratado"
            type="number"
            step="0.01"
            min="0"
            value={valorFreteContratado}
            onChange={(e) => setValorFreteContratado(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            disabled={disabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
          <Input
            id="valorAdiantamento"
            type="number"
            step="0.01"
            min="0"
            value={valorAdiantamento}
            onChange={(e) => setValorAdiantamento(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
          <Input
            id="valorPedagio"
            type="number"
            step="0.01"
            min="0"
            value={valorPedagio}
            onChange={(e) => setValorPedagio(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            disabled={disabled}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="saldoPagar">Saldo a Pagar (R$)</Label>
          <Input
            id="saldoPagar"
            type="number"
            step="0.01"
            min="0"
            value={saldoPagar}
            disabled={true}
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(saldoPagar)}
          </p>
        </div>
      </div>
    </>
  );
};

export default ValoresFreteForm;
