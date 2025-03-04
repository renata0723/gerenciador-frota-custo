
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
      const { error: cancelError } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: tipo,
          numero_documento: numeroDocumento,
          motivo,
          observacoes: observacoes || null,
          responsavel: 'admin', // TODO: pegar o usuário logado
          data_cancelamento: new Date().toISOString()
        });
        
      if (cancelError) throw cancelError;
      
      // Atualizar o documento como cancelado
      if (tipo === 'Contrato') {
        // Usar o id como string para evitar erro de tipo na comparação
        const { error } = await supabase
          .from('Contratos')
          .update({
            status_contrato: 'Cancelado'
          })
          .eq('id', numeroDocumento);
          
        if (error) throw error;
      } else if (tipo === 'Nota Fiscal') {
        // Para documentos de nota fiscal, usar a tabela correta 
        const { error } = await supabase
          .from('Notas Fiscais') // Usando a tabela que existe no sistema
          .update({
            status_nota: 'Cancelado'
          })
          .eq('numero_nota_fiscal', numeroDocumento);
          
        if (error) throw error;
      } else if (tipo === 'CTE') {
        // Para CTE
        const { error } = await supabase
          .from('CTE') 
          .update({
            status: 'Cancelado'
          })
          .eq('numero', numeroDocumento);
          
        if (error) throw error;
      }
      
      toast.success(`${tipo} ${numeroDocumento} cancelado com sucesso`);
      if (onCancelamentoRealizado) onCancelamentoRealizado();
    } catch (error) {
      console.error('Erro ao cancelar documento:', error);
      setErro('Ocorreu um erro ao processar o cancelamento. Por favor, tente novamente.');
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
        <form onSubmit={handleSubmit}>
          {erro && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Detalhes do {tipo}</h3>
            <p><span className="font-medium">Número:</span> {numeroDocumento}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="motivo">Motivo do Cancelamento*</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder={`Informe o motivo do cancelamento deste ${tipo.toLowerCase()}`}
                className="min-h-[100px]"
                required
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
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button type="button" variant="outline" onClick={onBack || onCancel} disabled={carregando}>
              Voltar
            </Button>
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
