
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Canhoto } from '@/types/canhoto';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

// Schema de validação para o formulário de canhoto
const canhotoSchema = z.object({
  data_recebimento_canhoto: z.string().optional(),
  data_entrega_cliente: z.string().min(1, { message: 'Data de entrega é obrigatória' }),
  responsavel_recebimento: z.string().min(1, { message: 'Responsável pelo recebimento é obrigatório' }),
  observacoes: z.string().optional(),
  data_programada_pagamento: z.string().optional(),
});

type CanhotoFormValues = z.infer<typeof canhotoSchema>;

interface CanhotoFormProps {
  canhoto?: Partial<Canhoto>;
  contrato?: any;
  onSubmit: (data: Partial<Canhoto>) => Promise<void>;
  onCancel: () => void;
}

const CanhotoForm: React.FC<CanhotoFormProps> = ({ canhoto, contrato, onSubmit, onCancel }) => {
  const form = useForm<CanhotoFormValues>({
    resolver: zodResolver(canhotoSchema),
    defaultValues: {
      data_recebimento_canhoto: canhoto?.data_recebimento_canhoto || '',
      data_entrega_cliente: canhoto?.data_entrega_cliente || '',
      responsavel_recebimento: canhoto?.responsavel_recebimento || '',
      observacoes: canhoto?.observacoes || '',
      data_programada_pagamento: canhoto?.data_programada_pagamento || '',
    },
  });

  const handleFormSubmit = async (values: CanhotoFormValues) => {
    try {
      const updatedCanhoto: Partial<Canhoto> = {
        ...canhoto,
        ...values,
      };
      
      await onSubmit(updatedCanhoto);
    } catch (error) {
      console.error('Erro ao salvar canhoto:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Registro de Canhoto</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleFormSubmit)} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="data_recebimento_canhoto"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Recebimento do Canhoto</FormLabel>
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
                              format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
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
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Data em que o canhoto foi recebido pela empresa
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="data_entrega_cliente"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Entrega ao Cliente*</FormLabel>
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
                              format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
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
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Data em que a mercadoria foi entregue ao cliente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="responsavel_recebimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsável pelo Recebimento*</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome de quem recebeu a mercadoria" {...field} />
                  </FormControl>
                  <FormDescription>
                    Nome da pessoa que recebeu a mercadoria no cliente
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {canhoto?.proprietario_veiculo && canhoto?.saldo_a_pagar && canhoto?.saldo_a_pagar > 0 && (
              <FormField
                control={form.control}
                name="data_programada_pagamento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data Programada para Pagamento</FormLabel>
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
                              format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
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
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Data programada para pagamento do saldo ao proprietário
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="observacoes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Observações adicionais sobre a entrega" 
                      {...field} 
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
              >
                Salvar Canhoto
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CanhotoForm;
