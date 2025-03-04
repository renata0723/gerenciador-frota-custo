
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { bancos } from '@/utils/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SaldoPagarItem, PagamentoSaldo } from '@/types/saldoPagar';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';

interface FormularioPagamentoProps {
  saldo: SaldoPagarItem;
  onSave: (pagamento: PagamentoSaldo) => void;
  onCancel: () => void;
}

const FormularioPagamento: React.FC<FormularioPagamentoProps> = ({ 
  saldo, 
  onSave, 
  onCancel 
}) => {
  const [valorPago, setValorPago] = useState<number>(saldo.saldo_restante);
  const [dataPagamento, setDataPagamento] = useState<Date | undefined>(new Date());
  const [bancoPagamento, setBancoPagamento] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    
    // Validações
    if (!valorPago || valorPago <= 0) {
      setErro('O valor pago deve ser maior que zero.');
      return;
    }
    
    if (valorPago > saldo.saldo_restante) {
      setErro(`O valor pago não pode ser maior que o saldo restante (${formatCurrency(saldo.saldo_restante)}).`);
      return;
    }
    
    if (!dataPagamento) {
      setErro('A data de pagamento é obrigatória.');
      return;
    }
    
    if (!bancoPagamento) {
      setErro('Selecione o banco de pagamento.');
      return;
    }

    // Formatar dados para envio
    const pagamento: PagamentoSaldo = {
      id: saldo.id,
      valor_pago: valorPago,
      data_pagamento: format(dataPagamento, 'yyyy-MM-dd'),
      banco_pagamento: bancoPagamento,
      observacoes: observacoes || undefined
    };
    
    try {
      onSave(pagamento);
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      toast.error('Ocorreu um erro ao processar o pagamento');
      setErro('Ocorreu um erro ao processar o pagamento. Por favor, tente novamente.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrar Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Parceiro</Label>
                <p className="font-medium">{saldo.parceiro}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Valor Total</Label>
                <p className="font-medium">{formatCurrency(saldo.valor_total)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Já Pago</Label>
                <p className="font-medium">{formatCurrency(saldo.valor_pago)}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Saldo a Pagar</Label>
                <p className="font-medium text-blue-600">{formatCurrency(saldo.saldo_restante)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valorPago">Valor do Pagamento*</Label>
              <Input
                id="valorPago"
                type="number"
                step="0.01"
                min="0.01"
                max={saldo.saldo_restante}
                value={valorPago}
                onChange={(e) => setValorPago(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="dataPagamento">Data do Pagamento*</Label>
              <DatePicker 
                value={dataPagamento} 
                onChange={setDataPagamento} 
                placeholder="Selecione a data"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bancoPagamento">Banco do Pagamento*</Label>
            <Select value={bancoPagamento} onValueChange={setBancoPagamento} required>
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
          
          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais sobre este pagamento"
              className="min-h-[80px]"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Registrar Pagamento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioPagamento;
