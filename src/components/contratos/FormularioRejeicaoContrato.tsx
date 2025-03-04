
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ThumbsDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FormularioRejeicaoContratoProps {
  contrato: {
    id: string;
  };
  onBack: () => void;
  onSave: () => void;
  onRejeicaoRealizada?: () => void;
}

const FormularioRejeicaoContrato: React.FC<FormularioRejeicaoContratoProps> = ({
  contrato,
  onBack,
  onSave,
  onRejeicaoRealizada
}) => {
  const [motivo, setMotivo] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    
    if (!motivo) {
      setErro('O motivo de rejeição é obrigatório');
      return;
    }
    
    setCarregando(true);
    
    try {
      // Converter o ID para número se necessário para o Supabase
      const contratoId = typeof contrato.id === 'string' ? parseInt(contrato.id) : contrato.id;
      
      // Atualizar o contrato como rejeitado
      const { error } = await supabase
        .from('Contratos')
        .update({
          rejeitado: true,
          motivo_rejeicao: motivo,
          status_contrato: 'Rejeitado'
        })
        .eq('id', contratoId);
        
      if (error) throw error;
      
      toast.success('Contrato rejeitado com sucesso');
      if (onRejeicaoRealizada) onRejeicaoRealizada();
      onSave();
    } catch (error) {
      console.error('Erro ao rejeitar contrato:', error);
      setErro('Ocorreu um erro ao rejeitar o contrato. Por favor, tente novamente.');
      toast.error('Erro ao rejeitar contrato');
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-orange-50">
        <CardTitle className="text-lg font-semibold flex items-center text-orange-700">
          <ThumbsDown className="mr-2 h-5 w-5" />
          Rejeição de Contrato
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <div className="mb-4 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium mb-2">Detalhes do Contrato</h3>
              <p><span className="font-medium">Número:</span> {contrato.id}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da Rejeição*</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="min-h-[100px]"
              placeholder="Informe detalhadamente o motivo da rejeição deste contrato"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onBack} disabled={carregando}>
              Voltar
            </Button>
            <Button type="submit" variant="destructive" disabled={carregando}>
              {carregando ? 'Processando...' : 'Rejeitar Contrato'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioRejeicaoContrato;
