
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DespesaFormData, TipoDespesa } from '@/types/despesa';

const tiposDespesa = [
  "Descarga", 
  "Reentrega", 
  "No-Show", 
  "Diária", 
  "Pedágio", 
  "Alimentação", 
  "Hospedagem", 
  "Multa", 
  "Equipamentos", 
  "Administrativa", 
  "Outros"
];

interface NovaDespesaFormProps {
  onDespesaAdicionada: () => void;
  onCancel?: () => void;
}

const NovaDespesaForm: React.FC<NovaDespesaFormProps> = ({ onDespesaAdicionada, onCancel }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<DespesaFormData>({
    defaultValues: {
      data: new Date().toISOString().split('T')[0],
      tipo: 'outros',
      descricao: '',
      valor: 0,
      categoria: 'administrativa',
      rateio: false,
      contabilizar: false
    }
  });

  const rateioAtivo = watch('rateio');
  const categoria = watch('categoria');
  const contabilizar = watch('contabilizar');

  React.useEffect(() => {
    register('tipo');
    register('categoria');
    register('rateio');
    register('contabilizar');
    register('conta_contabil');
  }, [register]);

  const onSubmit = async (data: DespesaFormData) => {
    try {
      console.log("Salvando despesa:", data);
      // Converter valores para maiúsculas
      const descricaoUpper = data.descricao.toUpperCase();
      
      const { error } = await supabase
        .from('Despesas Gerais')
        .insert([{
          data_despesa: data.data,
          tipo_despesa: data.tipo.toUpperCase(),
          descricao_detalhada: descricaoUpper,
          valor_despesa: data.valor,
          categoria: data.categoria.toUpperCase(),
          rateio: data.rateio,
          contrato_id: data.contrato ? data.contrato.toUpperCase() : null,
          contabilizado: data.contabilizar || false,
          conta_contabil: data.contabilizar ? data.conta_contabil?.toUpperCase() : null
        }]);

      if (error) {
        console.error('Erro ao adicionar despesa:', error);
        throw error;
      }
      
      reset();
      onDespesaAdicionada();
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast.error('Erro ao adicionar despesa. Verifique os dados e tente novamente.');
    }
  };

  const handleCancel = () => {
    reset();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            {...register('data', { required: 'Data é obrigatória' })}
          />
          {errors.data && <p className="text-sm text-red-500 mt-1">{errors.data.message}</p>}
        </div>

        <div>
          <Label htmlFor="tipo">Tipo de Despesa</Label>
          <Select
            onValueChange={(value) => setValue('tipo', value as TipoDespesa)}
            defaultValue="outros"
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposDespesa.map((tipo) => (
                <SelectItem key={tipo.toLowerCase()} value={tipo.toLowerCase()}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipo && <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição Detalhada</Label>
        <Textarea
          id="descricao"
          placeholder="Descreva a despesa detalhadamente"
          {...register('descricao', { required: 'Descrição é obrigatória' })}
        />
        {errors.descricao && <p className="text-sm text-red-500 mt-1">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input
            id="valor"
            type="number"
            step="0.01"
            {...register('valor', {
              required: 'Valor é obrigatório',
              min: { value: 0.01, message: 'Valor deve ser maior que zero' }
            })}
          />
          {errors.valor && <p className="text-sm text-red-500 mt-1">{errors.valor.message}</p>}
        </div>

        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            onValueChange={(value) => setValue('categoria', value as 'viagem' | 'administrativa')}
            defaultValue="administrativa"
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viagem">Despesa de Viagem</SelectItem>
              <SelectItem value="administrativa">Despesa Administrativa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {categoria === 'viagem' && (
        <div>
          <Label htmlFor="contrato">Contrato (opcional)</Label>
          <Input
            id="contrato"
            type="text"
            placeholder="ID do contrato relacionado"
            {...register('contrato')}
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="rateio"
          checked={rateioAtivo}
          onCheckedChange={(checked) => setValue('rateio', checked)}
        />
        <Label htmlFor="rateio">Aplicar rateio entre centros de custo</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="contabilizar"
          checked={contabilizar}
          onCheckedChange={(checked) => setValue('contabilizar', checked)}
        />
        <Label htmlFor="contabilizar">Contabilizar despesa automaticamente</Label>
      </div>

      {contabilizar && (
        <div>
          <Label htmlFor="conta_contabil">Conta Contábil</Label>
          <Input
            id="conta_contabil"
            type="text"
            placeholder="Código da conta contábil"
            {...register('conta_contabil', { 
              required: contabilizar ? 'Conta contábil é obrigatória quando contabilização automática está ativada' : false 
            })}
          />
          {errors.conta_contabil && <p className="text-sm text-red-500 mt-1">{errors.conta_contabil.message}</p>}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={handleCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Despesa
        </Button>
      </div>
    </form>
  );
};

export default NovaDespesaForm;
