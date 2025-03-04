
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Balancete } from '@/types/contabilidade';

interface BalanceteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BalanceteForm: React.FC<BalanceteFormProps> = ({ onClose, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Balancete>>();

  const onSubmit = async (data: Partial<Balancete>) => {
    try {
      const { error } = await supabase
        .from('balancete')
        .insert([{
          ...data,
          status: 'ativo',
          saldo_atual: (data.saldo_anterior || 0) + (data.debitos || 0) - (data.creditos || 0)
        }]);

      if (error) throw error;

      toast.success('Balancete criado com sucesso');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar balancete:', error);
      toast.error('Erro ao criar balancete');
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Novo Balancete</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="periodo_inicio">Data Início</Label>
              <Input
                type="date"
                id="periodo_inicio"
                {...register('periodo_inicio', { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="periodo_fim">Data Fim</Label>
              <Input
                type="date"
                id="periodo_fim"
                {...register('periodo_fim', { required: true })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="conta_codigo">Código da Conta</Label>
            <Input
              id="conta_codigo"
              {...register('conta_codigo', { required: true })}
            />
          </div>

          <div>
            <Label htmlFor="conta_nome">Nome da Conta</Label>
            <Input
              id="conta_nome"
              {...register('conta_nome', { required: true })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="saldo_anterior">Saldo Anterior</Label>
              <Input
                type="number"
                step="0.01"
                id="saldo_anterior"
                {...register('saldo_anterior', { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="debitos">Débitos</Label>
              <Input
                type="number"
                step="0.01"
                id="debitos"
                {...register('debitos', { required: true })}
              />
            </div>
            <div>
              <Label htmlFor="creditos">Créditos</Label>
              <Input
                type="number"
                step="0.01"
                id="creditos"
                {...register('creditos', { required: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="natureza">Natureza</Label>
              <select
                id="natureza"
                className="w-full px-3 py-2 border rounded"
                {...register('natureza', { required: true })}
              >
                <option value="devedora">Devedora</option>
                <option value="credora">Credora</option>
              </select>
            </div>
            <div>
              <Label htmlFor="nivel">Nível</Label>
              <Input
                type="number"
                id="nivel"
                {...register('nivel', { required: true })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BalanceteForm;
