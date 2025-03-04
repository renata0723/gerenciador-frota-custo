
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormularioDadosContrato from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import FormularioFreteContratado from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import ContratoNaoSalvo from '@/components/contratos/ContratoNaoSalvo';
import { ContratoFormTab } from '@/hooks/useContratoForm';

interface ContratoAbasProps {
  activeTab: ContratoFormTab;
  setActiveTab: (tab: ContratoFormTab) => void;
  handleSaveContractData: any;
  handleSaveDocumentosData: any;
  handleSaveFreightData: any;
  handleSaveObservacoesData: any;
  dadosContrato: any;
  dadosFrete: any;
  dadosDocumentos: any;
  dadosObservacoes: any;
  contratoId?: string;
}

const ContratoAbas: React.FC<ContratoAbasProps> = ({
  activeTab,
  setActiveTab,
  handleSaveContractData,
  handleSaveDocumentosData,
  handleSaveFreightData,
  handleSaveObservacoesData,
  dadosContrato,
  dadosFrete,
  dadosDocumentos,
  dadosObservacoes,
  contratoId
}) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContratoFormTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
        <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
        <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
        <TabsTrigger value="observacoes">Observações</TabsTrigger>
        <TabsTrigger value="cancelamento">Cancelamento</TabsTrigger>
        <TabsTrigger value="rejeicao">Rejeição</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dados" className="p-4 space-y-4">
        <FormularioDadosContrato 
          onSave={handleSaveContractData} 
          onNext={() => setActiveTab("documentos")}
          initialData={dadosContrato || undefined}
        />
      </TabsContent>
      
      <TabsContent value="documentos" className="p-4 space-y-4">
        <FormularioDocumentosRegistros 
          onSubmit={handleSaveDocumentosData}
          onBack={() => setActiveTab("dados")}
          onNext={() => setActiveTab("frete")}
          initialData={dadosDocumentos || undefined}
        />
      </TabsContent>
      
      <TabsContent value="frete" className="p-4 space-y-4">
        <FormularioFreteContratado 
          onSave={handleSaveFreightData} 
          onBack={() => setActiveTab("documentos")}
          onNext={() => setActiveTab("observacoes")}
          initialData={dadosFrete || undefined}
          dadosContrato={dadosContrato}
          contrato={dadosContrato}
        />
      </TabsContent>
      
      <TabsContent value="observacoes" className="p-4 space-y-4">
        <FormularioObservacoes 
          onSubmit={handleSaveObservacoesData}
          onBack={() => setActiveTab("frete")}
          initialData={dadosObservacoes || undefined}
        />
      </TabsContent>
      
      <TabsContent value="cancelamento" className="p-4 space-y-4">
        {contratoId ? (
          <FormularioCancelamento
            numeroDocumento={contratoId}
            onBack={() => setActiveTab("observacoes")}
          />
        ) : (
          <ContratoNaoSalvo onVoltar={() => setActiveTab("dados")} />
        )}
      </TabsContent>
      
      <TabsContent value="rejeicao" className="p-4 space-y-4">
        {contratoId ? (
          <FormularioRejeicaoContrato
            contrato={{ id: contratoId }}
            onBack={() => setActiveTab("observacoes")}
            onSave={() => {}}
          />
        ) : (
          <ContratoNaoSalvo onVoltar={() => setActiveTab("dados")} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContratoAbas;
