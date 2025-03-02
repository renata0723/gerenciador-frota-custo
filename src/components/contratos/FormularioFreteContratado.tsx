
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormularioFreteContratadoProps {
  onSave: (data: FreteContratadoData) => void;
  initialData?: FreteContratadoData;
}

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  dataPagamentoAdiantamento: string;
  valorPedagio: number;
  saldoPagar: number;
}

export const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSave,
  initialData
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState<number>(initialData?.valorFreteContratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState<number>(initialData?.valorAdiantamento || 0);
  const [dataPagamentoAdiantamento, setDataPagamentoAdiantamento] = useState<string>(
    initialData?.dataPagamentoAdiantamento || ""
  );
  const [valorPedagio, setValorPedagio] = useState<number>(initialData?.valorPedagio || 0);
  const [saldoPagar, setSaldoPagar] = useState<number>(initialData?.saldoPagar || 0);

  // Calcular saldo a pagar automaticamente
  useEffect(() => {
    const calculoSaldo = valorFreteContratado - valorAdiantamento - valorPedagio;
    setSaldoPagar(calculoSaldo >= 0 ? calculoSaldo : 0);
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (valorFreteContratado <= 0) {
      toast.error("O valor do frete contratado deve ser maior que zero");
      return;
    }

    const data: FreteContratadoData = {
      valorFreteContratado,
      valorAdiantamento,
      dataPagamentoAdiantamento,
      valorPedagio,
      saldoPagar
    };

    onSave(data);
    toast.success("Dados do frete contratado salvos com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$)</Label>
          <Input
            id="valorFreteContratado"
            type="number"
            step="0.01"
            value={valorFreteContratado}
            onChange={(e) => setValorFreteContratado(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
          <Input
            id="valorAdiantamento"
            type="number"
            step="0.01"
            value={valorAdiantamento}
            onChange={(e) => setValorAdiantamento(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataPagamentoAdiantamento">Data do Pagamento do Adiantamento</Label>
          <Input
            id="dataPagamentoAdiantamento"
            type="date"
            value={dataPagamentoAdiantamento}
            onChange={(e) => setDataPagamentoAdiantamento(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
          <Input
            id="valorPedagio"
            type="number"
            step="0.01"
            value={valorPedagio}
            onChange={(e) => setValorPedagio(parseFloat(e.target.value) || 0)}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="saldoPagar">Saldo a Pagar (R$)</Label>
          <Input
            id="saldoPagar"
            type="number"
            step="0.01"
            value={saldoPagar}
            readOnly
            className="bg-gray-100"
          />
          <p className="text-sm text-gray-500">Valor calculado automaticamente</p>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="submit" variant="default">
          Salvar e Lançar Saldo a Pagar
        </Button>
      </div>
    </form>
  );
};

export default FormularioFreteContratado;
