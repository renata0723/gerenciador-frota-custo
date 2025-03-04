
import React, { useState, useEffect } from 'react';
import { addDays } from "date-fns";
import { DadosContratoFormData } from './FormularioDadosContrato';
import FreteInfoAlert from './frete/FreteInfoAlert';
import ValoresFreteForm from './frete/ValoresFreteForm';
import DataAdiantamentoSelector from './frete/DataAdiantamentoSelector';
import SaldoPagarOptions from './frete/SaldoPagarOptions';
import ContabilizacaoOption from './frete/ContabilizacaoOption';
import FormNavigation from './frete/FormNavigation';

export interface FreteContratadoFormData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  gerarSaldoPagar: boolean;
  dataVencimento?: Date;
  dataAdiantamento?: Date;
  contabilizarFrete?: boolean;
  proprietarioInfo?: any;
}

interface FreteContratadoFormProps {
  onSubmit: (data: FreteContratadoFormData) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialData?: FreteContratadoFormData;
  dadosContrato?: DadosContratoFormData | null;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData,
  dadosContrato
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState(initialData?.valorFreteContratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState(initialData?.valorAdiantamento || 0);
  const [valorPedagio, setValorPedagio] = useState(initialData?.valorPedagio || 0);
  const [saldoPagar, setSaldoPagar] = useState(initialData?.saldoPagar || 0);
  const [gerarSaldoPagar, setGerarSaldoPagar] = useState(initialData?.gerarSaldoPagar || false);
  const [contabilizarFrete, setContabilizarFrete] = useState(initialData?.contabilizarFrete || false);
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(
    initialData?.dataVencimento || addDays(new Date(), 30)
  );
  const [dataAdiantamento, setDataAdiantamento] = useState<Date | undefined>(
    initialData?.dataAdiantamento || new Date()
  );
  const [dataAdiantamentoAberta, setDataAdiantamentoAberta] = useState(false);
  
  const isTipoFrota = dadosContrato?.tipo === 'frota';
  
  // Calcular o saldo a pagar automaticamente quando os valores mudam
  useEffect(() => {
    const calculatedSaldo = valorFreteContratado - valorAdiantamento - valorPedagio;
    setSaldoPagar(calculatedSaldo > 0 ? calculatedSaldo : 0);
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);
  
  // Se for tipo frota, limpar todos os valores
  useEffect(() => {
    if (isTipoFrota) {
      setValorFreteContratado(0);
      setValorAdiantamento(0);
      setValorPedagio(0);
      setSaldoPagar(0);
      setGerarSaldoPagar(false);
    }
  }, [isTipoFrota]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData: FreteContratadoFormData = {
      valorFreteContratado,
      valorAdiantamento,
      valorPedagio,
      saldoPagar,
      gerarSaldoPagar,
      dataVencimento,
      dataAdiantamento,
      contabilizarFrete,
      proprietarioInfo: dadosContrato?.proprietarioInfo
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FreteInfoAlert isTipoFrota={isTipoFrota} />
      
      {!isTipoFrota && (
        <>
          <ValoresFreteForm 
            valorFreteContratado={valorFreteContratado}
            valorAdiantamento={valorAdiantamento}
            valorPedagio={valorPedagio}
            saldoPagar={saldoPagar}
            setValorFreteContratado={setValorFreteContratado}
            setValorAdiantamento={setValorAdiantamento}
            setValorPedagio={setValorPedagio}
            disabled={isTipoFrota}
          />
          
          <DataAdiantamentoSelector 
            valorAdiantamento={valorAdiantamento}
            dataAdiantamento={dataAdiantamento}
            setDataAdiantamento={setDataAdiantamento}
            dataAdiantamentoAberta={dataAdiantamentoAberta}
            setDataAdiantamentoAberta={setDataAdiantamentoAberta}
          />
          
          <SaldoPagarOptions 
            gerarSaldoPagar={gerarSaldoPagar}
            setGerarSaldoPagar={setGerarSaldoPagar}
            dataVencimento={dataVencimento}
            setDataVencimento={setDataVencimento}
            isTipoFrota={isTipoFrota}
            saldoPagar={saldoPagar}
          />
          
          <ContabilizacaoOption 
            contabilizarFrete={contabilizarFrete}
            setContabilizarFrete={setContabilizarFrete}
            isTipoFrota={isTipoFrota}
          />
        </>
      )}
      
      <FormNavigation onBack={onBack} onNext={onNext} />
    </form>
  );
};

export default FreteContratadoForm;
