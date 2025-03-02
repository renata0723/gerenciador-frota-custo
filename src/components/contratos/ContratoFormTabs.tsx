
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FormularioCTeDados from "./FormularioCTeDados";
import { FormularioFreteContratado, FreteContratadoData } from "./FormularioFreteContratado";
import FormularioRejeicaoContrato from "./FormularioRejeicaoContrato";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Interfaces para os dados dos formulários
interface CTeDadosData {
  numeroCTe: string;
  valorCarga: number;
  valorFrete: number;
}

interface RejeicaoData {
  motivo: string;
  data: string;
}

interface ContratoFormTabsProps {
  onSave: (data: {
    cteData?: CTeDadosData;
    freteContratadoData?: FreteContratadoData;
    rejeicaoData?: RejeicaoData;
  }) => void;
  initialData?: {
    cteData?: CTeDadosData;
    freteContratadoData?: FreteContratadoData;
    rejeicaoData?: RejeicaoData;
  };
}

export const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({ onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState("cte");
  const [cteData, setCteData] = useState<CTeDadosData | undefined>(initialData?.cteData);
  const [freteContratadoData, setFreteContratadoData] = useState<FreteContratadoData | undefined>(
    initialData?.freteContratadoData
  );
  const [rejeicaoData, setRejeicaoData] = useState<RejeicaoData | undefined>(initialData?.rejeicaoData);

  const handleSaveCTe = (data: CTeDadosData) => {
    setCteData(data);
    toast.success("Dados do CTe salvos!");
    setActiveTab("frete-contratado");
  };

  const handleSaveFreteContratado = (data: FreteContratadoData) => {
    setFreteContratadoData(data);
    toast.success("Dados do frete contratado salvos!");
  };

  const handleSaveRejeicao = (data: RejeicaoData) => {
    setRejeicaoData(data);
    toast.success("Dados de rejeição salvos!");
  };

  const handleSalvarContrato = () => {
    onSave({
      cteData,
      freteContratadoData,
      rejeicaoData
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="cte" className="flex-1">
            CTe/Dados
          </TabsTrigger>
          <TabsTrigger value="frete-contratado" className="flex-1">
            Frete Contratado
          </TabsTrigger>
          <TabsTrigger value="rejeicao" className="flex-1">
            Rejeição
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cte">
          <FormularioCTeDados onSave={handleSaveCTe} initialData={cteData} />
        </TabsContent>

        <TabsContent value="frete-contratado">
          <FormularioFreteContratado onSave={handleSaveFreteContratado} initialData={freteContratadoData} />
        </TabsContent>

        <TabsContent value="rejeicao">
          <FormularioRejeicaoContrato onSave={handleSaveRejeicao} initialData={rejeicaoData} />
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
