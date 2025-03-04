
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { ptBR } from 'date-fns/locale';

interface DataAdiantamentoSelectorProps {
  dataAdiantamento: string;
  setDataAdiantamento: (data: string) => void;
}

const DataAdiantamentoSelector: React.FC<DataAdiantamentoSelectorProps> = ({ 
  dataAdiantamento, 
  setDataAdiantamento 
}) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDataAdiantamento(date.toISOString());
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Data Programada para Pagamento</Label>
          <DatePicker
            locale={ptBR}
            selected={dataAdiantamento ? new Date(dataAdiantamento) : undefined}
            onSelect={handleDateChange}
            placeholder="Selecione a data programada"
          />
          <p className="text-sm text-gray-500">Essa é a data prevista para o pagamento do restante ao parceiro</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataAdiantamentoSelector;
