
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Check, ChevronsUpDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { FolhaPagamento } from '@/types/folhaPagamento';
import { Textarea } from '@/components/ui/textarea';

const meses = [
  { value: '01', label: 'Janeiro' },
  { value: '02', label: 'Fevereiro' },
  { value: '03', label: 'Março' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Maio' },
  { value: '06', label: 'Junho' },
  { value: '07', label: 'Julho' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
];

const anos = Array.from({ length: 10 }, (_, i) => {
  const ano = (new Date().getFullYear() - 5 + i).toString();
  return { value: ano, label: ano };
});

const FormSchema = z.object({
  funcionario_nome: z.string().min(2, {
    message: 'O nome do funcionário é obrigatório',
  }),
  salario_base: z.coerce.number().min(0, {
    message: 'O salário base deve ser um valor positivo',
  }),
  data_pagamento: z.date({
    required_error: 'Por favor selecione a data de pagamento',
  }),
  mes_referencia: z.string({
    required_error: 'Por favor selecione o mês de referência',
  }),
  ano_referencia: z.string({
    required_error: 'Por favor selecione o ano de referência',
  }),
  inss: z.coerce.number().min(0).optional(),
  fgts: z.coerce.number().min(0).optional(),
  ir: z.coerce.number().min(0).optional(),
  vale_transporte: z.coerce.number().min(0).optional(),
  vale_refeicao: z.coerce.number().min(0).optional(),
  outros_descontos: z.coerce.number().min(0).optional(),
  outros_beneficios: z.coerce.number().min(0).optional(),
  observacoes: z.string().optional(),
});

export interface FolhaPagamentoFormProps {
  initialData?: FolhaPagamento;
  onSubmit: (data: Partial<FolhaPagamento>) => Promise<void>;
  onCancel: () => void;
}

const FolhaPagamentoForm: React.FC<FolhaPagamentoFormProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [isCalculando, setIsCalculando] = useState(false);
  const [valorLiquido, setValorLiquido] = useState<number>(initialData?.valor_liquido || 0);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialData ? {
      funcionario_nome: initialData.funcionario_nome,
      salario_base: initialData.salario_base,
      data_pagamento: initialData.data_pagamento ? new Date(initialData.data_pagamento) : new Date(),
      mes_referencia: initialData.mes_referencia,
      ano_referencia: initialData.ano_referencia,
      inss: initialData.inss || 0,
      fgts: initialData.fgts || 0,
      ir: initialData.ir || 0,
      vale_transporte: initialData.vale_transporte || 0,
      vale_refeicao: initialData.vale_refeicao || 0,
      outros_descontos: initialData.outros_descontos || 0,
      outros_beneficios: initialData.outros_beneficios || 0,
      observacoes: initialData.observacoes || '',
    } : {
      funcionario_nome: '',
      salario_base: 0,
      data_pagamento: new Date(),
      mes_referencia: format(new Date(), 'MM'),
      ano_referencia: format(new Date(), 'yyyy'),
      inss: 0,
      fgts: 0,
      ir: 0,
      vale_transporte: 0,
      vale_refeicao: 0,
      outros_descontos: 0,
      outros_beneficios: 0,
      observacoes: '',
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && ['salario_base', 'inss', 'ir', 'vale_transporte', 'outros_descontos', 'vale_refeicao', 'outros_beneficios'].includes(name)) {
        calcularValorLiquido();
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  const calcularValorLiquido = () => {
    const values = form.getValues();
    const salarioBase = values.salario_base || 0;
    const inss = values.inss || 0;
    const ir = values.ir || 0;
    const valeTransporte = values.vale_transporte || 0;
    const outrosDescontos = values.outros_descontos || 0;
    const valeRefeicao = values.vale_refeicao || 0;
    const outrosBeneficios = values.outros_beneficios || 0;

    const totalDescontos = inss + ir + valeTransporte + outrosDescontos;
    const totalBeneficios = valeRefeicao + outrosBeneficios;
    const liquido = salarioBase - totalDescontos + totalBeneficios;

    setValorLiquido(liquido);
    return liquido;
  };

  const handleCalcular = () => {
    setIsCalculando(true);
    
    // Simular cálculos automáticos de INSS e FGTS
    const salarioBase = form.getValues('salario_base') || 0;
    
    // Cálculo simplificado para demonstração
    const inss = Math.min(salarioBase * 0.11, 828.39); // 11% limitado ao teto
    const fgts = salarioBase * 0.08; // 8% do salário

    // Atualizar os campos
    form.setValue('inss', parseFloat(inss.toFixed(2)));
    form.setValue('fgts', parseFloat(fgts.toFixed(2)));

    // Recalcular valor líquido
    const liquido = calcularValorLiquido();
    
    toast.success('Valores calculados automaticamente');
    
    setIsCalculando(false);
  };

  const handleFormSubmit = async (data: z.infer<typeof FormSchema>) => {
    // Atualizar o valor líquido antes de enviar
    const liquido = calcularValorLiquido();
    
    const formattedData: Partial<FolhaPagamento> = {
      ...data,
      valor_liquido: liquido,
      data_pagamento: format(data.data_pagamento, 'yyyy-MM-dd')
    };
    
    try {
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Erro ao salvar folha de pagamento:', error);
      toast.error('Ocorreu um erro ao salvar a folha de pagamento');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Folha de Pagamento' : 'Nova Folha de Pagamento'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="funcionario_nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Funcionário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salario_base"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salário Base (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0,00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="data_pagamento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Pagamento</FormLabel>
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
                              format(field.value, "dd/MM/yyyy", {locale: ptBR})
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
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="mes_referencia"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Mês de Referência</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? meses.find(
                                    (mes) => mes.value === field.value
                                  )?.label
                                : "Selecione o mês"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar mês..." />
                            <CommandEmpty>Mês não encontrado.</CommandEmpty>
                            <CommandGroup>
                              {meses.map((mes) => (
                                <CommandItem
                                  value={mes.label}
                                  key={mes.value}
                                  onSelect={() => {
                                    form.setValue("mes_referencia", mes.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      mes.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {mes.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ano_referencia"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Ano de Referência</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? anos.find(
                                    (ano) => ano.value === field.value
                                  )?.label
                                : "Selecione o ano"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Buscar ano..." />
                            <CommandEmpty>Ano não encontrado.</CommandEmpty>
                            <CommandGroup>
                              {anos.map((ano) => (
                                <CommandItem
                                  value={ano.label}
                                  key={ano.value}
                                  onSelect={() => {
                                    form.setValue("ano_referencia", ano.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      ano.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {ano.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCalcular}
                disabled={isCalculando}
              >
                {isCalculando ? 'Calculando...' : 'Calcular Valores Automáticos'}
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Descontos</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="inss"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>INSS (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>11% do salário, limitado ao teto</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fgts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FGTS (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>8% do salário (depósito)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ir"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imposto de Renda (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vale_transporte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vale Transporte (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="outros_descontos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outros Descontos (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Benefícios</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="vale_refeicao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vale Refeição (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="outros_beneficios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Outros Benefícios (R$)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre esta folha de pagamento..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-muted p-4 rounded-md">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Valor Líquido</h3>
                <span className="text-xl font-bold">
                  R$ {valorLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                {initialData ? 'Atualizar' : 'Salvar'} Folha de Pagamento
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FolhaPagamentoForm;
