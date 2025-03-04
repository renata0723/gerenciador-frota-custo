
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';

export interface FormularioRejeicaoContratoProps {
  contrato: string;
  onBack: () => void;
  onSave?: (data: any) => void;
}

const FormularioRejeicaoContrato: React.FC<FormularioRejeicaoContratoProps> = ({ 
  contrato, 
  onBack,
  onSave
}) => {
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo || !responsavel) {
      toast.error('Por favor, preencha o motivo e o responsável pela rejeição');
      return;
    }
    
    setLoading(true);
    
    try {
      // Atualizar status do contrato
      const { error: contratoError } = await supabase
        .from('Contratos')
        .update({ status_contrato: 'Rejeitado' })
        .eq('id', parseInt(contrato));
        
      if (contratoError) {
        throw contratoError;
      }
      
      // Registrar rejeição na tabela Cancelamentos com tipo "Rejeicao"
      const { error: rejeicaoError } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: 'Rejeicao',
          numero_documento: contrato,
          motivo,
          observacoes,
          responsavel,
          data_cancelamento: new Date().toISOString()
        });
        
      if (rejeicaoError) {
        throw rejeicaoError;
      }
      
      // Registrar operação no log
      logOperation(
        'Contratos', 
        'Contrato rejeitado', 
        `ID: ${contrato}, Motivo: ${motivo}, Responsável: ${responsavel}`
      );
      
      toast.success('Contrato rejeitado com sucesso!');
      
      if (onSave) {
        onSave({
          contrato_id: contrato,
          motivo,
          observacoes,
          responsavel
        });
      }
      
      // Limpar formulário
      setMotivo('');
      setObservacoes('');
      setResponsavel('');
    } catch (error) {
      console.error('Erro ao rejeitar contrato:', error);
      toast.error('Erro ao rejeitar o contrato');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Atenção! A rejeição do contrato irá marcar o contrato como rejeitado no sistema.
              Esta ação não pode ser desfeita.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo da Rejeição <span className="text-red-500">*</span></Label>
        <Input
          id="motivo"
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Informe o motivo da rejeição"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsável pela Rejeição <span className="text-red-500">*</span></Label>
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
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" variant="destructive" disabled={loading}>
          {loading ? 'Rejeitando...' : 'Rejeitar Contrato'}
        </Button>
      </div>
    </form>
  );
};

export default FormularioRejeicaoContrato;
