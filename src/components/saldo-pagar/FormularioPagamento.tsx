
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BankCheck, Calendar, DollarSign } from "lucide-react";
import { toast } from 'sonner';
import { SaldoPagar, PagamentoSaldo } from '@/types/saldoPagar';
import { formataMoeda } from '@/utils/constants';

interface FormularioPagamentoProps {
  saldos: SaldoPagar[];
  onPagamentoRealizado: (pagamento: PagamentoSaldo) => Promise<void>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bancos = [
  "Banco do Brasil",
  "Caixa Econômica Federal",
  "Bradesco",
  "Itaú",
  "Santander",
  "Nubank",
  "Inter",
  "Sicoob",
  "Sicredi",
  "Outro"
];

const FormularioPagamento: React.FC<FormularioPagamentoProps> = ({ 
  saldos, 
  onPagamentoRealizado,
  open,
  onOpenChange
}) => {
  const [valorTotal, setValorTotal] = useState<number>(() => {
    return saldos.reduce((total, saldo) => total + (saldo.valor_total - (saldo.valor_pago || 0)), 0);
  });
  
  const [valorPago, setValorPago] = useState<number>(valorTotal);
  const [dataPagamento, setDataPagamento] = useState<string>(new Date().toISOString().split('T')[0]);
  const [bancoPagamento, setBancoPagamento] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (!bancoPagamento) {
      toast.error("Selecione o banco utilizado para o pagamento");
      setLoading(false);
      return;
    }
    
    if (valorPago <= 0) {
      toast.error("O valor pago deve ser maior que zero");
      setLoading(false);
      return;
    }
    
    try {
      const pagamento: PagamentoSaldo = {
        valor_pago: valorPago,
        data_pagamento: dataPagamento,
        banco_pagamento: bancoPagamento,
        observacoes: observacoes,
        ids_contratos: saldos.map(s => s.contratos_associados || '').filter(Boolean)
      };
      
      await onPagamentoRealizado(pagamento);
      
      // Resetar o formulário
      setValorPago(0);
      setBancoPagamento("");
      setObservacoes("");
      
      // Fechar o diálogo
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Ocorreu um erro ao registrar o pagamento');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-green-600" />
            Registrar Pagamento
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Resumo do Saldo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex justify-between py-1">
                <span>Parceiro:</span>
                <span className="font-medium">{saldos[0]?.parceiro || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Contratos associados:</span>
                <span className="font-medium">{saldos.map(s => s.contratos_associados).join(', ')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Valor total pendente:</span>
                <span className="font-medium text-green-600">{formataMoeda(valorTotal)}</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_pago">Valor do Pagamento</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="valor_pago"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-8"
                  value={valorPago}
                  onChange={(e) => setValorPago(Number(e.target.value))}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="data_pagamento">Data do Pagamento</Label>
              <div className="relative">
                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="data_pagamento"
                  type="date"
                  className="pl-8"
                  value={dataPagamento}
                  onChange={(e) => setDataPagamento(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="banco_pagamento">Banco Utilizado</Label>
            <div className="relative">
              <BankCheck className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 z-10" />
              <Select value={bancoPagamento} onValueChange={setBancoPagamento} required>
                <SelectTrigger className="pl-8">
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  {bancos.map(banco => (
                    <SelectItem key={banco} value={banco}>{banco}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Informações adicionais sobre o pagamento"
              rows={3}
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>
          
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? 'Processando...' : 'Confirmar Pagamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormularioPagamento;
