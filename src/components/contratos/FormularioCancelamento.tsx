
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { FormularioCancelamentoProps } from '@/types/contrato';

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({
  numeroDocumento,
  onBack,
  onCancelamentoRealizado,
  onCancel
}) => {
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataCancelamento, setDataCancelamento] = useState<Date | undefined>(new Date());
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo) {
      toast.error('Informe o motivo do cancelamento');
      return;
    }

    if (!dataCancelamento) {
      toast.error('Informe a data do cancelamento');
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      // Verificar se o contrato existe
      const contratoId = typeof numeroDocumento === 'string' ? parseInt(numeroDocumento) : numeroDocumento;
      
      const { data: contrato, error: contratoError } = await supabase
        .from('Contratos')
        .select('*')
        .eq('id', contratoId)
        .single();

      if (contratoError) {
        setErro('Contrato não encontrado');
        setEnviando(false);
        return;
      }

      // Registrar o cancelamento
      const { error: cancelamentoError } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: 'Contrato',
          numero_documento: numeroDocumento,
          motivo,
          observacoes,
          data_cancelamento: format(dataCancelamento, 'yyyy-MM-dd'),
          responsavel: 'Usuário Atual' // Ideal: Obter do contexto de autenticação
        });

      if (cancelamentoError) {
        throw cancelamentoError;
      }

      // Atualizar o status do contrato
      const { error: atualizacaoError } = await supabase
        .from('Contratos')
        .update({ status_contrato: 'cancelado' })
        .eq('id', contratoId);

      if (atualizacaoError) {
        throw atualizacaoError;
      }

      toast.success('Contrato cancelado com sucesso');
      
      if (onCancelamentoRealizado) {
        onCancelamentoRealizado();
      }
    } catch (error) {
      console.error('Erro ao cancelar contrato:', error);
      setErro('Ocorreu um erro ao processar o cancelamento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Atenção! Esta ação não pode ser desfeita. O cancelamento será registrado permanentemente.
            </AlertDescription>
          </Alert>

          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold">Detalhes do Documento</h3>
            <div className="mt-2">
              <p><span className="font-medium">Tipo:</span> Contrato</p>
              <p><span className="font-medium">Número:</span> {numeroDocumento}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="dataCancelamento">Data de Cancelamento*</Label>
              <DatePicker
                value={dataCancelamento}
                onChange={setDataCancelamento}
                placeholder="Selecione a data de cancelamento"
              />
            </div>

            <div>
              <Label htmlFor="motivo">Motivo do Cancelamento*</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Informe o motivo do cancelamento"
                required
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            {onBack && (
              <Button type="button" variant="outline" onClick={onBack}>
                Voltar
              </Button>
            )}
            <Button type="submit" variant="destructive" disabled={enviando}>
              {enviando ? 'Processando...' : 'Confirmar Cancelamento'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormularioCancelamento;
