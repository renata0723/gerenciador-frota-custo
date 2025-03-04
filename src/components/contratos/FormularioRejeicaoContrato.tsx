
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';

// Schema de validação
const rejeicaoSchema = z.object({
  motivoRejeicao: z.string()
    .min(5, { message: 'O motivo da rejeição deve ter pelo menos 5 caracteres' })
    .max(500, { message: 'O motivo da rejeição não pode exceder 500 caracteres' }),
  observacaoAdicional: z.string().optional(),
});

type RejeicaoFormValues = z.infer<typeof rejeicaoSchema>;

export interface FormularioRejeicaoContratoProps {
  contrato: string | number;
  onBack: () => void;
  onSave?: (data: any) => void;
}

const FormularioRejeicaoContrato: React.FC<FormularioRejeicaoContratoProps> = ({ 
  contrato, 
  onBack,
  onSave
}) => {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const form = useForm<RejeicaoFormValues>({
    resolver: zodResolver(rejeicaoSchema),
    defaultValues: {
      motivoRejeicao: '',
      observacaoAdicional: '',
    },
  });

  const onSubmit = async (data: RejeicaoFormValues) => {
    setLoading(true);
    setErro(null);

    try {
      // Converter contrato para número se for string
      const contratoId = typeof contrato === 'string' ? 
        parseInt(contrato, 10) : contrato;

      // Registrar rejeição em tabela específica
      const { error } = await supabase
        .from('Rejeicoes_Contrato')
        .insert({
          contrato_id: contratoId,
          motivo: data.motivoRejeicao,
          observacoes: data.observacaoAdicional,
          data_rejeicao: new Date().toISOString(),
          registrado_por: localStorage.getItem('userName') || 'Sistema'
        });

      if (error) {
        throw error;
      }

      // Atualizar status do contrato para "Rejeitado"
      const { error: updateError } = await supabase
        .from('Contratos')
        .update({
          status_contrato: 'Rejeitado',
          motivo_rejeicao: data.motivoRejeicao,
          data_rejeicao: new Date().toISOString(),
        })
        .eq('id', contratoId);

      if (updateError) {
        throw updateError;
      }

      toast.success('Contrato rejeitado com sucesso');
      logOperation('Contratos', 'Rejeição de contrato', `ID: ${contratoId}`);
      
      if (onSave) {
        onSave(data);
      } else {
        onBack();
      }
    } catch (error) {
      console.error('Erro ao rejeitar contrato:', error);
      setErro('Ocorreu um erro ao rejeitar o contrato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-destructive">Rejeição de Contrato</CardTitle>
        <CardDescription>
          Forneça um motivo para a rejeição do contrato #{contrato}
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
              name="motivoRejeicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motivo da Rejeição*</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Descreva o motivo da rejeição do contrato" 
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
                onClick={onBack}
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
                {loading ? 'Processando...' : 'Rejeitar Contrato'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FormularioRejeicaoContrato;
