
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Ban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FormularioCancelamentoProps {
  tipo: string;
  numeroDocumento: string;
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
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    
    if (!motivo) {
      setErro('O motivo de cancelamento é obrigatório');
      return;
    }
    
    setCarregando(true);
    
    try {
      // Registrar o cancelamento
      const { error: erroCancelamento } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: tipo,
          numero_documento: numeroDocumento,
          motivo,
          observacoes: observacoes || null,
          responsavel: 'Usuário do Sistema', // Em um caso real usaria o usuário logado
          data_cancelamento: new Date().toISOString()
        });
        
      if (erroCancelamento) throw erroCancelamento;
      
      // Atualizar o status do documento
      if (tipo === 'Contrato') {
        const { error: erroContrato } = await supabase
          .from('Contratos')
          .update({ status_contrato: 'Cancelado' })
          .eq('id', numeroDocumento); // Isso agora espera uma string
          
        if (erroContrato) throw erroContrato;
      } else if (tipo === 'CTe') {
        // Aqui atualizaria o status do CTe em uma tabela específica
        // Código exemplo - ajustar conforme necessário
      }
      
      toast.success(`${tipo} cancelado com sucesso!`);
      
      if (onCancelamentoRealizado) {
        onCancelamentoRealizado();
      }
    } catch (error) {
      console.error(`Erro ao cancelar ${tipo}:`, error);
      setErro(`Ocorreu um erro ao cancelar o ${tipo}. Por favor, tente novamente.`);
      toast.error(`Erro ao cancelar ${tipo}`);
    } finally {
      setCarregando(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-red-50">
        <CardTitle className="text-lg font-semibold flex items-center text-red-700">
          <Ban className="mr-2 h-5 w-5" />
          Cancelamento de {tipo}
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
              <h3 className="font-medium mb-2">Detalhes do {tipo}</h3>
              <p><span className="font-medium">Número:</span> {numeroDocumento}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo" className="text-base">Motivo do Cancelamento*</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="min-h-[80px]"
              placeholder={`Informe o motivo para cancelar este ${tipo}`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes" className="text-base">Observações</Label>
            <Textarea
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="min-h-[80px]"
              placeholder="Observações adicionais (opcional)"
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            {onCancel ? (
              <Button type="button" variant="outline" onClick={onCancel} disabled={carregando}>
                Fechar
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={onBack} disabled={carregando}>
                Voltar
              </Button>
            )}
            <Button type="submit" variant="destructive" disabled={carregando}>
              {carregando ? 'Processando...' : `Cancelar ${tipo}`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioCancelamento;
