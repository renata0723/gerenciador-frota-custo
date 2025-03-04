
import React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DataAdiantamentoSelectorProps {
  valorAdiantamento: number;
  dataAdiantamento?: Date;
  setDataAdiantamento: (date?: Date) => void;
  dataAdiantamentoAberta: boolean;
  setDataAdiantamentoAberta: (open: boolean) => void;
}

const DataAdiantamentoSelector: React.FC<DataAdiantamentoSelectorProps> = ({
  valorAdiantamento,
  dataAdiantamento,
  setDataAdiantamento,
  dataAdiantamentoAberta,
  setDataAdiantamentoAberta
}) => {
  if (valorAdiantamento <= 0) return null;

  return (
    <div className="space-y-2 ml-6 border-l-2 border-blue-200 pl-4">
      <Label htmlFor="dataAdiantamento">Data de pagamento do adiantamento</Label>
      <Popover open={dataAdiantamentoAberta} onOpenChange={setDataAdiantamentoAberta}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full flex justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dataAdiantamento ? (
              format(dataAdiantamento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
            ) : (
              <span>Selecione a data</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={dataAdiantamento}
            onSelect={setDataAdiantamento}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DataAdiantamentoSelector;
