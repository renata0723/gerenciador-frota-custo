
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Archive, 
  FileCheck, 
  FileSpreadsheet, 
  MessageSquareQuote, 
  Truck, 
  Calendar,
  Info,
  Ban,
  ThumbsDown
} from 'lucide-react';
import FormularioDadosContrato from './FormularioDadosContrato';
import FormularioDocumentosRegistros from './FormularioDocumentosRegistros';
import FormularioObservacoes from './FormularioObservacoes';
import FormularioFreteContratado from './FormularioFreteContratado';
import ContratoNaoSalvo from './ContratoNaoSalvo';
import FormularioCancelamento from './FormularioCancelamento';
import FormularioRejeicaoContrato from './FormularioRejeicaoContrato';
import { ContratoFormTab } from '@/hooks/useContratoForm';

interface ContratoFormTabsProps {
  activeTab: string;
  setActiveTab: (tab: ContratoFormTab) => void;
  dadosContrato: any;
  dadosDocumentos: any;
  dadosFrete: any;
  dadosObservacoes: any;
  contrato: any;
  handleSaveContractData: (data: any) => void;
  handleSaveDocumentosData: (data: any) => void;
  handleSaveFreightData: (data: any) => void;
  handleSaveObservacoesData: (data: any) => void;
  contratoId?: string;
  readOnly?: boolean;
  onBackToContratos?: () => void;
}

const ContratoFormTabs: React.FC<ContratoFormTabsProps> = ({
  activeTab,
  setActiveTab,
  dadosContrato,
  dadosDocumentos,
  dadosFrete,
  dadosObservacoes,
  contrato,
  handleSaveContractData,
  handleSaveDocumentosData,
  handleSaveFreightData,
  handleSaveObservacoesData,
  contratoId,
  readOnly = false,
  onBackToContratos
}) => {
  const [cancelarContrato, setCancelarContrato] = useState(false);
  const [rejeitarContrato, setRejeitarContrato] = useState(false);
  
  // Função para voltar para a lista de contratos ou tab anterior
  const handleBack = () => {
    if (onBackToContratos) {
      onBackToContratos();
    } else {
      // Lógica para voltar para a tab anterior
      const tabs: ContratoFormTab[] = ['dados', 'documentos', 'frete', 'observacoes'];
      const currentIndex = tabs.indexOf(activeTab as ContratoFormTab);
      if (currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
      }
    }
  };
  
  // Função para verificar se a tab deve ser desabilitada
  const isTabDisabled = (tabName: string) => {
    if (readOnly) return false; // Em modo leitura, todas as tabs são acessíveis
    
    if (tabName === 'dados') return false;
    if (tabName === 'documentos') return !dadosContrato;
    if (tabName === 'frete') return !dadosContrato || !dadosDocumentos;
    if (tabName === 'observacoes') return !dadosContrato || !dadosDocumentos || !dadosFrete;
    if (tabName === 'cancelamento') return !contratoId;
    if (tabName === 'rejeicao') return !contratoId;
    
    return false;
  };
  
  // Se estiver rejeitando o contrato
  if (rejeitarContrato) {
    return (
      <FormularioRejeicaoContrato
        contrato={{ id: contratoId || '' }}
        onBack={() => setRejeitarContrato(false)}
        onSave={onBackToContratos || (() => setRejeitarContrato(false))}
      />
    );
  }
  
  // Se estiver cancelando o contrato
  if (cancelarContrato) {
    return (
      <FormularioCancelamento
        tipo="Contrato"
        numeroDocumento={contratoId || ''}
        onBack={() => setCancelarContrato(false)}
        onCancelamentoRealizado={onBackToContratos || (() => setCancelarContrato(false))}
      />
    );
  }
  
  return (
    <Tabs value={activeTab} onValueChange={(tab) => setActiveTab(tab as ContratoFormTab)} className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <TabsList className="mb-2 md:mb-0 overflow-x-auto flex-nowrap">
          <TabsTrigger value="dados" disabled={isTabDisabled('dados')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Dados Básicos
          </TabsTrigger>
          <TabsTrigger value="documentos" disabled={isTabDisabled('documentos')}>
            <FileCheck className="mr-2 h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="frete" disabled={isTabDisabled('frete')}>
            <Truck className="mr-2 h-4 w-4" />
            Frete
          </TabsTrigger>
          <TabsTrigger value="observacoes" disabled={isTabDisabled('observacoes')}>
            <MessageSquareQuote className="mr-2 h-4 w-4" />
            Observações
          </TabsTrigger>
        </TabsList>
        
        {contratoId && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setRejeitarContrato(true)}
              className="border-orange-500 text-orange-600 hover:bg-orange-50"
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              Rejeitar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCancelarContrato(true)}
              className="border-red-500 text-red-600 hover:bg-red-50"
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </div>
        )}
      </div>
      
      <TabsContent value="dados">
        {/* O nome da prop era o problema - "contrato" não existe em FormularioDadosContratoProps */}
        <FormularioDadosContrato
          initialData={dadosContrato}
          onSave={handleSaveContractData}
          onNext={() => setActiveTab('documentos')}
          readOnly={readOnly}
        />
      </TabsContent>
      
      <TabsContent value="documentos">
        {dadosContrato ? (
          <FormularioDocumentosRegistros
            initialData={dadosDocumentos}
            onSave={handleSaveDocumentosData}
            onBack={() => setActiveTab('dados')}
            readOnly={readOnly}
          />
        ) : (
          <ContratoNaoSalvo onVoltar={() => setActiveTab('dados')} />
        )}
      </TabsContent>
      
      <TabsContent value="frete">
        {dadosContrato && dadosDocumentos ? (
          <FormularioFreteContratado
            dadosContrato={dadosContrato}
            initialData={dadosFrete}
            onSave={handleSaveFreightData}
            onBack={() => setActiveTab('documentos')}
            onNext={() => setActiveTab('observacoes')}
          />
        ) : (
          <ContratoNaoSalvo onVoltar={() => setActiveTab('dados')} />
        )}
      </TabsContent>
      
      <TabsContent value="observacoes">
        {dadosContrato && dadosDocumentos && dadosFrete ? (
          <FormularioObservacoes
            initialData={dadosObservacoes}
            onSubmit={handleSaveObservacoesData}
            onBack={() => setActiveTab('frete')}
          />
        ) : (
          <ContratoNaoSalvo onVoltar={() => setActiveTab('dados')} />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ContratoFormTabs;
