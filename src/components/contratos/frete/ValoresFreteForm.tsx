
import React from 'react';
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
  // Função para formatar valor ao digitar
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>, setValor: (valor: number) => void) => {
    const valorStr = e.target.value.replace(/\D/g, '');
    const valor = valorStr ? parseInt(valorStr) / 100 : 0;
    setValor(valor);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="valorFreteContratado">Valor do Frete Contratado</Label>
        <Input
          id="valorFreteContratado"
          value={formatCurrency(valorFreteContratado)}
          onChange={(e) => handleValorChange(e, onValorFreteChange)}
          placeholder="R$ 0,00"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="valorAdiantamento">Valor do Adiantamento</Label>
        <Input
          id="valorAdiantamento"
          value={formatCurrency(valorAdiantamento)}
          onChange={(e) => handleValorChange(e, onValorAdiantamentoChange)}
          placeholder="R$ 0,00"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="valorPedagio">Valor do Pedágio</Label>
        <Input
          id="valorPedagio"
          value={formatCurrency(valorPedagio)}
          onChange={(e) => handleValorChange(e, onValorPedagioChange)}
          placeholder="R$ 0,00"
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ValoresFreteForm;
