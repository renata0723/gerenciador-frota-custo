
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FolhaPagamento } from '@/types/contabilidade';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface FolhaPagamentoFormProps {
  registro?: FolhaPagamento | null;
  onSubmit: (data: Partial<FolhaPagamento>) => Promise<void>;
  onCancel: () => void;
}

const FolhaPagamentoForm: React.FC<FolhaPagamentoFormProps> = ({ 
  registro, 
  onSubmit, 
  onCancel 
}) => {
  const defaultValues = {
    funcionario_nome: registro?.funcionario_nome || '',
    salario_base: registro?.salario_base || 0,
    mes_referencia: registro?.mes_referencia || new Date().getMonth().toString().padStart(2, '0'),
    ano_referencia: registro?.ano_referencia || new Date().getFullYear().toString(),
    data_pagamento: registro?.data_pagamento ? format(new Date(registro.data_pagamento), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    inss: registro?.inss || 0,
    fgts: registro?.fgts || 0,
    ir: registro?.ir || 0,
    vale_transporte: registro?.vale_transporte || 0,
    vale_refeicao: registro?.vale_refeicao || 0,
    outros_descontos: registro?.outros_descontos || 0,
    outros_beneficios: registro?.outros_beneficios || 0,
    valor_liquido: registro?.valor_liquido || 0,
    observacoes: registro?.observacoes || '',
    status: registro?.status || 'concluido'
  };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Partial<FolhaPagamento>>({
    defaultValues
  });

  // Observa as mudanças nos valores para calcular automaticamente o valor líquido
  const salarioBase = watch('salario_base') || 0;
  const inss = watch('inss') || 0;
  const fgts = watch('fgts') || 0;
  const ir = watch('ir') || 0;
  const valeTransporte = watch('vale_transporte') || 0;
  const valeRefeicao = watch('vale_refeicao') || 0;
  const outrosDescontos = watch('outros_descontos') || 0;
  const outrosBeneficios = watch('outros_beneficios') || 0;

  React.useEffect(() => {
    const totalDescontos = Number(inss) + Number(ir) + Number(valeTransporte) + Number(outrosDescontos);
    const totalBeneficios = Number(valeRefeicao) + Number(outrosBeneficios);
    const liquido = Number(salarioBase) - totalDescontos + totalBeneficios;
    setValue('valor_liquido', liquido);
  }, [salarioBase, inss, fgts, ir, valeTransporte, valeRefeicao, outrosDescontos, outrosBeneficios, setValue]);

  const onFormSubmit = async (data: Partial<FolhaPagamento>) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Erro ao salvar folha de pagamento:', error);
      toast.error('Erro ao salvar folha de pagamento');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{registro ? 'Editar' : 'Novo'} Registro de Folha de Pagamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="funcionario_nome">Nome do Funcionário</Label>
              <Input
                id="funcionario_nome"
                {...register('funcionario_nome', { required: true })}
                placeholder="Nome completo do funcionário"
              />
              {errors.funcionario_nome && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
            <div>
              <Label htmlFor="salario_base">Salário Base</Label>
              <Input
                id="salario_base"
                type="number"
                step="0.01"
                {...register('salario_base', { required: true, valueAsNumber: true })}
              />
              {errors.salario_base && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="data_pagamento">Data de Pagamento</Label>
              <Input
                id="data_pagamento"
                type="date"
                {...register('data_pagamento', { required: true })}
              />
              {errors.data_pagamento && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
            <div>
              <Label htmlFor="mes_referencia">Mês de Referência</Label>
              <select
                id="mes_referencia"
                className="w-full h-10 px-3 py-2 border rounded"
                {...register('mes_referencia', { required: true })}
              >
                <option value="01">Janeiro</option>
                <option value="02">Fevereiro</option>
                <option value="03">Março</option>
                <option value="04">Abril</option>
                <option value="05">Maio</option>
                <option value="06">Junho</option>
                <option value="07">Julho</option>
                <option value="08">Agosto</option>
                <option value="09">Setembro</option>
                <option value="10">Outubro</option>
                <option value="11">Novembro</option>
                <option value="12">Dezembro</option>
              </select>
              {errors.mes_referencia && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
            <div>
              <Label htmlFor="ano_referencia">Ano de Referência</Label>
              <Input
                id="ano_referencia"
                {...register('ano_referencia', { required: true })}
              />
              {errors.ano_referencia && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
          </div>

          <Separator />
          <h3 className="text-lg font-medium">Encargos e Descontos</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="inss">INSS</Label>
              <Input
                id="inss"
                type="number"
                step="0.01"
                {...register('inss', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="fgts">FGTS</Label>
              <Input
                id="fgts"
                type="number"
                step="0.01"
                {...register('fgts', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="ir">IR</Label>
              <Input
                id="ir"
                type="number"
                step="0.01"
                {...register('ir', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="vale_transporte">Vale Transporte</Label>
              <Input
                id="vale_transporte"
                type="number"
                step="0.01"
                {...register('vale_transporte', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vale_refeicao">Vale Refeição</Label>
              <Input
                id="vale_refeicao"
                type="number"
                step="0.01"
                {...register('vale_refeicao', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="outros_descontos">Outros Descontos</Label>
              <Input
                id="outros_descontos"
                type="number"
                step="0.01"
                {...register('outros_descontos', { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label htmlFor="outros_beneficios">Outros Benefícios</Label>
              <Input
                id="outros_beneficios"
                type="number"
                step="0.01"
                {...register('outros_beneficios', { valueAsNumber: true })}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_liquido">Valor Líquido</Label>
              <Input
                id="valor_liquido"
                type="number"
                step="0.01"
                {...register('valor_liquido', { required: true, valueAsNumber: true })}
                readOnly
                className="bg-gray-100"
              />
              {errors.valor_liquido && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                className="w-full h-10 px-3 py-2 border rounded"
                {...register('status', { required: true })}
              >
                <option value="pendente">Pendente</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
              {errors.status && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              {...register('observacoes')}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {registro ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FolhaPagamentoForm;
