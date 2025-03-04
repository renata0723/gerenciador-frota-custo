
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Truck, Banknote, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/constants';
import { CONTAS_CONTABEIS } from '@/utils/constants';
import ValoresFreteForm from './frete/ValoresFreteForm';
import SaldoPagarOptions from './frete/SaldoPagarOptions';
import ContabilizacaoOption from './frete/ContabilizacaoOption';
import DataAdiantamentoSelector from './frete/DataAdiantamentoSelector';
import FreteInfoAlert from './frete/FreteInfoAlert';
import FormNavigation from './frete/FormNavigation';

interface FreteContratadoFormProps {
  contrato: any;
  onSave: (data: any) => void;
  initialData?: any;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({ 
  contrato, 
  onSave,
  initialData
}) => {
  // Estados para os valores
  const [valorFreteContratado, setValorFreteContratado] = useState<number>(initialData?.valorFreteContratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState<number>(initialData?.valorAdiantamento || 0);
  const [valorPedagio, setValorPedagio] = useState<number>(initialData?.valorPedagio || 0);
  const [dataAdiantamento, setDataAdiantamento] = useState<string>(initialData?.dataProgramadaPagamento || '');
  const [contabilizado, setContabilizado] = useState<boolean>(initialData?.contabilizado || false);
  const [adiantamentoEfetuado, setAdiantamentoEfetuado] = useState<boolean>(initialData?.adiantamentoEfetuado || false);
  
  // Estados para contabilização
  const [contaDebitoFrete, setContaDebitoFrete] = useState<string>(initialData?.contaDebitoFrete || CONTAS_CONTABEIS.CLIENTES);
  const [contaCreditoFrete, setContaCreditoFrete] = useState<string>(initialData?.contaCreditoFrete || CONTAS_CONTABEIS.RECEITA_FRETE);
  const [contaDebitoAdiantamento, setContaDebitoAdiantamento] = useState<string>(initialData?.contaDebitoAdiantamento || CONTAS_CONTABEIS.ADIANTAMENTO_FORNECEDORES);
  const [contaCreditoAdiantamento, setContaCreditoAdiantamento] = useState<string>(initialData?.contaCreditoAdiantamento || CONTAS_CONTABEIS.CAIXA);
  const [centroCusto, setCentroCusto] = useState<string>(initialData?.centroCusto || '');
  const [bancoAdiantamento, setBancoAdiantamento] = useState<string>(initialData?.bancoAdiantamento || '');
  
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
      valorFreteContratado: valorFreteContratado,
      valorAdiantamento: valorAdiantamento,
      valorPedagio: valorPedagio,
      saldoPagar: saldoPagar,
      dataProgramadaPagamento: dataAdiantamento,
      contabilizado: contabilizado,
      adiantamentoEfetuado: adiantamentoEfetuado,
      contaDebitoFrete: contaDebitoFrete,
      contaCreditoFrete: contaCreditoFrete,
      contaDebitoAdiantamento: contaDebitoAdiantamento,
      contaCreditoAdiantamento: contaCreditoAdiantamento,
      centroCusto: centroCusto,
      bancoAdiantamento: bancoAdiantamento
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
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Adiantamento</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-base font-medium">Adiantamento Efetuado</label>
                <p className="text-sm text-gray-500 mt-1">
                  Marque esta opção se o adiantamento já foi realizado
                </p>
              </div>
              <div className="relative inline-block">
                <input 
                  type="checkbox" 
                  className="peer sr-only" 
                  id="adiantamento-efetuado"
                  checked={adiantamentoEfetuado}
                  onChange={(e) => setAdiantamentoEfetuado(e.target.checked)}
                />
                <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DataAdiantamentoSelector 
        dataAdiantamento={dataAdiantamento}
        setDataAdiantamento={setDataAdiantamento}
      />
      
      <ContabilizacaoOption 
        isContabilizado={contabilizado}
        setIsContabilizado={setContabilizado}
        contaDebito={contaDebitoFrete}
        setContaDebito={setContaDebitoFrete}
        contaCredito={contaCreditoFrete}
        setContaCredito={setContaCreditoFrete}
        centroCusto={centroCusto}
        setCentroCusto={setCentroCusto}
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
