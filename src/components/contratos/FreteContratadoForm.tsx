import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Truck, Banknote, CreditCard } from 'lucide-react';
import { FreteContratadoData } from '@/hooks/useContratoForm';
import ValoresFreteForm from './frete/ValoresFreteForm';
import SaldoPagarOptions from './frete/SaldoPagarOptions';
import ContabilizacaoOption from './frete/ContabilizacaoOption';
import DataAdiantamentoSelector from './frete/DataAdiantamentoSelector';
import FreteInfoAlert from './frete/FreteInfoAlert';
import FormNavigation from './frete/FormNavigation';

interface FreteContratadoFormProps {
  contrato: any;
  onSave: (data: any) => void;
  initialData?: FreteContratadoData;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({ 
  contrato, 
  onSave,
  initialData
}) => {
  // Estados para os valores
  const [valorFreteContratado, setValorFreteContratado] = useState<number>(initialData?.valor_frete_contratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState<number>(initialData?.valor_adiantamento || 0);
  const [valorPedagio, setValorPedagio] = useState<number>(initialData?.valor_pedagio || 0);
  const [dataAdiantamento, setDataAdiantamento] = useState<string>(initialData?.data_programada_pagamento || '');
  const [contabilizado, setContabilizado] = useState<boolean>(initialData?.contabilizado || false);
  
  // Calcular saldo a pagar
  const saldoPagar = valorFreteContratado - valorAdiantamento - valorPedagio;
  
  // Função para atualizar os valores diretamente
  const handleValorFreteChange = (valor: number) => {
    setValorFreteContratado(valor);
  };
  
  const handleValorAdiantamentoChange = (valor: number) => {
    setValorAdiantamento(valor);
  };
  
  const handleValorPedagioChange = (valor: number) => {
    setValorPedagio(valor);
  };

  const handleSave = () => {
    onSave({
      ...contrato,
      valor_frete_contratado: valorFreteContratado,
      valor_adiantamento: valorAdiantamento,
      valor_pedagio: valorPedagio,
      saldo_pagar: saldoPagar,
      data_programada_pagamento: dataAdiantamento,
      contabilizado: contabilizado
    });
  };

  return (
    <div className="space-y-4">
      <FreteInfoAlert 
        placaCavalo={contrato?.placa_cavalo} 
        motorista={contrato?.motorista}
      />
      
      <ValoresFreteForm 
        valorFreteContratado={valorFreteContratado}
        onValorFreteChange={handleValorFreteChange}
        valorAdiantamento={valorAdiantamento}
        onValorAdiantamentoChange={handleValorAdiantamentoChange}
        valorPedagio={valorPedagio}
        onValorPedagioChange={handleValorPedagioChange}
      />

      <SaldoPagarOptions 
        saldoPagar={saldoPagar}
      />
      
      <DataAdiantamentoSelector 
        dataAdiantamento={dataAdiantamento}
        setDataAdiantamento={setDataAdiantamento}
      />
      
      <ContabilizacaoOption 
        isContabilizado={contabilizado}
        setIsContabilizado={setContabilizado}
      />
      
      <FormNavigation 
        onBack={() => {}}
        onSave={handleSave}
        isValid={true}
      />
    </div>
  );
};

export default FreteContratadoForm;
