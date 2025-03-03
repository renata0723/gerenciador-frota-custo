
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from 'react';

interface FormularioFreteContratadoProps {
  onSubmit: (data: any) => void;
  onBack: () => void;
}

export const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSubmit,
  onBack,
}) => {
  const [valorFrete, setValorFrete] = useState('');
  const [valorAdiantamento, setValorAdiantamento] = useState('');
  const [dataAdiantamento, setDataAdiantamento] = useState('');
  const [valorPedagio, setValorPedagio] = useState('');
  const [saldoPagar, setSaldoPagar] = useState('0,00');

  useEffect(() => {
    // Calcular o saldo a pagar
    const calcularSaldo = () => {
      try {
        const frete = parseFloat(valorFrete.replace('.', '').replace(',', '.')) || 0;
        const adiantamento = parseFloat(valorAdiantamento.replace('.', '').replace(',', '.')) || 0;
        const pedagio = parseFloat(valorPedagio.replace('.', '').replace(',', '.')) || 0;
        
        const saldo = frete - adiantamento - pedagio;
        return saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } catch (error) {
        return '0,00';
      }
    };

    setSaldoPagar(calcularSaldo());
  }, [valorFrete, valorAdiantamento, valorPedagio]);

  const formatarValor = (valor: string) => {
    // Remove tudo que não for número
    let numero = valor.replace(/\D/g, '');
    
    // Converte para número e formata para reais
    if (numero.length > 0) {
      numero = (parseInt(numero) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      numero = '0,00';
    }
    
    return numero;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      valorFrete,
      valorAdiantamento,
      dataAdiantamento,
      valorPedagio,
      saldoPagar
    };
    onSubmit(formData);
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="valorFrete">
                Valor do Frete Contratado (R$)
              </label>
              <input
                id="valorFrete"
                name="valorFrete"
                value={valorFrete}
                onChange={(e) => setValorFrete(formatarValor(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="valorAdiantamento">
                Valor do Adiantamento (R$)
              </label>
              <input
                id="valorAdiantamento"
                name="valorAdiantamento"
                value={valorAdiantamento}
                onChange={(e) => setValorAdiantamento(formatarValor(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="dataAdiantamento">
                Data do Adiantamento
              </label>
              <input
                id="dataAdiantamento"
                name="dataAdiantamento"
                type="date"
                value={dataAdiantamento}
                onChange={(e) => setDataAdiantamento(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium" htmlFor="valorPedagio">
                Valor do Pedágio (R$)
              </label>
              <input
                id="valorPedagio"
                name="valorPedagio"
                value={valorPedagio}
                onChange={(e) => setValorPedagio(formatarValor(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0,00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium" htmlFor="saldoPagar">
              Saldo a Pagar (R$)
            </label>
            <input
              id="saldoPagar"
              name="saldoPagar"
              value={saldoPagar}
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
              readOnly
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" type="button" onClick={onBack}>
              Voltar
            </Button>
            <Button type="submit">Continuar</Button>
          </div>
        </div>
      </form>
    </Card>
  );
};
