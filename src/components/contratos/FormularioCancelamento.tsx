
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ptBR } from 'date-fns/locale';
import { formatDate } from '@/utils/formatters';

export interface FormularioCancelamentoProps {
  numeroDocumento: string | number;
  tipoDocumento?: string;
  onBack?: () => void;
  onCancelamentoRealizado?: () => void;
  onCancel?: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({
  numeroDocumento,
  tipoDocumento = 'contrato',
  onBack,
  onCancelamentoRealizado,
  onCancel
}) => {
  const [motivo, setMotivo] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [dataCancelamento, setDataCancelamento] = useState<Date>(new Date());
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivo || !responsavel) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    setEnviando(true);
    setErro(null);

    try {
      // Converter para número se for string numérica
      const documentoId = typeof numeroDocumento === 'string' && !isNaN(Number(numeroDocumento)) 
        ? parseInt(numeroDocumento) 
        : numeroDocumento;
      
      // Inserir registro de cancelamento
      const { error: cancelamentoError } = await supabase
        .from('Cancelamentos')
        .insert({
          numero_documento: documentoId.toString(),
          tipo_documento: tipoDocumento,
          motivo,
          responsavel,
          observacoes,
          data_cancelamento: dataCancelamento.toISOString()
        });

      if (cancelamentoError) {
        throw cancelamentoError;
      }

      // Atualizar status do documento para cancelado
      if (tipoDocumento === 'contrato') {
        // Converter para número se for string numérica
        const contratoId = typeof numeroDocumento === 'string' && !isNaN(Number(numeroDocumento)) 
          ? parseInt(numeroDocumento) 
          : numeroDocumento;
        
        const { error: updateError } = await supabase
          .from('Contratos')
          .update({ status_contrato: 'cancelado' })
          .eq('id', contratoId);

        if (updateError) {
          throw updateError;
        }
      }

      toast.success('Cancelamento registrado com sucesso');
      
      if (onCancelamentoRealizado) {
        onCancelamentoRealizado();
      }
    } catch (error) {
      console.error('Erro ao registrar cancelamento:', error);
      setErro('Ocorreu um erro ao processar o cancelamento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Alert variant="destructive" className="mb-6 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Atenção! O cancelamento impedirá que este documento seja processado. Esta ação não pode ser desfeita.
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
              <p><span className="font-medium">Número do Documento:</span> {numeroDocumento}</p>
              <p><span className="font-medium">Tipo de Documento:</span> {tipoDocumento}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataCancelamento">Data do Cancelamento*</Label>
              <DatePicker
                value={dataCancelamento}
                onChange={setDataCancelamento}
                placeholder="Selecione uma data"
              />
            </div>

            <div>
              <Label htmlFor="responsavel">Responsável pelo Cancelamento*</Label>
              <Input
                id="responsavel"
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                placeholder="Nome do responsável"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo">Motivo do Cancelamento*</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Informe o motivo do cancelamento"
                required
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações Adicionais</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais (opcional)"
                className="min-h-[80px]"
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
