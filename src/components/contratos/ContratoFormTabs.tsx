
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FormularioCTeDados from "./FormularioCTeDados";
import FormularioFreteContratado, { FreteContratadoData } from "./FormularioFreteContratado";
import FormularioRejeicaoContrato from "./FormularioRejeicaoContrato";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Interfaces para os dados dos formulários
interface CTeDadosData {
  numeroCTe: string;
  valorCarga: number;
  valorFrete: number;
}

interface ObservacoesData {
  responsavelEntrega: string;
  dataEntrega: string;
  observacoes: string;
}

interface ContratoFormTabsProps {
  onSave: (data: {
    cteData?: CTeDadosData;
    freteContratadoData?: FreteContratadoData;
    observacoesData?: ObservacoesData;
  }) => void;
  initialData?: {
    cteData?: CTeDadosData;
    freteContratadoData?: FreteContratadoData;
    observacoesData?: ObservacoesData;
  };
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({ onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState("cte");
  const [cteData, setCteData] = useState<CTeDadosData | undefined>(initialData?.cteData);
  const [freteContratadoData, setFreteContratadoData] = useState<FreteContratadoData | undefined>(
    initialData?.freteContratadoData
  );
  const [observacoesData, setObservacoesData] = useState<ObservacoesData | undefined>(
    initialData?.observacoesData || {
      responsavelEntrega: '',
      dataEntrega: '',
      observacoes: ''
    }
  );

  const handleSaveCTe = (data: CTeDadosData) => {
    setCteData(data);
    toast.success("Dados do CTe salvos!");
    setActiveTab("frete-contratado");
  };

  const handleSaveFreteContratado = (data: FreteContratadoData) => {
    setFreteContratadoData(data);
    toast.success("Dados do frete contratado salvos!");
    // Aqui podemos adicionar lógica para lançar no módulo de saldo a pagar
    toast.info("Saldo a pagar lançado no módulo correspondente");
    setActiveTab("observacoes");
  };

  const handleObservacoesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setObservacoesData(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleSalvarContrato = () => {
    onSave({
      cteData,
      freteContratadoData,
      observacoesData
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <FormularioRejeicaoContrato 
          idContrato="123" 
          onRejeicaoRegistrada={() => toast.info("Contrato rejeitado com sucesso!")}
        />
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="cte" className="flex-1">
            CTe/Dados
          </TabsTrigger>
          <TabsTrigger value="frete-contratado" className="flex-1">
            Frete Contratado
          </TabsTrigger>
          <TabsTrigger value="observacoes" className="flex-1">
            Observações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cte">
          <FormularioCTeDados onSave={handleSaveCTe} initialData={cteData} />
        </TabsContent>

        <TabsContent value="frete-contratado">
          <FormularioFreteContratado onSave={handleSaveFreteContratado} initialData={freteContratadoData} />
        </TabsContent>

        <TabsContent value="observacoes">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsavelEntrega">Responsável pela Entrega do Contrato</Label>
                <Input
                  id="responsavelEntrega"
                  name="responsavelEntrega"
                  value={observacoesData?.responsavelEntrega}
                  onChange={handleObservacoesChange}
                />
              </div>
              <div>
                <Label htmlFor="dataEntrega">Data de Entrega</Label>
                <Input
                  id="dataEntrega"
                  name="dataEntrega"
                  type="date"
                  value={observacoesData?.dataEntrega}
                  onChange={handleObservacoesChange}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                name="observacoes"
                rows={4}
                value={observacoesData?.observacoes}
                onChange={handleObservacoesChange}
                placeholder="Insira aqui quaisquer observações relevantes sobre o contrato..."
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end mt-8">
        <Button onClick={handleSalvarContrato} className="px-8">
          Salvar Contrato
        </Button>
      </div>
    </div>
  );
};

export default ContratoFormTabs;
