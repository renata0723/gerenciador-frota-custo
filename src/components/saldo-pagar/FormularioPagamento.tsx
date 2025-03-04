
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { bancos } from '@/utils/constants';
import { formatCurrency } from '@/utils/formatters';
import { SaldoItem, PagamentoSaldo } from '@/types/saldoPagar';

export interface FormularioPagamentoProps {
  saldo: SaldoItem;
  onSubmit: (pagamento: PagamentoSaldo) => void;
  onCancel: () => void;
}

const FormularioPagamento: React.FC<FormularioPagamentoProps> = ({ 
  saldo, 
  onSubmit, 
  onCancel 
}) => {
  const [valorPagamento, setValorPagamento] = useState<number>(saldo.saldo_restante);
  const [dataPagamento, setDataPagamento] = useState<Date | undefined>(new Date());
  const [bancoPagamento, setBancoPagamento] = useState<string>(saldo.banco_pagamento || '');
  const [observacoes, setObservacoes] = useState<string>('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataPagamento) {
      alert('Por favor, informe a data de pagamento');
      return;
    }
    
    if (valorPagamento <= 0) {
      alert('O valor do pagamento deve ser maior que zero');
      return;
    }
    
    if (valorPagamento > saldo.saldo_restante) {
      alert(`O valor do pagamento não pode ser maior que o saldo restante (${formatCurrency(saldo.saldo_restante)})`);
      return;
    }
    
    if (!bancoPagamento) {
      alert('Por favor, selecione o banco de pagamento');
      return;
    }
    
    const pagamento: PagamentoSaldo = {
      id: saldo.id,
      valor_pago: valorPagamento,
      data_pagamento: dataPagamento.toISOString().split('T')[0],
      banco_pagamento: bancoPagamento,
      observacoes: observacoes
    };
    
    onSubmit(pagamento);
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Alert className="bg-blue-50">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Efetue o pagamento para {saldo.parceiro}
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor Total</p>
              <p className="font-semibold">{formatCurrency(saldo.valor_total)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Valor Já Pago</p>
              <p className="font-semibold">{formatCurrency(saldo.valor_pago)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Saldo Restante</p>
              <p className="font-semibold text-blue-600">{formatCurrency(saldo.saldo_restante)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Vencimento</p>
              <p className="font-semibold">{new Date(saldo.vencimento).toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="valorPagamento">Valor do Pagamento*</Label>
              <Input
                id="valorPagamento"
                type="number"
                step="0.01"
                min="0"
                max={saldo.saldo_restante}
                value={valorPagamento}
                onChange={(e) => setValorPagamento(Number(e.target.value))}
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
            
            <div>
              <Label htmlFor="bancoPagamento">Banco do Pagamento*</Label>
              <Select value={bancoPagamento} onValueChange={setBancoPagamento}>
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
                placeholder="Observações sobre o pagamento"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Confirmar Pagamento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioPagamento;
