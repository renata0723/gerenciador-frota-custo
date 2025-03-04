
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import FormNavigation from './frete/FormNavigation';
import FreteInfoAlert from './frete/FreteInfoAlert';
import SaldoPagarOptions from './frete/SaldoPagarOptions';
import DataAdiantamentoSelector from './frete/DataAdiantamentoSelector';
import ContabilizacaoOption from './frete/ContabilizacaoOption';
import ValoresFreteForm from './frete/ValoresFreteForm';
import { formatCurrency } from '@/utils/formatters';

export interface FreteContratadoFormData {
  valor_frete_contratado?: number;
  valor_adiantamento?: number;
  valor_pedagio?: number;
  saldo_pagar?: number; 
  data_programada_pagamento?: string;
  contabilizado?: boolean;
}

interface FreteContratadoFormProps {
  isTipoFrota: boolean;
  initialData?: FreteContratadoFormData;
  onSubmit: (data: FreteContratadoFormData) => void;
  onBack?: () => void;
  onNext?: () => void;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({
  isTipoFrota,
  initialData,
  onSubmit,
  onBack,
  onNext,
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState<string>(
    initialData?.valor_frete_contratado ? initialData.valor_frete_contratado.toString() : ''
  );
  const [valorAdiantamento, setValorAdiantamento] = useState<string>(
    initialData?.valor_adiantamento ? initialData.valor_adiantamento.toString() : ''
  );
  const [valorPedagio, setValorPedagio] = useState<string>(
    initialData?.valor_pedagio ? initialData.valor_pedagio.toString() : ''
  );
  const [saldoPagar, setSaldoPagar] = useState<number | undefined>(initialData?.saldo_pagar);
  const [dataProgramadaPagamento, setDataProgramadaPagamento] = useState<string>(
    initialData?.data_programada_pagamento || ''
  );
  const [contabilizado, setContabilizado] = useState<boolean>(initialData?.contabilizado || false);

  useEffect(() => {
    // Atualizar saldo a pagar sempre que os valores mudarem
    if (!valorFreteContratado || isNaN(parseFloat(valorFreteContratado))) {
      setSaldoPagar(undefined);
      return;
    }

    const freteContratado = parseFloat(valorFreteContratado) || 0;
    const adiantamento = parseFloat(valorAdiantamento) || 0;
    const pedagio = parseFloat(valorPedagio) || 0;
    
    const novoSaldo = freteContratado - adiantamento - pedagio;
    setSaldoPagar(novoSaldo > 0 ? novoSaldo : 0);
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isTipoFrota) {
      // Validar campos obrigatórios
      if (!valorFreteContratado || parseFloat(valorFreteContratado) <= 0) {
        alert('O valor do frete contratado é obrigatório.');
        return;
      }
    }

    onSubmit({
      valor_frete_contratado: valorFreteContratado ? parseFloat(valorFreteContratado) : undefined,
      valor_adiantamento: valorAdiantamento ? parseFloat(valorAdiantamento) : undefined,
      valor_pedagio: valorPedagio ? parseFloat(valorPedagio) : undefined,
      saldo_pagar: saldoPagar,
      data_programada_pagamento: dataProgramadaPagamento,
      contabilizado: contabilizado
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Alerta informativo para contratos do tipo frota */}
      <FreteInfoAlert isTipoFrota={isTipoFrota} />
      
      {!isTipoFrota && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <ValoresFreteForm 
              valorFreteContratado={valorFreteContratado}
              setValorFreteContratado={setValorFreteContratado}
              valorAdiantamento={valorAdiantamento}
              setValorAdiantamento={setValorAdiantamento}
              valorPedagio={valorPedagio}
              setValorPedagio={setValorPedagio}
            />
            
            <div className="space-y-4">
              <SaldoPagarOptions 
                saldoPagar={saldoPagar}
                formattedSaldoPagar={saldoPagar !== undefined ? formatCurrency(saldoPagar) : '-'}
              />
              
              <Separator className="my-4" />
              
              <DataAdiantamentoSelector 
                dataProgramadaPagamento={dataProgramadaPagamento}
                setDataProgramadaPagamento={setDataProgramadaPagamento}
              />
              
              <Separator className="my-4" />
              
              <ContabilizacaoOption 
                contabilizado={contabilizado}
                setContabilizado={setContabilizado}
              />
            </div>
          </div>
        </>
      )}
      
      <FormNavigation onBack={onBack} onNext={onNext} />
    </form>
  );
};

export default FreteContratadoForm;
