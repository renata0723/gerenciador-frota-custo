
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { ProprietarioData } from './CadastroProprietarioForm';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { logOperation } from '@/utils/logOperations';

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  dataAdiantamento?: Date | null;
  valorPedagio: number;
  saldoPagar: number;
  observacoes: string;
  gerarSaldoPagar: boolean;
  gerarObrigacao: boolean;
  proprietarioInfo: ProprietarioData | null;
  dataVencimento?: Date | null;
}

interface FormularioFreteContratadoProps {
  onSubmit: (data: FreteContratadoData) => void;
  onBack: () => void;
  onNext: () => void;
  initialData?: FreteContratadoData;
  dadosContrato?: any; // Recebe os dados do contrato com informações do proprietário e placas
}

export const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData,
  dadosContrato
}) => {
  const [formData, setFormData] = useState<FreteContratadoData>(
    initialData || {
      valorFreteContratado: 0,
      valorAdiantamento: 0,
      dataAdiantamento: null,
      valorPedagio: 0,
      saldoPagar: 0,
      observacoes: '',
      gerarSaldoPagar: false,
      gerarObrigacao: false,
      proprietarioInfo: null,
      dataVencimento: null
    }
  );

  const isFrotaPropria = dadosContrato?.tipo === 'frota';

  // Quando mudar o tipo de frete (quando dadosContrato mudar)
  useEffect(() => {
    if (isFrotaPropria) {
      // Se for frota própria, zera os valores do frete contratado
      setFormData(prev => ({
        ...prev,
        valorFreteContratado: 0,
        valorAdiantamento: 0,
        valorPedagio: 0,
        saldoPagar: 0,
        gerarSaldoPagar: false,
        gerarObrigacao: false
      }));
    }
  }, [isFrotaPropria]);

  // Carregar informações do proprietário quando o componente montar ou quando dadosContrato mudar
  useEffect(() => {
    if (dadosContrato && dadosContrato.tipo === 'terceiro' && dadosContrato.proprietario) {
      // Se o proprietário já tiver informações detalhadas no dadosContrato, use-as
      if (dadosContrato.proprietarioInfo) {
        setFormData(prev => ({
          ...prev,
          proprietarioInfo: dadosContrato.proprietarioInfo as ProprietarioData,
          gerarSaldoPagar: true
        }));
      } else {
        // Simulação de busca de dados do proprietário se não estiver disponível
        const proprietarioInfo: ProprietarioData = {
          nome: dadosContrato.proprietario,
          documento: 'Documento do proprietário', // Simulado
          dadosBancarios: {
            banco: 'Banco do proprietário',
            agencia: '1234',
            conta: '56789-0',
            tipoConta: 'corrente',
            chavePix: ''
          }
        };
        
        setFormData(prev => ({
          ...prev,
          proprietarioInfo: proprietarioInfo,
          gerarSaldoPagar: true
        }));
      }
    }
  }, [dadosContrato]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = parseFloat(value);
      
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: isNaN(numValue) ? 0 : numValue
        };
        
        // Recalcular o saldo a pagar automaticamente
        if (name === 'valorFreteContratado' || name === 'valorAdiantamento' || name === 'valorPedagio') {
          newData.saldoPagar = newData.valorFreteContratado - newData.valorAdiantamento - newData.valorPedagio;
        }
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleDateSelect = (field: 'dataVencimento' | 'dataAdiantamento', date: Date | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: date || null
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Se for frota própria, não validamos o valor do frete contratado
    if (!isFrotaPropria && formData.valorFreteContratado <= 0) {
      toast.error('O valor do frete contratado deve ser maior que zero');
      return;
    }
    
    // Se foi informado valor de adiantamento mas não data
    if (formData.valorAdiantamento > 0 && !formData.dataAdiantamento) {
      toast.error('Por favor, informe a data do adiantamento');
      return;
    }
    
    // Se for frete terceirizado e estiver marcado para gerar saldo a pagar
    if (dadosContrato?.tipo === 'terceiro' && formData.gerarSaldoPagar) {
      if (!formData.proprietarioInfo) {
        toast.error('Informações do proprietário são necessárias para gerar saldo a pagar');
        return;
      }
      
      if (!formData.dataVencimento) {
        toast.error('Por favor, defina uma data de vencimento para o saldo a pagar');
        return;
      }
    }
    
    // Se estiver marcado para gerar obrigação
    if (formData.gerarObrigacao) {
      if (!formData.dataVencimento) {
        toast.error('É necessário informar a data de vencimento para gerar obrigação de pagamento');
        return;
      }
      
      if (!formData.proprietarioInfo) {
        toast.error('Informações do proprietário são necessárias para gerar obrigação de pagamento');
        return;
      }
      
      toast.success(`Obrigação de pagamento será gerada com vencimento em ${format(formData.dataVencimento, 'dd/MM/yyyy')}`);
    }
    
    logOperation('Contratos', 'Formulário de frete preenchido', `Tipo: ${dadosContrato?.tipo}, Valor: ${formData.valorFreteContratado}`);
    
    onSubmit(formData);
    onNext();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Frete Contratado</h2>
      
      {dadosContrato && (
        <div className="text-sm text-gray-600 mb-4">
          <p><strong>Contrato:</strong> {dadosContrato.idContrato}</p>
          <p><strong>Tipo:</strong> {dadosContrato.tipo === 'frota' ? 'Frota Própria' : 'Terceirizado'}</p>
          <p><strong>Placa do Cavalo:</strong> {dadosContrato.placaCavalo}</p>
          {dadosContrato.proprietario && (
            <p><strong>Proprietário:</strong> {dadosContrato.proprietario}</p>
          )}
        </div>
      )}
      
      {isFrotaPropria && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-blue-700 font-medium">
            O campo de Frete Contratado está desabilitado pois este contrato é para a frota própria.
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$) {!isFrotaPropria && '*'}</Label>
            <Input
              id="valorFreteContratado"
              name="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorFreteContratado || ''}
              onChange={handleChange}
              disabled={isFrotaPropria}
              className={isFrotaPropria ? "bg-gray-100" : ""}
              required={!isFrotaPropria}
            />
          </div>
          
          <div>
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
            <Input
              id="valorAdiantamento"
              name="valorAdiantamento"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorAdiantamento || ''}
              onChange={handleChange}
              disabled={isFrotaPropria}
              className={isFrotaPropria ? "bg-gray-100" : ""}
            />
          </div>
          
          {formData.valorAdiantamento > 0 && !isFrotaPropria && (
            <div>
              <Label htmlFor="dataAdiantamento">Data do Adiantamento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="dataAdiantamento"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dataAdiantamento && "text-muted-foreground"
                    )}
                    disabled={isFrotaPropria}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dataAdiantamento ? (
                      format(formData.dataAdiantamento, "PPP", { locale: ptBR })
                    ) : (
                      <span>Selecione a data do adiantamento</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dataAdiantamento || undefined}
                    onSelect={(date) => handleDateSelect('dataAdiantamento', date)}
                    locale={ptBR}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          
          <div>
            <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
            <Input
              id="valorPedagio"
              name="valorPedagio"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorPedagio || ''}
              onChange={handleChange}
              disabled={isFrotaPropria}
              className={isFrotaPropria ? "bg-gray-100" : ""}
            />
          </div>
          
          <div>
            <Label htmlFor="saldoPagar">Saldo a Pagar (R$)</Label>
            <Input
              id="saldoPagar"
              name="saldoPagar"
              type="number"
              step="0.01"
              value={formData.saldoPagar || ''}
              readOnly
              className="bg-gray-100"
            />
          </div>
        </div>
        
        {dadosContrato?.tipo === 'terceiro' && (
          <Card className="p-4 mt-4">
            <div className="flex items-center mb-4">
              <Checkbox
                id="gerarSaldoPagar"
                checked={formData.gerarSaldoPagar}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('gerarSaldoPagar', checked === true)}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="gerarSaldoPagar" className="cursor-pointer">
                Gerar saldo a pagar no sistema para o proprietário
              </Label>
            </div>
            
            <div className="flex items-center mb-4">
              <Checkbox
                id="gerarObrigacao"
                checked={formData.gerarObrigacao}
                onCheckedChange={(checked) => 
                  handleCheckboxChange('gerarObrigacao', checked === true)}
                className="mr-2 h-4 w-4"
              />
              <Label htmlFor="gerarObrigacao" className="cursor-pointer">
                Gerar obrigação no Saldo a Pagar
              </Label>
            </div>
            
            {(formData.gerarSaldoPagar || formData.gerarObrigacao) && (
              <div className="space-y-4">
                {formData.proprietarioInfo && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-sm">Dados do Proprietário</h3>
                    <p className="text-sm"><strong>Nome:</strong> {formData.proprietarioInfo.nome}</p>
                    <p className="text-sm"><strong>Documento:</strong> {formData.proprietarioInfo.documento}</p>
                    
                    <h3 className="font-medium text-sm mt-3">Dados Bancários</h3>
                    <p className="text-sm"><strong>Banco:</strong> {formData.proprietarioInfo.dadosBancarios?.banco}</p>
                    <p className="text-sm"><strong>Agência:</strong> {formData.proprietarioInfo.dadosBancarios?.agencia}</p>
                    <p className="text-sm"><strong>Conta:</strong> {formData.proprietarioInfo.dadosBancarios?.conta}</p>
                    <p className="text-sm"><strong>Tipo de Conta:</strong> {formData.proprietarioInfo.dadosBancarios?.tipoConta === 'corrente' ? 'Conta Corrente' : 'Conta Poupança'}</p>
                    <p className="text-sm"><strong>Chave PIX:</strong> {formData.proprietarioInfo.dadosBancarios?.chavePix || 'Não informada'}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="dataVencimento">Data de Vencimento *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dataVencimento"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dataVencimento && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dataVencimento ? (
                          format(formData.dataVencimento, "PPP", { locale: ptBR })
                        ) : (
                          <span>Selecione a data de vencimento</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dataVencimento || undefined}
                        onSelect={(date) => handleDateSelect('dataVencimento', date)}
                        locale={ptBR}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </Card>
        )}
        
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioFreteContratado;
