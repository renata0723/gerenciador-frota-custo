
import React from 'react';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SaldoPagarOptionsProps {
  gerarSaldoPagar: boolean;
  setGerarSaldoPagar: (checked: boolean) => void;
  dataVencimento?: Date;
  setDataVencimento: (date?: Date) => void;
  isTipoFrota: boolean;
  saldoPagar: number;
}

const SaldoPagarOptions: React.FC<SaldoPagarOptionsProps> = ({
  gerarSaldoPagar,
  setGerarSaldoPagar,
  dataVencimento,
  setDataVencimento,
  isTipoFrota,
  saldoPagar
}) => {
  return (
    <div className="border rounded-md p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="gerarSaldoPagar"
          checked={gerarSaldoPagar}
          onCheckedChange={(checked) => {
            const isChecked = checked === true;
            setGerarSaldoPagar(isChecked);
          }}
          disabled={isTipoFrota || saldoPagar <= 0}
        />
        <label
          htmlFor="gerarSaldoPagar"
          className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
            isTipoFrota || saldoPagar <= 0 ? 'text-gray-400' : ''
          }`}
        >
          Gerar saldo a pagar para o proprietário
        </label>
      </div>
      
      {gerarSaldoPagar && (
        <div className="space-y-2 ml-6">
          <Label htmlFor="dataVencimento">Data prevista de pagamento</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-start text-left font-normal"
                disabled={!gerarSaldoPagar}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dataVencimento ? (
                  format(dataVencimento, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                ) : (
                  <span>Selecione a data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dataVencimento}
                onSelect={setDataVencimento}
                locale={ptBR}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
          
          <p className="text-xs text-gray-500 mt-1">
            Este saldo só poderá ser pago após o recebimento do canhoto assinado.
          </p>
        </div>
      )}
    </div>
  );
};

export default SaldoPagarOptions;
