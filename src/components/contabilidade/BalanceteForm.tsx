
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Balancete } from '@/types/contabilidade';
import { X } from 'lucide-react';

interface BalanceteFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Partial<Balancete>;
}

const BalanceteForm: React.FC<BalanceteFormProps> = ({ 
  onClose, 
  onSuccess, 
  initialData 
}) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<Balancete>({
    defaultValues: initialData || {
      saldo_anterior: 0,
      debitos: 0,
      creditos: 0,
      saldo_atual: 0,
      natureza: 'devedora',
      nivel: 1,
      status: 'ativo'
    }
  });

  const saldoAnterior = watch('saldo_anterior') || 0;
  const debitos = watch('debitos') || 0;
  const creditos = watch('creditos') || 0;

  const onSubmit = async (data: Balancete) => {
    try {
      // Calcula o saldo atual automaticamente
      const saldoAtual = Number(saldoAnterior) + Number(debitos) - Number(creditos);
      
      const balanceteData = {
        ...data,
        saldo_atual: saldoAtual
      };
      
      const { error } = await supabase
        .from('balancete')
        .insert(balanceteData);

      if (error) throw error;

      toast.success('Balancete criado com sucesso');
      onSuccess();
    } catch (error) {
      console.error('Erro ao criar balancete:', error);
      toast.error('Erro ao criar balancete');
    }
  };

  return (
    <Card className="mb-6 border border-gray-200 shadow-md">
      <CardHeader className="pb-3 flex justify-between items-start border-b">
        <div>
          <CardTitle className="text-xl font-bold">Novo Balancete</CardTitle>
          <CardDescription>Preencha os dados para criar um novo balancete</CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose} 
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="periodo_inicio" className="text-sm font-medium">
                Data Início <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="periodo_inicio"
                className="mt-1"
                {...register('periodo_inicio', { required: 'Data inicial é obrigatória' })}
              />
              {errors.periodo_inicio && (
                <p className="text-red-500 text-xs mt-1">{errors.periodo_inicio.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="periodo_fim" className="text-sm font-medium">
                Data Fim <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                id="periodo_fim"
                className="mt-1"
                {...register('periodo_fim', { required: 'Data final é obrigatória' })}
              />
              {errors.periodo_fim && (
                <p className="text-red-500 text-xs mt-1">{errors.periodo_fim.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="conta_codigo" className="text-sm font-medium">
                Código da Conta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="conta_codigo"
                className="mt-1"
                {...register('conta_codigo', { required: 'Código da conta é obrigatório' })}
              />
              {errors.conta_codigo && (
                <p className="text-red-500 text-xs mt-1">{errors.conta_codigo.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="conta_nome" className="text-sm font-medium">
                Nome da Conta <span className="text-red-500">*</span>
              </Label>
              <Input
                id="conta_nome"
                className="mt-1"
                {...register('conta_nome', { required: 'Nome da conta é obrigatório' })}
              />
              {errors.conta_nome && (
                <p className="text-red-500 text-xs mt-1">{errors.conta_nome.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="saldo_anterior" className="text-sm font-medium">
                Saldo Anterior <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                id="saldo_anterior"
                className="mt-1"
                {...register('saldo_anterior', { 
                  required: 'Saldo anterior é obrigatório',
                  valueAsNumber: true 
                })}
              />
              {errors.saldo_anterior && (
                <p className="text-red-500 text-xs mt-1">{errors.saldo_anterior.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="debitos" className="text-sm font-medium">
                Débitos <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                id="debitos"
                className="mt-1"
                {...register('debitos', { 
                  required: 'Débitos são obrigatórios',
                  valueAsNumber: true 
                })}
              />
              {errors.debitos && (
                <p className="text-red-500 text-xs mt-1">{errors.debitos.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="creditos" className="text-sm font-medium">
                Créditos <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.01"
                id="creditos"
                className="mt-1"
                {...register('creditos', { 
                  required: 'Créditos são obrigatórios',
                  valueAsNumber: true 
                })}
              />
              {errors.creditos && (
                <p className="text-red-500 text-xs mt-1">{errors.creditos.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="natureza" className="text-sm font-medium">
                Natureza <span className="text-red-500">*</span>
              </Label>
              <select
                id="natureza"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                {...register('natureza', { required: 'Natureza é obrigatória' })}
              >
                <option value="devedora">Devedora</option>
                <option value="credora">Credora</option>
              </select>
              {errors.natureza && (
                <p className="text-red-500 text-xs mt-1">{errors.natureza.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="nivel" className="text-sm font-medium">
                Nível <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="nivel"
                className="mt-1"
                {...register('nivel', { 
                  required: 'Nível é obrigatório',
                  valueAsNumber: true,
                  min: { value: 1, message: 'O nível deve ser no mínimo 1' }
                })}
              />
              {errors.nivel && (
                <p className="text-red-500 text-xs mt-1">{errors.nivel.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <select
                id="status"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                {...register('status')}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
                <option value="fechado">Fechado</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-sistema-primary hover:bg-sistema-primary-dark"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BalanceteForm;
