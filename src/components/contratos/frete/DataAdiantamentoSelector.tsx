
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
            Selecione a data em que o pagamento do adiantamento será realizado
          </p>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dataAdiantamento && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataAdiantamento ? (
                  format(getSelectedDate() || new Date(), "PPP", { locale: ptBR })
                ) : (
                  <span>Selecione a data de pagamento</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={getSelectedDate()}
                onSelect={handleDataChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataAdiantamentoSelector;
