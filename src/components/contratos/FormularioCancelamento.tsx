
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';

export interface FormularioCancelamentoProps {
  tipo: string;
  numeroDocumento: string;
  onBack: () => void;
  onCancel?: () => void;
  onCancelamentoRealizado?: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  tipo, 
  numeroDocumento, 
  onBack,
  onCancel,
  onCancelamentoRealizado
}) => {
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo || !responsavel) {
      toast.error('Por favor, preencha o motivo e o responsável pelo cancelamento');
      return;
    }
    
    setLoading(true);
    
    try {
      // Registrar o cancelamento
      const { error: cancelamentoError } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: tipo,
          numero_documento: numeroDocumento,
          motivo,
          responsavel,
          observacoes,
          data_cancelamento: new Date().toISOString()
        });
        
      if (cancelamentoError) {
        throw cancelamentoError;
      }
      
      // Atualizar o status do documento cancelado
      if (tipo === 'Contrato') {
        const { error: contratoError } = await supabase
          .from('Contratos')
          .update({ status_contrato: 'Cancelado' })
          .eq('id', parseInt(numeroDocumento));
          
        if (contratoError) {
          throw contratoError;
        }
      } else if (tipo === 'Nota Fiscal') {
        const { error: notaError } = await supabase
          .from('Notas Fiscais')
          .update({ status_nota: 'cancelada' })
          .eq('numero_nota_fiscal', numeroDocumento);
          
        if (notaError) {
          throw notaError;
        }
      }
      
      // Registrar operação no log
      logOperation(
        'Cancelamentos', 
        `${tipo} cancelado`, 
        `ID: ${numeroDocumento}, Motivo: ${motivo}, Responsável: ${responsavel}`
      );
      
      toast.success(`${tipo} cancelado com sucesso!`);
      
      // Limpar formulário
      setMotivo('');
      setObservacoes('');
      setResponsavel('');
      
      // Notificar o componente pai sobre o cancelamento
      if (onCancelamentoRealizado) {
        onCancelamentoRealizado();
      }
    } catch (error) {
      console.error('Erro ao cancelar documento:', error);
      toast.error(`Erro ao cancelar ${tipo.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Atenção! O cancelamento do {tipo.toLowerCase()} irá impactar todas as operações relacionadas a ele.
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo do Cancelamento <span className="text-red-500">*</span></Label>
        <Input
          id="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Informe o motivo do cancelamento"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável pelo Cancelamento <span className="text-red-500">*</span></Label>
        <Input
          id="responsavel"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          placeholder="Nome do responsável"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Observações adicionais (opcional)"
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack || onCancel}>
          Voltar
        </Button>
        <Button type="submit" variant="destructive" disabled={loading}>
          {loading ? 'Cancelando...' : `Cancelar ${tipo}`}
        </Button>
      </div>
    </form>
  );
};

export default FormularioCancelamento;
