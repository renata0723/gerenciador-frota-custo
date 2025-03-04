
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertTriangle, Ban, Loader2 } from 'lucide-react';
import FormularioDadosContrato from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import FormularioFreteContratado from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import FormularioCancelamento from '@/components/contratos/FormularioCancelamento';
import FormularioRejeicaoContrato from '@/components/contratos/FormularioRejeicaoContrato';
import { useContratoForm, ContratoFormTab } from '@/hooks/useContratoForm';

interface ContratoFormTabsProps {
  contratoId?: string;
  onContratoSalvo?: (contrato: any) => void;
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({ contratoId, onContratoSalvo }) => {
  const {
    activeTab,
    setActiveTab,
    dadosContrato,
    dadosFrete,
    dadosDocumentos,
    dadosObservacoes,
    carregando,
    contrato,
    handleSaveContractData,
    handleSaveDocumentosData,
    handleSaveFreightData,
    handleSaveObservacoesData,
    handleSaveAllData
  } = useContratoForm(contratoId, onContratoSalvo);

  if (carregando) {
    return (
      <div className="flex flex-col items-center justify-center p-10">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-lg text-gray-600">Carregando dados do contrato...</p>
      </div>
    );
  }

  if (activeTab === "cancelamento") {
    return (
      <FormularioCancelamento
        tipo="Contrato"
        numeroDocumento={contratoId || ""}
        onBack={() => setActiveTab("dados")}
        onCancelamentoRealizado={() => {
          if (onContratoSalvo) onContratoSalvo(contrato);
        }}
      />
    );
  }

  if (activeTab === "rejeicao") {
    return (
      <FormularioRejeicaoContrato
        contratoId={contratoId || ""}
        onBack={() => setActiveTab("dados")}
        onRejeicaoRealizada={() => {
          if (onContratoSalvo) onContratoSalvo(contrato);
        }}
      />
    );
  }

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContratoFormTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dados" disabled={activeTab === "cancelamento" || activeTab === "rejeicao"}>
          Dados do Contrato
        </TabsTrigger>
        <TabsTrigger 
          value="documentos" 
          disabled={!dadosContrato || activeTab === "cancelamento" || activeTab === "rejeicao"}
        >
          Documentos e Registros
        </TabsTrigger>
        <TabsTrigger 
          value="frete" 
          disabled={!dadosDocumentos || activeTab === "cancelamento" || activeTab === "rejeicao"}
        >
          Frete Contratado
        </TabsTrigger>
        <TabsTrigger 
          value="observacoes" 
          disabled={!dadosFrete || activeTab === "cancelamento" || activeTab === "rejeicao"}
        >
          Observações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="dados" className="pt-4">
        <FormularioDadosContrato
          onSave={handleSaveContractData}
          initialData={dadosContrato}
          readOnly={!!contrato?.status_contrato && contrato.status_contrato !== 'Em Andamento'}
        />
        
        {contrato && (
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              className="bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700"
              onClick={() => setActiveTab("cancelamento")}
              type="button"
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancelar Contrato
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
              onClick={() => setActiveTab("rejeicao")}
              type="button"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Rejeitar Contrato
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="documentos" className="pt-4">
        <FormularioDocumentosRegistros
          initialData={dadosDocumentos}
          onSave={handleSaveDocumentosData}
          onBack={() => setActiveTab("dados")}
          readOnly={!!contrato?.status_contrato && contrato.status_contrato !== 'Em Andamento'}
        />
      </TabsContent>

      <TabsContent value="frete" className="pt-4">
        <FormularioFreteContratado
          initialData={dadosFrete}
          dadosContrato={dadosContrato}
          onSave={handleSaveFreightData}
          onBack={() => setActiveTab("documentos")}
          readOnly={!!contrato?.status_contrato && contrato.status_contrato !== 'Em Andamento'}
        />
      </TabsContent>

      <TabsContent value="observacoes" className="pt-4">
        <FormularioObservacoes
          initialData={dadosObservacoes}
          onSave={handleSaveObservacoesData}
          onBack={() => setActiveTab("frete")}
          readOnly={!!contrato?.status_contrato && contrato.status_contrato !== 'Em Andamento'}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ContratoFormTabs;
