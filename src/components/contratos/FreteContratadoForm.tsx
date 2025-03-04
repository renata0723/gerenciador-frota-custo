
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, CalendarIcon } from 'lucide-react';
import { bancos } from '@/utils/constants';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { ContaContabil } from '@/types/contabilidade';

interface FreteContratadoFormProps {
  contrato?: any;
  onSave: (data: any) => void;
  initialData?: any;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({ contrato, onSave, initialData }) => {
  const [valorFreteContratado, setValorFreteContratado] = useState(initialData?.valorFreteContratado || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState(initialData?.valorAdiantamento || 0);
  const [valorPedagio, setValorPedagio] = useState(initialData?.valorPedagio || 0);
  const [saldoPagar, setSaldoPagar] = useState(0);
  const [dataAdiantamento, setDataAdiantamento] = useState<Date | undefined>(
    initialData?.dataAdiantamento ? new Date(initialData.dataAdiantamento) : undefined
  );
  const [metodoPagamentoAdiantamento, setMetodoPagamentoAdiantamento] = useState(initialData?.metodoPagamentoAdiantamento || '');
  const [bancoPagamentoAdiantamento, setBancoPagamentoAdiantamento] = useState(initialData?.bancoPagamentoAdiantamento || '');
  const [contabilizado, setContabilizado] = useState(initialData?.contabilizado || false);
  const [contaDebito, setContaDebito] = useState(initialData?.contaDebito || '');
  const [contaCredito, setContaCredito] = useState(initialData?.contaCredito || '');
  const [planoContas, setPlanoContas] = useState<ContaContabil[]>([]);
  
  // Carregar plano de contas
  useEffect(() => {
    const carregarPlanoContas = async () => {
      try {
        const { data, error } = await supabase
          .from('Plano_Contas')
          .select('*')
          .order('codigo', { ascending: true });
          
        if (error) {
          console.error('Erro ao carregar plano de contas:', error);
          return;
        }
        
        setPlanoContas(data || []);
      } catch (error) {
        console.error('Erro ao carregar plano de contas:', error);
      }
    };
    
    carregarPlanoContas();
  }, []);
  
  // Calcular saldo a pagar quando valores são alterados
  useEffect(() => {
    const saldo = valorFreteContratado - (valorAdiantamento + valorPedagio);
    setSaldoPagar(saldo > 0 ? saldo : 0);
  }, [valorFreteContratado, valorAdiantamento, valorPedagio]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (valorFreteContratado <= 0) {
      toast.error('O valor do frete contratado deve ser maior que zero.');
      return;
    }
    
    if (contabilizado && (!contaDebito || !contaCredito)) {
      toast.error('Para contabilizar o frete, selecione as contas de débito e crédito.');
      return;
    }
    
    // Preparar dados para envio
    const data = {
      valorFreteContratado,
      valorAdiantamento,
      valorPedagio,
      saldoPagar,
      dataAdiantamento: dataAdiantamento ? dataAdiantamento.toISOString().split('T')[0] : null,
      metodoPagamentoAdiantamento: valorAdiantamento > 0 ? metodoPagamentoAdiantamento : null,
      bancoPagamentoAdiantamento: valorAdiantamento > 0 ? bancoPagamentoAdiantamento : null,
      contabilizado,
      contaDebito: contabilizado ? contaDebito : null,
      contaCredito: contabilizado ? contaCredito : null,
      contratoId: contrato?.id
    };
    
    // Enviar dados para o componente pai
    onSave(data);
  };

  return (
    <div className="p-4">
      <Alert className="mb-6 bg-blue-50">
        <InfoIcon className="h-4 w-4" />
        <AlertDescription>
          Informe os valores do frete contratado para este serviço.
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {contrato?.id && (
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Contrato</h3>
            <p><span className="font-medium">Número:</span> {contrato.id}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado*</Label>
            <Input
              id="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={valorFreteContratado}
              onChange={(e) => setValorFreteContratado(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento</Label>
            <Input
              id="valorAdiantamento"
              type="number"
              step="0.01"
              min="0"
              max={valorFreteContratado}
              value={valorAdiantamento}
              onChange={(e) => setValorAdiantamento(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>
          
          <div>
            <Label htmlFor="valorPedagio">Valor do Pedágio</Label>
            <Input
              id="valorPedagio"
              type="number"
              step="0.01"
              min="0"
              value={valorPedagio}
              onChange={(e) => setValorPedagio(parseFloat(e.target.value) || 0)}
              placeholder="0,00"
            />
          </div>
        </div>
        
        <div className="p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between">
            <span className="font-medium">Saldo a Pagar:</span>
            <span className="font-bold text-blue-600">{formatCurrency(saldoPagar)}</span>
          </div>
        </div>
        
        {valorAdiantamento > 0 && (
          <div className="border p-4 rounded-md">
            <h3 className="font-medium mb-4">Detalhes do Adiantamento</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="dataAdiantamento">Data do Adiantamento</Label>
                <DatePicker 
                  value={dataAdiantamento} 
                  onChange={setDataAdiantamento} 
                  placeholder="Selecione a data"
                />
              </div>
              
              <div>
                <Label htmlFor="metodoPagamentoAdiantamento">Método de Pagamento</Label>
                <Select value={metodoPagamentoAdiantamento} onValueChange={setMetodoPagamentoAdiantamento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="transferencia">Transferência</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="bancoPagamentoAdiantamento">Banco</Label>
                <Select value={bancoPagamentoAdiantamento} onValueChange={setBancoPagamentoAdiantamento}>
                  <SelectTrigger>
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
            </div>
          </div>
        )}
        
        {/* Seção de contabilização */}
        <div className="border p-4 rounded-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Contabilização</h3>
            <div className="flex items-center space-x-2">
              <Switch 
                checked={contabilizado} 
                onCheckedChange={setContabilizado} 
                id="contabilizado"
              />
              <Label htmlFor="contabilizado">Contabilizar frete</Label>
            </div>
          </div>
          
          {contabilizado && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="contaDebito">Conta de Débito</Label>
                <Select value={contaDebito} onValueChange={setContaDebito}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta de débito" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {planoContas
                      .filter(conta => conta.tipo === 'despesa' || conta.tipo === 'ativo')
                      .map(conta => (
                        <SelectItem key={conta.codigo} value={conta.codigo}>
                          {conta.codigo} - {conta.nome}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="contaCredito">Conta de Crédito</Label>
                <Select value={contaCredito} onValueChange={setContaCredito}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta de crédito" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {planoContas
                      .filter(conta => conta.tipo === 'passivo' || conta.tipo === 'patrimonio')
                      .map(conta => (
                        <SelectItem key={conta.codigo} value={conta.codigo}>
                          {conta.codigo} - {conta.nome}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit">
            Salvar Frete Contratado
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FreteContratadoForm;
