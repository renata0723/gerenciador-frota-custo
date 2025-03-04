
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { TipoConta } from '@/types/contabilidade';
import { FreteContratadoData } from '@/types/contrato';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface ContaContabil {
  codigo: string;
  nome: string;
  natureza: "devedora" | "credora";
  nivel: number;
  tipo: TipoConta;
  codigo_reduzido: string;
  conta_pai: string;
  status: string;
}

interface FreteContratadoFormProps {
  contrato: any;
  onSave: (data: FreteContratadoData) => void;
  initialData?: FreteContratadoData;
  readOnly?: boolean;
}

const FreteContratadoForm: React.FC<FreteContratadoFormProps> = ({ 
  contrato, 
  onSave,
  initialData,
  readOnly = false
}) => {
  const [valorFreteContratado, setValorFreteContratado] = useState<number>(initialData?.valorFreteContratado || 0);
  const [valorPedagio, setValorPedagio] = useState<number>(initialData?.valorPedagio || 0);
  const [valorAdiantamento, setValorAdiantamento] = useState<number>(initialData?.valorAdiantamento || 0);
  const [dataAdiantamento, setDataAdiantamento] = useState<Date | undefined>(
    initialData?.dataAdiantamento ? new Date(initialData.dataAdiantamento) : undefined
  );
  const [bancoPagamento, setBancoPagamento] = useState<string>(initialData?.bancoPagamento || '');
  const [contabilizado, setContabilizado] = useState<boolean>(initialData?.contabilizado || false);
  const [contaDebito, setContaDebito] = useState<string>(initialData?.contaDebito || '');
  const [contaCredito, setContaCredito] = useState<string>(initialData?.contaCredito || '');
  const [valorSaldoPagar, setValorSaldoPagar] = useState<number>(initialData?.valorSaldoPagar || 0);
  const [contas, setContas] = useState<ContaContabil[]>([]);

  // Carregar plano de contas
  useEffect(() => {
    const carregarContas = async () => {
      try {
        const { data, error } = await supabase
          .from('Plano_Contas')
          .select('*')
          .eq('status', 'ativo');

        if (error) throw error;
        
        // Transformando os dados para se adequar à interface ContaContabil
        const contasFormatadas: ContaContabil[] = data.map(conta => ({
          codigo: conta.codigo,
          codigo_reduzido: conta.codigo_reduzido,
          nome: conta.nome,
          natureza: conta.natureza as "devedora" | "credora",
          nivel: conta.nivel,
          tipo: conta.tipo as TipoConta,
          conta_pai: conta.conta_pai,
          status: conta.status
        }));
        
        setContas(contasFormatadas);
      } catch (error) {
        console.error('Erro ao carregar plano de contas:', error);
        toast.error('Erro ao carregar plano de contas');
      }
    };

    carregarContas();
  }, []);

  // Calcular saldo a pagar
  useEffect(() => {
    const novoSaldo = valorFreteContratado - valorAdiantamento;
    setValorSaldoPagar(novoSaldo > 0 ? novoSaldo : 0);
  }, [valorFreteContratado, valorAdiantamento]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (valorFreteContratado <= 0) {
      toast.error('O valor do frete contratado deve ser maior que zero');
      return;
    }

    if (valorAdiantamento > valorFreteContratado) {
      toast.error('O valor do adiantamento não pode ser maior que o valor do frete');
      return;
    }

    if (contabilizado && (!contaDebito || !contaCredito)) {
      toast.error('Selecione as contas contábeis para débito e crédito');
      return;
    }

    const dados: FreteContratadoData = {
      valorFreteContratado,
      valorPedagio,
      valorAdiantamento,
      dataAdiantamento: dataAdiantamento ? dataAdiantamento.toISOString().split('T')[0] : '',
      bancoPagamento,
      contabilizado,
      valorSaldoPagar,
      contaDebito,
      contaCredito
    };

    onSave(dados);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado*</Label>
            <Input
              id="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={valorFreteContratado}
              onChange={(e) => setValorFreteContratado(Number(e.target.value))}
              disabled={readOnly}
              required
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
              onChange={(e) => setValorPedagio(Number(e.target.value))}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento</Label>
            <Input
              id="valorAdiantamento"
              type="number"
              step="0.01"
              min="0"
              value={valorAdiantamento}
              onChange={(e) => setValorAdiantamento(Number(e.target.value))}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="dataAdiantamento">Data do Adiantamento</Label>
            <DatePicker
              value={dataAdiantamento}
              onChange={setDataAdiantamento}
              disabled={readOnly}
            />
          </div>

          <div>
            <Label htmlFor="bancoPagamento">Banco do Pagamento</Label>
            <Select 
              value={bancoPagamento} 
              onValueChange={setBancoPagamento}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o banco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="001">Banco do Brasil</SelectItem>
                <SelectItem value="104">Caixa Econômica Federal</SelectItem>
                <SelectItem value="237">Bradesco</SelectItem>
                <SelectItem value="341">Itaú</SelectItem>
                <SelectItem value="033">Santander</SelectItem>
                <SelectItem value="756">Sicoob</SelectItem>
                <SelectItem value="748">Sicredi</SelectItem>
                <SelectItem value="077">Banco Inter</SelectItem>
                <SelectItem value="260">Nubank</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <h3 className="font-semibold mb-2">Saldo a Pagar</h3>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(valorSaldoPagar)}</p>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox 
              id="contabilizado" 
              checked={contabilizado} 
              onCheckedChange={(checked) => setContabilizado(checked as boolean)}
              disabled={readOnly}
            />
            <Label htmlFor="contabilizado" className="cursor-pointer">Contabilizar Automaticamente</Label>
          </div>

          {contabilizado && (
            <>
              <div>
                <Label htmlFor="contaDebito">Conta de Débito</Label>
                <Select value={contaDebito} onValueChange={setContaDebito} disabled={readOnly}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta de débito" />
                  </SelectTrigger>
                  <SelectContent>
                    {contas
                      .filter(conta => conta.natureza === "devedora")
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
                <Select value={contaCredito} onValueChange={setContaCredito} disabled={readOnly}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta de crédito" />
                  </SelectTrigger>
                  <SelectContent>
                    {contas
                      .filter(conta => conta.natureza === "credora")
                      .map(conta => (
                        <SelectItem key={conta.codigo} value={conta.codigo}>
                          {conta.codigo} - {conta.nome}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end mt-6">
          <Button type="submit">
            Salvar
          </Button>
        </div>
      )}
    </form>
  );
};

export default FreteContratadoForm;
