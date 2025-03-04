
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bancos, formataMoeda } from '@/utils/constants';
import { SaldoPagarItem, PagamentoSaldo } from '@/types/saldoPagar';
import { formatCurrency } from '@/utils/constants';
import { format } from 'date-fns';

interface FormularioPagamentoProps {
  saldo: SaldoPagarItem | null;
  onSave: (data: PagamentoSaldo) => void;
  onCancel: () => void;
}

const FormularioPagamento: React.FC<FormularioPagamentoProps> = ({
  saldo,
  onSave,
  onCancel
}) => {
  const [valor, setValor] = useState<number>(saldo?.saldo_restante || saldo?.valor_total || 0);
  const [dataPagamento, setDataPagamento] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [bancoSelecionado, setBancoSelecionado] = useState<string>('');
  const [observacao, setObservacao] = useState<string>('');

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = parseFloat(e.target.value);
    setValor(isNaN(novoValor) ? 0 : novoValor);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor || valor <= 0) {
      alert('Por favor, informe um valor válido para o pagamento.');
      return;
    }

    if (!bancoSelecionado) {
      alert('Por favor, selecione o banco utilizado para o pagamento.');
      return;
    }
    
    // Monta o objeto de pagamento
    const pagamento: PagamentoSaldo = {
      id: 0, // Será gerado pelo banco 
      saldo_id: saldo?.id || 0,
      valor: valor,
      data_pagamento: dataPagamento,
      metodo_pagamento: 'Transferência Bancária',
      banco_pagamento: bancoSelecionado,
      observacoes: observacao
    };
    
    onSave(pagamento);
  };

  if (!saldo) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Detalhes do Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Parceiro:</span>
              <span>{saldo.parceiro}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Valor Total:</span>
              <span>{formatCurrency(saldo.valor_total || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">Já Pago:</span>
              <span>{formatCurrency(saldo.valor_pago || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Saldo a Pagar:</span>
              <span className="font-bold text-blue-600">
                {formatCurrency((saldo.valor_total || 0) - (saldo.valor_pago || 0))}
              </span>
            </div>
          </div>
          
          <div>
            <Label htmlFor="valor">Valor do Pagamento *</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0.01"
              max={(saldo.valor_total || 0) - (saldo.valor_pago || 0)}
              value={valor}
              onChange={handleValorChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dataPagamento">Data do Pagamento *</Label>
            <Input
              id="dataPagamento"
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="banco">Banco Utilizado *</Label>
            <Select value={bancoSelecionado} onValueChange={setBancoSelecionado}>
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
            <Label htmlFor="observacao">Observações</Label>
            <Input
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Informações adicionais sobre o pagamento"
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
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
