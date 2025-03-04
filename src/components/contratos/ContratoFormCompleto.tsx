
import React from 'react';
import { Card } from '@/components/ui/card';
import ContratoLoading from '@/components/contratos/ContratoLoading';
import ContratoAbas from '@/components/contratos/ContratoAbas';
import { useContratoForm } from '@/hooks/useContratoForm';

interface ContratoFormCompletoProps {
  contratoId?: string;
  onContratoSalvo?: (data: any) => void;
}

const ContratoFormCompleto: React.FC<ContratoFormCompletoProps> = ({ 
  contratoId,
  onContratoSalvo
}) => {
  const {
    activeTab,
    setActiveTab,
    dadosContrato,
    dadosFrete,
    dadosDocumentos,
    dadosObservacoes,
    carregando,
    handleSaveContractData,
    handleSaveDocumentosData,
    handleSaveFreightData,
    handleSaveObservacoesData
  } = useContratoForm(contratoId, onContratoSalvo);

  return (
    <Card className="w-full">
      {carregando ? (
        <ContratoLoading />
      ) : (
        <ContratoAbas 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleSaveContractData={handleSaveContractData}
          handleSaveDocumentosData={handleSaveDocumentosData}
          handleSaveFreightData={handleSaveFreightData}
          handleSaveObservacoesData={handleSaveObservacoesData}
          dadosContrato={dadosContrato}
          dadosFrete={dadosFrete}
          dadosDocumentos={dadosDocumentos}
          dadosObservacoes={dadosObservacoes}
          contratoId={contratoId}
        />
      )}
    </Card>
  );
};

export default ContratoFormCompleto;
