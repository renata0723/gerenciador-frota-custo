
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FormularioRejeicaoContratoProps } from '@/types/contrato';
import { Label } from '@/components/ui/label';

const FormularioRejeicaoContrato: React.FC<FormularioRejeicaoContratoProps> = ({
  contrato,
  onBack,
  onSave
}) => {
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo) {
      toast.error('Informe o motivo da rejeição');
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      // Atualizar o status do contrato para rejeitado
      const contratoId = typeof contrato.id === 'string' ? parseInt(contrato.id) : contrato.id;
      
      const { error } = await supabase
        .from('Contratos')
        .update({ 
          rejeitado: true,
          motivo_rejeicao: motivo,
          status_contrato: 'rejeitado'
        })
        .eq('id', contratoId);

      if (error) {
        throw error;
      }

      toast.success('Contrato rejeitado com sucesso');
      onSave({ motivo });
      
      if (onBack) {
        onBack();
      }
    } catch (error) {
      console.error('Erro ao rejeitar contrato:', error);
      setErro('Ocorreu um erro ao processar a rejeição. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Alert variant="destructive" className="mb-6 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Atenção! A rejeição do contrato impedirá que ele seja processado. Esta ação não pode ser desfeita.
            </AlertDescription>
          </Alert>

          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold">Detalhes do Contrato</h3>
            <div className="mt-2">
              <p><span className="font-medium">Número do Contrato:</span> {contrato.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo">Motivo da Rejeição*</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Informe o motivo da rejeição do contrato"
                required
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Voltar
              </Button>
            )}
            <Button type="submit" variant="destructive" disabled={enviando}>
              {enviando ? 'Processando...' : 'Rejeitar Contrato'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormularioRejeicaoContrato;
