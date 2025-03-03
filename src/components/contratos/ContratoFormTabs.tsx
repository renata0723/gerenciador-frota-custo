
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormularioDadosContrato, { DadosContratoFormData } from '@/components/contratos/FormularioDadosContrato';
import FormularioCTeDados from '@/components/contratos/FormularioCTeDados';
import { FormularioFreteContratado } from '@/components/contratos/FormularioFreteContratado';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import { toast } from 'sonner';
import { ThumbsDown } from 'lucide-react';

const ContratoFormTabs = () => {
  const [activeTab, setActiveTab] = useState("dados");
  const [dadosContrato, setDadosContrato] = useState<DadosContratoFormData | null>(null);
  const [dadosFrete, setDadosFrete] = useState<any | null>(null);
  const [dadosCTe, setDadosCTe] = useState<any | null>(null);
  
  // Funções para salvar os dados dos formulários
  const handleSaveContractData = (data: DadosContratoFormData) => {
    console.log("Dados do contrato salvos:", data);
    setDadosContrato(data);
    toast.success("Dados do contrato salvos com sucesso!");
  };
  
  const handleSaveFreightData = (data: any) => {
    console.log("Dados do frete salvos:", data);
    setDadosFrete(data);
    toast.success("Dados do frete salvos com sucesso!");
  };
  
  const handleSaveCTeData = (data: any) => {
    console.log("Dados do CTe salvos:", data);
    setDadosCTe(data);
    toast.success("Dados do CTe salvos com sucesso!");
    // Aqui você poderia chamar uma função para salvar todos os dados coletados
    handleSaveAllData();
  };
  
  const handleSaveRejectionData = (data: any) => {
    console.log("Dados de rejeição salvos:", data);
    toast.success("Contrato rejeitado com sucesso!");
  };

  const handleSaveAllData = () => {
    // Aqui você enviaria todos os dados para o servidor
    const contratoCompleto = {
      dadosContrato,
      dadosFrete,
      dadosCTe
    };
    console.log("Contrato completo para salvar:", contratoCompleto);
    toast.success("Contrato registrado com sucesso!");
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="dados" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
          <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
          <TabsTrigger value="cte">CTe e Documentos</TabsTrigger>
          <TabsTrigger value="rejeicao">
            <ThumbsDown className="h-4 w-4 mr-2" />
            Rejeição
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados" className="p-4 space-y-4">
          <FormularioDadosContrato 
            onSubmit={handleSaveContractData} 
            onNext={() => setActiveTab("frete")}
            initialData={dadosContrato || undefined}
          />
        </TabsContent>
        
        <TabsContent value="frete" className="p-4 space-y-4">
          <FormularioFreteContratado 
            onSubmit={handleSaveFreightData} 
            onBack={() => setActiveTab("dados")}
            onNext={() => setActiveTab("cte")}
            initialData={dadosFrete || undefined}
          />
        </TabsContent>
        
        <TabsContent value="cte" className="p-4 space-y-4">
          <FormularioCTeDados 
            onSave={handleSaveCTeData} 
            initialData={dadosCTe || undefined}
          />
          
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => setActiveTab("frete")}>
              Voltar
            </Button>
            <Button onClick={handleSaveAllData}>
              Finalizar Contrato
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="rejeicao" className="p-4 space-y-4">
          <FormularioRejeicaoContrato onSave={handleSaveRejectionData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContratoFormTabs;
