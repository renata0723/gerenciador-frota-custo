
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Esquema de validação
const despesaSchema = z.object({
  data_despesa: z.string().min(1, 'A data é obrigatória'),
  valor_despesa: z.string().min(1, 'O valor é obrigatório'),
  tipo_despesa: z.string().min(1, 'O tipo de despesa é obrigatório'),
  categoria: z.string().min(1, 'A categoria é obrigatória'),
  descricao_detalhada: z.string().min(1, 'A descrição é obrigatória'),
  contabilizado: z.boolean().optional(),
  conta_contabil: z.string().optional(),
  contrato_id: z.string().optional(),
  rateio: z.boolean().optional(),
});

export type DespesaFormValues = z.infer<typeof despesaSchema>;

interface NovaDespesaFormProps {
  onDespesaAdicionada: () => void;
}

const NovaDespesaForm: React.FC<NovaDespesaFormProps> = ({ onDespesaAdicionada }) => {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      data_despesa: new Date().toISOString().split('T')[0],
      valor_despesa: '',
      tipo_despesa: '',
      categoria: '',
      descricao_detalhada: '',
      contabilizado: false,
      conta_contabil: '',
      contrato_id: '',
      rateio: false,
    },
  });

  const onSubmit = async (data: DespesaFormValues) => {
    setLoading(true);
    try {
      // Convertendo o valor para número
      const valorDespesa = parseFloat(data.valor_despesa);
      
      // Inserindo no banco de dados
      const { error } = await supabase.from('Despesas Gerais').insert([
        {
          data_despesa: data.data_despesa,
          valor_despesa: valorDespesa,
          tipo_despesa: data.tipo_despesa,
          categoria: data.categoria,
          descricao_detalhada: data.descricao_detalhada,
          contabilizado: data.contabilizado || false,
          conta_contabil: data.conta_contabil || null,
          contrato_id: data.contrato_id || null,
          rateio: data.rateio || false,
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success('Despesa registrada com sucesso!');
      form.reset();
      onDespesaAdicionada();
    } catch (error) {
      console.error('Erro ao adicionar despesa:', error);
      toast.error('Erro ao registrar despesa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">Nova Despesa</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Data da Despesa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="data_despesa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Despesa</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Valor da Despesa */}
              <FormField
                control={form.control}
                name="valor_despesa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tipo de Despesa e Categoria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="tipo_despesa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Despesa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="operacional">Operacional</SelectItem>
                        <SelectItem value="administrativa">Administrativa</SelectItem>
                        <SelectItem value="financeira">Financeira</SelectItem>
                        <SelectItem value="tributos">Tributos</SelectItem>
                        <SelectItem value="pessoal">Pessoal</SelectItem>
                        <SelectItem value="viagem">Viagem</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="abastecimento">Abastecimento</SelectItem>
                        <SelectItem value="manutencao">Manutenção</SelectItem>
                        <SelectItem value="pedágio">Pedágio</SelectItem>
                        <SelectItem value="alimentacao">Alimentação</SelectItem>
                        <SelectItem value="hospedagem">Hospedagem</SelectItem>
                        <SelectItem value="escritorio">Material de Escritório</SelectItem>
                        <SelectItem value="despesa_administrativa">Despesa Administrativa</SelectItem>
                        <SelectItem value="salarios">Salários</SelectItem>
                        <SelectItem value="encargos">Encargos</SelectItem>
                        <SelectItem value="investimento">Investimento</SelectItem>
                        <SelectItem value="imposto">Impostos</SelectItem>
                        <SelectItem value="outras">Outras</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Descrição Detalhada */}
            <FormField
              control={form.control}
              name="descricao_detalhada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Detalhada</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detalhe a despesa"
                      {...field}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos opcionais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="contrato_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID do Contrato (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID do contrato relacionado"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="conta_contabil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conta Contábil (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Código da conta contábil"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col md:flex-row gap-6">
              <FormField
                control={form.control}
                name="contabilizado"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Despesa Contabilizada
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rateio"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Aplicar Rateio
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => form.reset()}
                disabled={loading}
              >
                Limpar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Despesa'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NovaDespesaForm;
