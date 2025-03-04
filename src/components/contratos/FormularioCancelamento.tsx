
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Check, X } from 'lucide-react';
import { logOperation } from '@/utils/logOperations';

interface FormularioCancelamentoProps {
  tipo: string;
  numeroDocumento: string;
  onBack: () => void;
}

interface CancelamentoFormData {
  motivo: string;
  responsavel: string;
  observacoes: string;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  tipo, 
  numeroDocumento, 
  onBack 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<CancelamentoFormData>();
  const [sucessoCancelamento, setSucessoCancelamento] = useState(false);

  const onSubmit = async (formData: CancelamentoFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Inserir registro de cancelamento
      const cancelamentoData = {
        tipo_documento: tipo,
        numero_documento: numeroDocumento,
        motivo: formData.motivo,
        responsavel: formData.responsavel,
        observacoes: formData.observacoes,
        data_cancelamento: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      };
      
      const { error: cancelamentoError } = await supabase
        .from('Cancelamentos')
        .insert(cancelamentoData);
      
      if (cancelamentoError) throw cancelamentoError;
      
      // 2. Atualizar o status do documento no sistema
      let tabelaDocumento = '';
      
      if (tipo === 'Contrato') {
        tabelaDocumento = 'Contratos';
      } else if (tipo === 'Nota Fiscal') {
        tabelaDocumento = 'Notas Fiscais';
      } else if (tipo === 'Canhoto') {
        tabelaDocumento = 'Canhoto';
      }
      
      if (tabelaDocumento) {
        const { error: atualizacaoError } = await supabase
          .from(tabelaDocumento)
          .update({ status_contrato: 'Cancelado' })
          .eq('id', numeroDocumento);
        
        if (atualizacaoError) {
          console.error('Erro ao atualizar status do documento:', atualizacaoError);
          toast.error(`Documento cancelado, mas falha ao atualizar seu status.`);
        }
      }
      
      // Log de operação
      logOperation('Cancelamentos', `${tipo} cancelado`, `Documento: ${numeroDocumento}, Motivo: ${formData.motivo}`);
      
      // Sucesso
      toast.success(`${tipo} cancelado com sucesso!`);
      setSucessoCancelamento(true);
    } catch (error) {
      console.error('Erro ao processar cancelamento:', error);
      toast.error('Ocorreu um erro ao processar o cancelamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sucessoCancelamento) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Cancelamento concluído</h3>
        <p className="text-gray-500 mb-6 max-w-md">
          O {tipo.toLowerCase()} #{numeroDocumento} foi cancelado com sucesso e não estará mais ativo no sistema.
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-1">
              Cancelamento de {tipo}
            </h2>
            <p className="text-sm text-gray-500">
              Você está cancelando o {tipo.toLowerCase()} #{numeroDocumento}. Esta ação não pode ser desfeita.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo do Cancelamento <span className="text-red-500">*</span></Label>
              <Input
                id="motivo"
                placeholder="Informe o motivo do cancelamento"
                {...register('motivo', { required: "Motivo é obrigatório" })}
              />
              {errors.motivo && (
                <p className="text-sm text-red-500">{errors.motivo.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="responsavel">Responsável pelo Cancelamento <span className="text-red-500">*</span></Label>
              <Input
                id="responsavel"
                placeholder="Nome do responsável pela solicitação"
                {...register('responsavel', { required: "Responsável é obrigatório" })}
              />
              {errors.responsavel && (
                <p className="text-sm text-red-500">{errors.responsavel.message}</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações adicionais</Label>
              <Textarea
                id="observacoes"
                placeholder="Informações adicionais sobre o cancelamento"
                rows={4}
                {...register('observacoes')}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex space-x-2">
          <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-2" />
                Confirmar Cancelamento
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormularioCancelamento;
