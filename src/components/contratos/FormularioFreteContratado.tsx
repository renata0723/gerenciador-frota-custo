
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DadosContratoFormData } from './FormularioDadosContrato';

interface FreteContratadoFormData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  gerarSaldoPagar: boolean;
  dataVencimento?: Date;
}

interface FormularioFreteContratadoProps {
  onSubmit: (data: FreteContratadoFormData) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialData?: FreteContratadoFormData;
  dadosContrato?: DadosContratoFormData | null;
}

export const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData,
  dadosContrato
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState(initialData?.valorFreteContratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState(initialData?.valorAdiantamento || 0);
  const [valorPedagio, setValorPedagio] = useState(initialData?.valorPedagio || 0);
  const [saldoPagar, setSaldoPagar] = useState(initialData?.saldoPagar || 0);
  const [gerarSaldoPagar, setGerarSaldoPagar] = useState(initialData?.gerarSaldoPagar || false);
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(
    initialData?.dataVencimento || addDays(new Date(), 30)
  );
  
  const isTipoFrota = dadosContrato?.tipo === 'frota';
  
  // Calcular o saldo a pagar automaticamente quando os valores mudam
  useEffect(() => {
    const calculatedSaldo = valorFreteContratado - valorAdiantamento - valorPedagio;
    setSaldoPagar(calculatedSaldo > 0 ? calculatedSaldo : 0);
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);
  
  // Se for tipo frota, limpar todos os valores
  useEffect(() => {
    if (isTipoFrota) {
      setValorFreteContratado(0);
      setValorAdiantamento(0);
      setValorPedagio(0);
      setSaldoPagar(0);
      setGerarSaldoPagar(false);
    }
  }, [isTipoFrota]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: FreteContratadoFormData = {
      valorFreteContratado,
      valorAdiantamento,
      valorPedagio,
      saldoPagar,
      gerarSaldoPagar,
      dataVencimento
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isTipoFrota ? (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertDescription>
            Este contrato é do tipo <strong>Frota</strong>, portanto não há valores de frete contratado.
          </AlertDescription>
        </Alert>
      ) : (
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
                disabled={isTipoFrota}
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
                disabled={isTipoFrota}
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
                disabled={isTipoFrota}
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
            </div>
          </div>
          
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
        </>
      )}
      
      <div className="flex justify-between pt-4">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
        )}
        <div className="flex space-x-2">
          {onNext && (
            <Button type="button" variant="outline" onClick={onNext}>
              Pular
            </Button>
          )}
          <Button type="submit">
            {onNext ? "Salvar e Continuar" : "Salvar"}
          </Button>
        </div>
      </div>
    </form>
  );
};
