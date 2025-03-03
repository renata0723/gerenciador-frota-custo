
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FormularioCTeDados from '@/components/contratos/FormularioCTeDados';
import { FormularioFreteContratado } from '@/components/contratos/FormularioFreteContratado';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';

const ContratoFormTabs = () => {
  const [activeTab, setActiveTab] = useState("dados");
  
  // Funções para salvar os dados dos formulários
  const handleSaveContractData = (data: any) => {
    console.log("Dados do contrato salvos:", data);
    // Implementar lógica de salvamento
  };
  
  const handleSaveFreightData = (data: any) => {
    console.log("Dados do frete salvos:", data);
    // Implementar lógica de salvamento
  };
  
  const handleSaveCTeData = (data: any) => {
    console.log("Dados do CTe salvos:", data);
    // Implementar lógica de salvamento
  };
  
  const handleSaveRejectionData = (data: any) => {
    console.log("Dados de rejeição salvos:", data);
    // Implementar lógica de salvamento
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="dados" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
          <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
          <TabsTrigger value="cte">CTe e Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dados" className="p-4 space-y-4">
          {/* Formulário de dados do contrato */}
          <h2 className="text-xl font-bold">Dados do Contrato</h2>
          {/* Adicionar formulário aqui */}
        </TabsContent>
        
        <TabsContent value="frete" className="p-4 space-y-4">
          <FormularioFreteContratado onSubmit={handleSaveFreightData} onBack={() => setActiveTab("dados")} />
        </TabsContent>
        
        <TabsContent value="cte" className="p-4 space-y-4">
          <FormularioCTeDados onSave={handleSaveCTeData} />
        </TabsContent>
        
        <TabsContent value="rejeicao" className="p-4 space-y-4">
          <FormularioRejeicaoContrato onSave={handleSaveRejectionData} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ContratoFormTabs;
