
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FormularioDadosContrato from '@/components/contratos/FormularioDadosContrato';
import FormularioDocumentosRegistros from '@/components/contratos/FormularioDocumentosRegistros';
import FormularioFreteContratado from '@/components/contratos/FormularioFreteContratado';
import FormularioObservacoes from '@/components/contratos/FormularioObservacoes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export type ContratoFormTab = 'dados' | 'documentos' | 'frete' | 'observacoes';

// Tipos para os dados dos formulários
export interface DadosContratoFormData {
  dataSaida: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  clienteDestino: string;
  placaCavalo: string;
  placaCarreta: string;
  tipo: 'frota' | 'terceiro';
  motorista: string;
  proprietario?: string;
}

export interface DocumentosFormData {
  numeroManifesto: string[];
  numeroCTe: string[];
  valorCarga: number;
  notasFiscais: any[];
}

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  contabilizado: boolean;
  dataAdiantamento?: string;
  contaDebito?: string;
  contaCredito?: string;
}

export interface ObservacoesData {
  observacoes: string;
  quemEntregou?: string;
  dataEntrega?: string;
}

interface ContratoFormTabsProps {
  activeTab: ContratoFormTab;
  setActiveTab: (tab: ContratoFormTab) => void;
  dadosContrato: DadosContratoFormData;
  dadosFrete: FreteContratadoData;
  dadosDocumentos: DocumentosFormData;
  dadosObservacoes: ObservacoesData;
  contratoId?: string;
  onSalvarContrato: (dados: any) => Promise<void>;
  onFinalizarContrato: () => void;
  readOnly?: boolean;
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({
  activeTab,
  setActiveTab,
  dadosContrato,
  dadosFrete,
  dadosDocumentos,
  dadosObservacoes,
  contratoId,
  onSalvarContrato,
  onFinalizarContrato,
  readOnly = false
}) => {
  const [salvando, setSalvando] = useState(false);
  const [dadosContratoTemp, setDadosContratoTemp] = useState<DadosContratoFormData>(dadosContrato);
  const [dadosDocumentosTemp, setDadosDocumentosTemp] = useState<DocumentosFormData>(dadosDocumentos);
  const [dadosFreteTemp, setDadosFreteTemp] = useState<FreteContratadoData>(dadosFrete);
  const [dadosObservacoesTemp, setDadosObservacoesTemp] = useState<ObservacoesData>(dadosObservacoes);

  const handleSaveContractData = async (data: DadosContratoFormData) => {
    setSalvando(true);
    try {
      setDadosContratoTemp(data);
      await onSalvarContrato({
        ...dadosContratoTemp,
        ...dadosDocumentosTemp,
        ...dadosFreteTemp,
        ...dadosObservacoesTemp,
        ...data
      });
      setActiveTab('documentos');
      toast.success('Dados do contrato salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar dados do contrato:', error);
      toast.error('Erro ao salvar dados do contrato');
    } finally {
      setSalvando(false);
    }
  };

  const handleSaveDocumentosData = async (data: DocumentosFormData) => {
    setSalvando(true);
    try {
      setDadosDocumentosTemp(data);
      await onSalvarContrato({
        ...dadosContratoTemp,
        ...dadosDocumentosTemp,
        ...dadosFreteTemp,
        ...dadosObservacoesTemp,
        ...data
      });
      setActiveTab('frete');
      toast.success('Documentos do contrato salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar documentos do contrato:', error);
      toast.error('Erro ao salvar documentos do contrato');
    } finally {
      setSalvando(false);
    }
  };

  const handleSaveFreightData = async (data: FreteContratadoData) => {
    setSalvando(true);
    try {
      setDadosFreteTemp(data);
      await onSalvarContrato({
        ...dadosContratoTemp,
        ...dadosDocumentosTemp,
        ...dadosFreteTemp,
        ...dadosObservacoesTemp,
        ...data
      });
      setActiveTab('observacoes');
      toast.success('Dados do frete contratado salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar dados do frete contratado:', error);
      toast.error('Erro ao salvar dados do frete contratado');
    } finally {
      setSalvando(false);
    }
  };

  const handleSaveObservacoesData = async (data: ObservacoesData) => {
    setSalvando(true);
    try {
      setDadosObservacoesTemp(data);
      await onSalvarContrato({
        ...dadosContratoTemp,
        ...dadosDocumentosTemp,
        ...dadosFreteTemp,
        ...dadosObservacoesTemp,
        ...data
      });
      toast.success('Observações do contrato salvas com sucesso');
      onFinalizarContrato();
    } catch (error) {
      console.error('Erro ao salvar observações do contrato:', error);
      toast.error('Erro ao salvar observações do contrato');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ContratoFormTab)} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
        <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
        <TabsTrigger value="frete">Frete Contratado</TabsTrigger>
        <TabsTrigger value="observacoes">Observações</TabsTrigger>
      </TabsList>
      
      <TabsContent value="dados" className="p-4 space-y-4">
        <FormularioDadosContrato 
          onSave={handleSaveContractData} 
          onNext={() => setActiveTab("documentos")}
          initialData={dadosContratoTemp || undefined}
          readOnly={readOnly}
        />
      </TabsContent>
      
      <TabsContent value="documentos" className="p-4 space-y-4">
        <FormularioDocumentosRegistros 
          onSubmit={handleSaveDocumentosData}
          onBack={() => setActiveTab("dados")}
          initialData={dadosDocumentosTemp || undefined}
          readOnly={readOnly}
        />
      </TabsContent>
      
      <TabsContent value="frete" className="p-4 space-y-4">
        <FormularioFreteContratado 
          onSave={handleSaveFreightData} 
          onBack={() => setActiveTab("documentos")}
          initialData={dadosFreteTemp}
          dadosContrato={dadosContratoTemp}
          contrato={dadosContratoTemp}
        />
      </TabsContent>
      
      <TabsContent value="observacoes" className="p-4 space-y-4">
        <FormularioObservacoes 
          onSubmit={handleSaveObservacoesData}
          onBack={() => setActiveTab("frete")}
          initialData={dadosObservacoesTemp}
          readOnly={readOnly}
        />
        {!readOnly && (
          <div className="flex justify-end mt-4">
            <Button onClick={onFinalizarContrato} disabled={salvando}>
              Finalizar Contrato
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContratoFormTabs;
