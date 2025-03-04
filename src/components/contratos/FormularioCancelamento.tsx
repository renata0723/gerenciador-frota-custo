
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FormularioCancelamentoProps {
  contratoId: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  contratoId, 
  onCancel, 
  onSuccess 
}) => {
  const [motivo, setMotivo] = useState('');
  const [tipoMotivo, setTipoMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo || !tipoMotivo) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    setLoading(true);
    
    try {
      // Atualizar o contrato para cancelado
      const { error: contratoError } = await supabase
        .from('Contratos')
        .update({
          status_contrato: 'cancelado',
          motivo_rejeicao: `${tipoMotivo}: ${motivo}`
        })
        .eq('id', parseInt(contratoId));
      
      if (contratoError) {
        throw contratoError;
      }
      
      // Registrar o cancelamento
      const { error: cancelamentoError } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: 'contrato',
          numero_documento: contratoId,
          motivo: `${tipoMotivo}: ${motivo}`,
          observacoes: observacoes,
          responsavel: 'Usuário do Sistema', // Idealmente vem de um contexto de autenticação
          data_cancelamento: new Date().toISOString()
        });
      
      if (cancelamentoError) {
        throw cancelamentoError;
      }
      
      toast.success('Contrato cancelado com sucesso');
      onSuccess();
    } catch (error) {
      console.error('Erro ao cancelar contrato:', error);
      toast.error('Ocorreu um erro ao cancelar o contrato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Atenção! Esta ação cancelará o contrato #{contratoId} e não poderá ser desfeita.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tipoMotivo">Tipo de Motivo*</Label>
            <Select 
              value={tipoMotivo} 
              onValueChange={setTipoMotivo}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="motorista">Motorista</SelectItem>
                <SelectItem value="veiculo">Veículo</SelectItem>
                <SelectItem value="operacional">Operacional</SelectItem>
                <SelectItem value="financeiro">Financeiro</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="motivo">Motivo do Cancelamento*</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo do cancelamento"
              required
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="observacoes">Observações Adicionais</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações adicionais sobre o cancelamento"
              rows={2}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={loading}
            >
              Voltar
            </Button>
            <Button 
              type="submit" 
              variant="destructive"
              disabled={loading}
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioCancelamento;
