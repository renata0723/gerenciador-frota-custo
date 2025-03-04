
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DataAdiantamentoSelectorProps {
  dataAdiantamento: string;
  setDataAdiantamento: (data: string) => void;
}

const DataAdiantamentoSelector: React.FC<DataAdiantamentoSelectorProps> = ({ 
  dataAdiantamento, 
  setDataAdiantamento 
}) => {
  const handleDataChange = (date: Date | undefined) => {
    if (date) {
      setDataAdiantamento(format(date, 'yyyy-MM-dd'));
    }
  };

  const getSelectedDate = (): Date | undefined => {
    if (!dataAdiantamento) return undefined;
    
    try {
      return parse(dataAdiantamento, 'yyyy-MM-dd', new Date());
    } catch (e) {
      console.error('Erro ao converter data:', e);
      return undefined;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Data Programada de Pagamento</Label>
          <p className="text-sm text-gray-600 mb-2">
            Selecione a data em que o pagamento do saldo será realizado
          </p>
          
          <DatePicker 
            selected={getSelectedDate()}
            onSelect={handleDataChange}
            placeholder="Selecione a data de pagamento"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DataAdiantamentoSelector;
