
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogHeader, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DialogContabilizacaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo?: string;
  dados?: any;
  onContabilizar: (contabilizado: boolean) => void;
}

export const DialogContabilizacao: React.FC<DialogContabilizacaoProps> = ({
  open,
  onOpenChange,
  tipo,
  dados,
  onContabilizar
}) => {
  const [contabilizar, setContabilizar] = useState(false);
  const [contaDebito, setContaDebito] = useState('');
  const [contaCredito, setContaCredito] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [loading, setLoading] = useState(false);

  const getTipoDescricao = () => {
    switch (tipo) {
      case 'abastecimento':
        return 'abastecimento de combustível';
      case 'manutencao':
        return 'manutenção de veículo';
      case 'despesa':
        return 'despesa geral';
      case 'contrato':
        return 'contrato de transporte';
      default:
        return 'operação';
    }
  };

  const getValorOperacao = () => {
    if (!dados) return 0;
    
    switch (tipo) {
      case 'abastecimento':
        return dados.valor_total || 0;
      case 'manutencao':
        return dados.valor_total || 0;
      case 'despesa':
        return dados.valor_despesa || 0;
      case 'contrato':
        return dados.valor_frete || 0;
      default:
        return 0;
    }
  };

  const handleContabilizar = async () => {
    if (!contabilizar) {
      onContabilizar(false);
      return;
    }

    if (!contaDebito || !contaCredito) {
      toast.error('Por favor, selecione as contas de débito e crédito');
      return;
    }

    setLoading(true);

    try {
      // Aqui implementaríamos a lógica real de contabilização
      // Como exemplo, vamos apenas simular um atraso e retornar sucesso
      
      // Na implementação real, deveria ser incluído no banco de dados
      setTimeout(() => {
        setLoading(false);
        onContabilizar(true);
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao contabilizar:', error);
      toast.error('Erro ao registrar a contabilização');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Deseja contabilizar esta operação?</DialogTitle>
          <DialogDescription>
            Você acabou de registrar um {getTipoDescricao()}. Deseja contabilizar esta operação agora?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="contabilizar" className="font-medium">
              Contabilizar agora
            </Label>
            <Switch
              id="contabilizar"
              checked={contabilizar}
              onCheckedChange={setContabilizar}
            />
          </div>

          {contabilizar && (
            <>
              <div className="grid gap-4 py-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valor da operação:</span>
                  <span className="font-bold text-blue-600">
                    {getValorOperacao().toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contaDebito">Conta de Débito</Label>
                  <Select
                    value={contaDebito}
                    onValueChange={setContaDebito}
                  >
                    <SelectTrigger id="contaDebito">
                      <SelectValue placeholder="Selecione a conta de débito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.1.1">1.1.1 - Caixa</SelectItem>
                      <SelectItem value="1.1.2">1.1.2 - Bancos</SelectItem>
                      <SelectItem value="2.1.1">2.1.1 - Fornecedores</SelectItem>
                      <SelectItem value="3.1.1">3.1.1 - Despesas Operacionais</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contaCredito">Conta de Crédito</Label>
                  <Select
                    value={contaCredito}
                    onValueChange={setContaCredito}
                  >
                    <SelectTrigger id="contaCredito">
                      <SelectValue placeholder="Selecione a conta de crédito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.1.1">1.1.1 - Caixa</SelectItem>
                      <SelectItem value="1.1.2">1.1.2 - Bancos</SelectItem>
                      <SelectItem value="2.1.1">2.1.1 - Fornecedores</SelectItem>
                      <SelectItem value="4.1.1">4.1.1 - Receitas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="centroCusto">Centro de Custo (opcional)</Label>
                  <Select
                    value={centroCusto}
                    onValueChange={setCentroCusto}
                  >
                    <SelectTrigger id="centroCusto">
                      <SelectValue placeholder="Selecione o centro de custo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADM">Administrativo</SelectItem>
                      <SelectItem value="OPER">Operacional</SelectItem>
                      <SelectItem value="COM">Comercial</SelectItem>
                      <SelectItem value="FIN">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Não Contabilizar
          </Button>
          <Button onClick={handleContabilizar} disabled={loading}>
            {loading ? 'Processando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
