
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Banknote, Truck, CreditCard, Info } from 'lucide-react';
import { formatCurrency } from '@/utils/constants';
import { Label } from '@/components/ui/label';
import { CONTAS_CONTABEIS } from '@/utils/constants';
import ValoresFreteForm from './frete/ValoresFreteForm';
import SaldoPagarOptions from './frete/SaldoPagarOptions';
import ContabilizacaoOption from './frete/ContabilizacaoOption';
import DataAdiantamentoSelector from './frete/DataAdiantamentoSelector';
import FreteInfoAlert from './frete/FreteInfoAlert';
import FormNavigation from './frete/FormNavigation';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bancos } from '@/utils/constants';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const [gerarSaldoPagar, setGerarSaldoPagar] = useState<boolean>(
    initialData?.gerarSaldoPagar !== undefined ? initialData.gerarSaldoPagar : true
  );
  const [dataVencimento, setDataVencimento] = useState<Date | undefined>(
    initialData?.dataVencimento ? new Date(initialData.dataVencimento) : undefined
  );
  
  // Estados para contabilização
  const [contaDebitoFrete, setContaDebitoFrete] = useState<string>(initialData?.contaDebitoFrete || CONTAS_CONTABEIS.CLIENTES);
  const [contaCreditoFrete, setContaCreditoFrete] = useState<string>(initialData?.contaCreditoFrete || CONTAS_CONTABEIS.RECEITA_FRETE);
  const [contaDebitoAdiantamento, setContaDebitoAdiantamento] = useState<string>(initialData?.contaDebitoAdiantamento || CONTAS_CONTABEIS.ADIANTAMENTO_FORNECEDORES);
  const [contaCreditoAdiantamento, setContaCreditoAdiantamento] = useState<string>(initialData?.contaCreditoAdiantamento || CONTAS_CONTABEIS.CAIXA);
  const [centroCusto, setCentroCusto] = useState<string>(initialData?.centroCusto || '');
  const [bancoAdiantamento, setBancoAdiantamento] = useState<string>(initialData?.bancoAdiantamento || '');
  const [contabilizarAdiantamento, setContabilizarAdiantamento] = useState<boolean>(initialData?.contabilizarAdiantamento || false);
  
  // Dados adicionais do proprietário
  const [proprietarioInfo, setProprietarioInfo] = useState<any>(initialData?.proprietarioInfo || null);
  
  // Calcular saldo a pagar
  const saldoPagar = valorFreteContratado - valorAdiantamento - valorPedagio;
  
  // Buscar informações do proprietário quando o contrato for carregado
  useEffect(() => {
    if (contrato?.proprietario) {
      buscarProprietario(contrato.proprietario);
    }
  }, [contrato]);
  
  const buscarProprietario = async (nome: string) => {
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', nome)
        .single();
        
      if (error) throw error;
      
      if (data) {
        let dadosBancarios = data.dados_bancarios;
        
        // Se os dados bancários estiverem em formato string JSON, converter para objeto
        if (typeof dadosBancarios === 'string' && dadosBancarios) {
          try {
            dadosBancarios = JSON.parse(dadosBancarios);
          } catch (e) {
            console.error('Erro ao fazer parse dos dados bancários:', e);
          }
        }
        
        setProprietarioInfo({
          ...data,
          dadosBancarios
        });
      }
    } catch (error) {
      console.error('Erro ao buscar proprietário:', error);
    }
  };
  
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

  const handleContabilizarAdiantamentoEfetuado = async () => {
    if (!adiantamentoEfetuado || !contabilizarAdiantamento) return;
    
    try {
      // Inserir lançamento contábil do adiantamento
      const { error } = await supabase
        .from('Lancamentos_Contabeis')
        .insert({
          data_lancamento: new Date().toISOString().split('T')[0],
          data_competencia: new Date().toISOString().split('T')[0],
          conta_debito: contaDebitoAdiantamento,
          conta_credito: contaCreditoAdiantamento,
          valor: valorAdiantamento,
          historico: `Adiantamento de frete - Contrato ${contrato?.idContrato || 'N/A'} - ${contrato?.proprietario || 'N/A'}`,
          documento_referencia: `Contrato ${contrato?.idContrato || 'N/A'}`,
          tipo_documento: 'ADIANTAMENTO',
          centro_custo: centroCusto || null
        });
        
      if (error) throw error;
      
      toast.success('Adiantamento contabilizado com sucesso!');
    } catch (error) {
      console.error('Erro ao contabilizar adiantamento:', error);
      toast.error('Erro ao contabilizar adiantamento');
    }
  };

  const handleSave = () => {
    // Se adiantamento for efetuado e contabilização solicitada, lançar
    if (adiantamentoEfetuado && contabilizarAdiantamento) {
      handleContabilizarAdiantamentoEfetuado();
    }
    
    onSave({
      valorFreteContratado,
      valorAdiantamento,
      valorPedagio,
      saldoPagar,
      dataProgramadaPagamento: dataAdiantamento,
      contabilizado,
      adiantamentoEfetuado,
      gerarSaldoPagar,
      dataVencimento,
      contaDebitoFrete,
      contaCreditoFrete,
      contaDebitoAdiantamento,
      contaCreditoAdiantamento,
      centroCusto,
      bancoAdiantamento,
      contabilizarAdiantamento,
      proprietarioInfo
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
      
      {contrato?.tipo === 'terceiro' && (
        <>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Saldo a Pagar</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Gerar Saldo a Pagar</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Gera um lançamento no módulo de Saldo a Pagar para controle
                    </p>
                  </div>
                  <Switch 
                    checked={gerarSaldoPagar} 
                    onCheckedChange={setGerarSaldoPagar} 
                  />
                </div>
                
                {gerarSaldoPagar && (
                  <div className="pt-3 border-t border-gray-200 mt-3">
                    <Label htmlFor="dataVencimento">Data de Vencimento</Label>
                    <div className="mt-1">
                      {dataVencimento ? (
                        <DatePicker
                          value={dataVencimento}
                          onChange={setDataVencimento}
                        />
                      ) : (
                        <DatePicker
                          value={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                          onChange={setDataVencimento}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Adiantamento</CardTitle>
        </CardHeader>
        <CardContent className="pt-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Adiantamento Efetuado</Label>
                <p className="text-sm text-gray-500 mt-1">
                  Marque esta opção se o adiantamento já foi realizado
                </p>
              </div>
              <Switch 
                checked={adiantamentoEfetuado}
                onCheckedChange={setAdiantamentoEfetuado}
              />
            </div>
            
            {adiantamentoEfetuado && (
              <div className="space-y-4 pt-3 border-t border-gray-200 mt-3">
                <div>
                  <Label htmlFor="bancoAdiantamento">Banco Utilizado</Label>
                  <Select
                    value={bancoAdiantamento}
                    onValueChange={setBancoAdiantamento}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o banco" />
                    </SelectTrigger>
                    <SelectContent>
                      {bancos.map(banco => (
                        <SelectItem key={banco.codigo} value={banco.codigo}>
                          {banco.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Contabilizar Adiantamento</Label>
                    <p className="text-sm text-gray-500 mt-1">
                      Gera lançamento contábil para o adiantamento
                    </p>
                  </div>
                  <Switch 
                    checked={contabilizarAdiantamento}
                    onCheckedChange={setContabilizarAdiantamento}
                  />
                </div>
                
                {contabilizarAdiantamento && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-md bg-gray-50">
                    <div>
                      <Label htmlFor="contaDebitoAdiantamento">Conta Débito</Label>
                      <Select
                        value={contaDebitoAdiantamento}
                        onValueChange={setContaDebitoAdiantamento}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CONTAS_CONTABEIS.ADIANTAMENTO_FORNECEDORES}>Adiantamento a Fornecedores (1.1.5.01)</SelectItem>
                          <SelectItem value={CONTAS_CONTABEIS.FORNECEDORES}>Fornecedores (2.1.1.01)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="contaCreditoAdiantamento">Conta Crédito</Label>
                      <Select 
                        value={contaCreditoAdiantamento}
                        onValueChange={setContaCreditoAdiantamento}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a conta" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CONTAS_CONTABEIS.CAIXA}>Caixa (1.1.1.01)</SelectItem>
                          <SelectItem value={CONTAS_CONTABEIS.BANCOS}>Bancos (1.1.1.02)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            )}
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
        descricaoLancamento={`Receita de frete - Contrato ${contrato?.idContrato || 'N/A'}`}
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
