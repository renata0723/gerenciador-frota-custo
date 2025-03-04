
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CalendarIcon, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { logOperation } from '@/utils/logOperations';

// Schema de validação
const despesaSchema = z.object({
  data: z.date({
    required_error: 'Data é obrigatória',
  }),
  valor: z.coerce.number({
    required_error: 'Valor é obrigatório',
    invalid_type_error: 'Valor deve ser um número',
  }).positive('Valor deve ser positivo'),
  tipo: z.string({
    required_error: 'Tipo de despesa é obrigatório',
  }),
  descricao: z.string().min(5, 'Descrição deve ter pelo menos 5 caracteres').max(300, 'Descrição não pode exceder 300 caracteres'),
  contabilizar: z.boolean().optional().default(false),
});

type DespesaFormValues = z.infer<typeof despesaSchema>;

export interface NovaDespesaFormProps {
  onDespesaAdicionada?: () => void;
}

const tiposDespesa = [
  { id: 'descarga', label: 'Descarga' },
  { id: 'reentrega', label: 'Reentrega' },
  { id: 'no-show', label: 'No-Show (Cliente não recebeu)' },
  { id: 'pedagio', label: 'Pedágio' },
  { id: 'alimentacao', label: 'Alimentação' },
  { id: 'hospedagem', label: 'Hospedagem' },
  { id: 'combustivel', label: 'Combustível (não registrado em abastecimento)' },
  { id: 'manutencao', label: 'Manutenção (não registrada em manutenções)' },
  { id: 'multa', label: 'Multa' },
  { id: 'outras', label: 'Outras despesas' },
];

const NovaDespesaForm: React.FC<NovaDespesaFormProps> = ({ onDespesaAdicionada }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<DespesaFormValues>({
    resolver: zodResolver(despesaSchema),
    defaultValues: {
      data: new Date(),
      valor: undefined,
      tipo: '',
      descricao: '',
      contabilizar: false,
    },
  });

  const handleSubmit = async (data: DespesaFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('Despesas')
        .insert({
          data_despesa: format(data.data, 'yyyy-MM-dd'),
          valor: data.valor,
          tipo_despesa: data.tipo,
          descricao: data.descricao,
          contabilizar: data.contabilizar,
        });

      if (error) throw error;

      toast.success('Despesa cadastrada com sucesso');
      logOperation('Despesas', 'Cadastro de despesa', `Tipo: ${data.tipo}, Valor: R$ ${data.valor.toFixed(2)}`);
      
      // Se houver uma função de callback, chamá-la
      if (onDespesaAdicionada) {
        onDespesaAdicionada();
      } else {
        // Caso contrário, redirecionar para a lista de despesas
        navigate('/despesas');
      }
    } catch (error) {
      console.error('Erro ao cadastrar despesa:', error);
      toast.error('Erro ao cadastrar despesa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nova Despesa</CardTitle>
        <CardDescription>
          Cadastre uma nova despesa geral
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="data"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data da Despesa</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0,00"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Despesa</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de despesa" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposDespesa.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.id}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Detalhada</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva os detalhes da despesa"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/despesas')}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar Despesa'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NovaDespesaForm;
