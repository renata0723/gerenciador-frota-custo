
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FormularioCTeDados from "./FormularioCTeDados";
import FormularioFreteContratado, { FreteContratadoData } from "./FormularioFreteContratado";
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

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({ onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState("cte");
  const [cteData, setCteData] = useState<CTeDadosData | undefined>(initialData?.cteData);
  const [freteContratadoData, setFreteContratadoData] = useState<FreteContratadoData | undefined>(
    initialData?.freteContratadoData
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
  };

  const handleSalvarContrato = () => {
    onSave({
      cteData,
      freteContratadoData
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
        </TabsList>

        <TabsContent value="cte">
          <FormularioCTeDados onSave={handleSaveCTe} initialData={cteData} />
        </TabsContent>

        <TabsContent value="frete-contratado">
          <FormularioFreteContratado onSave={handleSaveFreteContratado} initialData={freteContratadoData} />
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
