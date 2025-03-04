
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';

// Schema de validação
const cancelamentoSchema = z.object({
  motivoCancelamento: z.string()
    .min(5, { message: 'O motivo do cancelamento deve ter pelo menos 5 caracteres' })
    .max(500, { message: 'O motivo do cancelamento não pode exceder 500 caracteres' }),
  observacaoAdicional: z.string().optional(),
});

type CancelamentoFormValues = z.infer<typeof cancelamentoSchema>;

export interface FormularioCancelamentoProps {
  tipo: string;
  numeroDocumento: string | number;
  onBack: () => void;
  onCancelamentoRealizado?: () => void;
  onCancel?: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  tipo, 
  numeroDocumento, 
  onBack,
  onCancelamentoRealizado,
  onCancel
}) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const form = useForm<CancelamentoFormValues>({
    resolver: zodResolver(cancelamentoSchema),
    defaultValues: {
      motivoCancelamento: '',
      observacaoAdicional: '',
    },
  });

  const onSubmit = async (data: CancelamentoFormValues) => {
    setLoading(true);
    setErro(null);

    try {
      let tableName = '';
      let statusField = '';
      
      // Determinar a tabela com base no tipo
      switch (tipo) {
        case 'Contrato':
          tableName = 'Contratos';
          statusField = 'status_contrato';
          break;
        case 'Nota Fiscal':
          tableName = 'Notas Fiscais';
          statusField = 'status';
          break;
        case 'Abastecimento':
          tableName = 'Abastecimentos';
          statusField = 'status';
          break;
        default:
          throw new Error('Tipo de documento não suportado');
      }

      // Converter numeroDocumento para número se for string
      const idNumerico = typeof numeroDocumento === 'string' ? 
        parseInt(numeroDocumento, 10) : numeroDocumento;

      // Atualizar status para "Cancelado"
      const { error } = await supabase
        .from(tableName as any)
        .update({
          [statusField]: 'Cancelado',
          motivo_cancelamento: data.motivoCancelamento,
          observacao_cancelamento: data.observacaoAdicional,
          data_cancelamento: new Date().toISOString(),
        })
        .eq('id', idNumerico);

      if (error) {
        throw error;
      }

      // Registrar o cancelamento na tabela de Cancelamentos
      const { error: cancelamentoError } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: tipo,
          numero_documento: idNumerico.toString(),
          motivo: data.motivoCancelamento,
          observacoes: data.observacaoAdicional,
          responsavel: localStorage.getItem('userName') || 'Sistema',
          data_cancelamento: new Date().toISOString()
        });

      if (cancelamentoError) {
        console.error('Erro ao registrar cancelamento:', cancelamentoError);
      }

      toast.success(`${tipo} cancelado com sucesso`);
      logOperation(tableName, `Cancelamento de ${tipo.toLowerCase()}`, `ID: ${numeroDocumento}`);
      
      if (onCancelamentoRealizado) {
        onCancelamentoRealizado();
      } else {
        onBack();
      }
    } catch (error) {
      console.error(`Erro ao cancelar ${tipo}:`, error);
      setErro(`Ocorreu um erro ao tentar cancelar o ${tipo.toLowerCase()}. Tente novamente.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Cancelamento de {tipo}</CardTitle>
        <CardDescription>
          Forneça um motivo para o cancelamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {erro && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="motivoCancelamento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo do Cancelamento*</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descreva o motivo do cancelamento" 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observacaoAdicional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação Adicional</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Observações adicionais (opcional)" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel || onBack}
                className="flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <Button 
                type="submit"
                variant="destructive"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Cancelar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormularioCancelamento;
