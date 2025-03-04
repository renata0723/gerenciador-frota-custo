
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Info, DollarSign, Truck, Road } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FreteInfoAlert from './frete/FreteInfoAlert';
import SaldoPagarOptions from './frete/SaldoPagarOptions';
import DataAdiantamentoSelector from './frete/DataAdiantamentoSelector';
import ContabilizacaoOption from './frete/ContabilizacaoOption';
import FormNavigation from './frete/FormNavigation';
import ValoresFreteForm from './frete/ValoresFreteForm';
import { formatCurrency } from '@/utils/constants';

// Definição de tipos
interface FreteContratadoFormProps {
  contrato: any;
  onSave: (data: any) => void;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({ contrato, onSave }) => {
  // Estados para os valores
  const [valorFreteContratado, setValorFreteContratado] = useState<number>(contrato?.valor_frete_contratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState<number>(contrato?.valor_adiantamento || 0);
  const [valorPedagio, setValorPedagio] = useState<number>(contrato?.valor_pedagio || 0);
  const [dataAdiantamento, setDataAdiantamento] = useState<string>(contrato?.data_programada_pagamento || '');
  const [contabilizado, setContabilizado] = useState<boolean>(contrato?.contabilizado || false);
  
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
    <div className="space-y-6">
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
