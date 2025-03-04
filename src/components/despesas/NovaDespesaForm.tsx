
import React, { useEffect, useState } from 'react';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

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

interface ContaContabil {
  codigo: string;
  nome: string;
  codigo_reduzido?: string;
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

  const [contasContabeis, setContasContabeis] = useState<ContaContabil[]>([]);
  const [contratosBusca, setContratosBusca] = useState<string[]>([]);
  const [contasOpen, setContasOpen] = useState(false);

  const rateioAtivo = watch('rateio');
  const categoria = watch('categoria');
  const contabilizar = watch('contabilizar');
  const contaContabil = watch('conta_contabil');

  useEffect(() => {
    register('tipo');
    register('categoria');
    register('rateio');
    register('contabilizar');
    register('conta_contabil');
    
    // Carregar contas contábeis de despesa
    const carregarContasContabeis = async () => {
      try {
        const { data, error } = await supabase
          .from('Plano_Contas')
          .select('codigo, nome, codigo_reduzido')
          .eq('tipo', 'despesa')
          .order('codigo', { ascending: true });

        if (error) {
          console.error('Erro ao carregar contas contábeis:', error);
          return;
        }

        setContasContabeis(data || []);
      } catch (error) {
        console.error('Erro ao processar contas contábeis:', error);
      }
    };

    // Carregar contratos para busca
    const carregarContratos = async () => {
      try {
        const { data, error } = await supabase
          .from('Contratos')
          .select('id');

        if (error) {
          console.error('Erro ao carregar contratos:', error);
          return;
        }

        setContratosBusca(data?.map(c => c.id) || []);
      } catch (error) {
        console.error('Erro ao processar contratos:', error);
      }
    };

    carregarContasContabeis();
    carregarContratos();
  }, [register]);

  const onSubmit = async (data: DespesaFormData) => {
    try {
      console.log("Salvando despesa:", data);
      // Converter valores para maiúsculas
      const descricaoUpper = data.descricao.toUpperCase();
      
      const { data: novaDespesa, error } = await supabase
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
        }])
        .select();

      if (error) {
        console.error('Erro ao adicionar despesa:', error);
        throw error;
      }

      // Se for para contabilizar, criar lançamento contábil
      if (data.contabilizar && data.conta_contabil) {
        const { error: contabilError } = await supabase
          .from('Lancamentos_Contabeis')
          .insert({
            data_lancamento: data.data,
            data_competencia: data.data,
            conta_debito: data.conta_contabil,
            conta_credito: '11201', // Conta padrão de caixa/banco
            valor: data.valor,
            historico: `Despesa ${data.tipo} - ${data.descricao.substring(0, 50)}`,
            documento_referencia: data.contrato || `Despesa ${data.tipo}`,
            tipo_documento: 'DESPESA',
            status: 'ativo'
          });

        if (contabilError) {
          console.error('Erro ao contabilizar despesa:', contabilError);
          toast.error('Despesa salva, mas houve erro na contabilização');
        } else {
          toast.success('Despesa registrada e contabilizada com sucesso!');
        }
      } else {
        toast.success('Despesa registrada com sucesso!');
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
          <Select 
            onValueChange={(value) => setValue('contrato', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o contrato (opcional)" />
            </SelectTrigger>
            <SelectContent>
              {contratosBusca.length > 0 ? (
                contratosBusca.map((contrato) => (
                  <SelectItem key={contrato} value={contrato}>
                    {contrato}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="" disabled>
                  Nenhum contrato encontrado
                </SelectItem>
              )}
            </SelectContent>
          </Select>
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
          <Popover open={contasOpen} onOpenChange={setContasOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={contasOpen}
                className="w-full justify-between"
              >
                {contaContabil
                  ? contasContabeis.find((conta) => conta.codigo === contaContabil)?.nome || contaContabil
                  : "Selecione a conta contábil"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar conta contábil..." />
                <CommandEmpty>Nenhuma conta contábil encontrada.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {contasContabeis.map((conta) => (
                    <CommandItem
                      key={conta.codigo}
                      value={conta.codigo}
                      onSelect={(currentValue) => {
                        setValue('conta_contabil', currentValue);
                        setContasOpen(false);
                      }}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="font-medium">{conta.codigo}</span> - 
                      <span className="ml-1">{conta.nome}</span>
                      {conta.codigo_reduzido && (
                        <span className="ml-2 text-gray-500 text-xs">(Cód. Reduzido: {conta.codigo_reduzido})</span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <div className="mt-2">
            <Input
              placeholder="Ou digite o código da conta manualmente"
              value={contaContabil || ''}
              onChange={(e) => setValue('conta_contabil', e.target.value)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            A conta de crédito será a conta de caixa/banco padrão (11201)
          </p>
          {errors.conta_contabil && (
            <p className="text-sm text-red-500 mt-1">{errors.conta_contabil.message}</p>
          )}
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
