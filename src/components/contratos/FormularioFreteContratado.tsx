
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface FormularioFreteContratadoProps {
  onSave: (data: FreteContratadoData) => void;
  initialData?: FreteContratadoData;
}

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  dataAdiantamento: string;
  valorPedagio: number;
  saldoPagar: number;
}

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSave,
  initialData
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState(initialData?.valorFreteContratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState(initialData?.valorAdiantamento || 0);
  const [dataAdiantamento, setDataAdiantamento] = useState(initialData?.dataAdiantamento || "");
  const [valorPedagio, setValorPedagio] = useState(initialData?.valorPedagio || 0);
  const [saldoPagar, setSaldoPagar] = useState(initialData?.saldoPagar || 0);

  useEffect(() => {
    // Calcula o saldo a pagar
    const calculaSaldo = Number(valorFreteContratado) - (Number(valorAdiantamento) + Number(valorPedagio));
    setSaldoPagar(calculaSaldo > 0 ? calculaSaldo : 0);
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: FreteContratadoData = {
      valorFreteContratado: Number(valorFreteContratado),
      valorAdiantamento: Number(valorAdiantamento),
      dataAdiantamento,
      valorPedagio: Number(valorPedagio),
      saldoPagar
    };
    
    onSave(data);
    toast.success("Dados do frete contratado salvos com sucesso!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$)</Label>
          <Input
            id="valorFreteContratado"
            type="number"
            step="0.01"
            value={valorFreteContratado}
            onChange={(e) => setValorFreteContratado(Number(e.target.value))}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
          <Input
            id="valorAdiantamento"
            type="number"
            step="0.01"
            value={valorAdiantamento}
            onChange={(e) => setValorAdiantamento(Number(e.target.value))}
          />
        </div>

        <div>
          <Label htmlFor="dataAdiantamento">Data do Adiantamento</Label>
          <Input
            id="dataAdiantamento"
            type="date"
            value={dataAdiantamento}
            onChange={(e) => setDataAdiantamento(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
          <Input
            id="valorPedagio"
            type="number"
            step="0.01"
            value={valorPedagio}
            onChange={(e) => setValorPedagio(Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="saldoPagar">Saldo a Pagar (R$)</Label>
        <Input
          id="saldoPagar"
          type="number"
          step="0.01"
          value={saldoPagar}
          readOnly
          className="bg-gray-100"
        />
        <p className="text-sm text-gray-500 mt-1">Valor calculado automaticamente</p>
      </div>

      <Button type="submit" className="w-full">Salvar Dados do Frete</Button>
    </form>
  );
};

export default FormularioFreteContratado;
