
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { registrarCancelamento, atualizarDREAposCancelamento } from '@/services/cancelamentoService';
import { CancelamentoDocumento } from '@/types/canhoto';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface FormularioCancelamentoProps {
  onCancelamentoRealizado: () => void;
  onCancel: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({
  onCancelamentoRealizado,
  onCancel
}) => {
  const [tipoDocumento, setTipoDocumento] = useState<'Contrato' | 'CT-e' | 'Manifesto'>('Contrato');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [motivo, setMotivo] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!numeroDocumento || !motivo || !responsavel) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const dataCancelamento = new Date().toISOString();
      
      const cancelamento: CancelamentoDocumento = {
        tipo_documento: tipoDocumento,
        numero_documento: numeroDocumento,
        data_cancelamento: dataCancelamento,
        motivo,
        responsavel,
        observacoes: observacoes || undefined
      };
      
      const sucesso = await registrarCancelamento(cancelamento);
      
      if (sucesso) {
        // Se for um CT-e, atualizar o DRE para desconsiderar na receita
        if (tipoDocumento === 'CT-e') {
          await atualizarDREAposCancelamento(tipoDocumento, numeroDocumento);
        }
        
        toast.success(`${tipoDocumento} cancelado com sucesso!`);
        onCancelamentoRealizado();
      } else {
        toast.error(`Erro ao cancelar ${tipoDocumento}`);
      }
    } catch (error) {
      console.error('Erro ao processar cancelamento:', error);
      toast.error("Ocorreu um erro ao processar o cancelamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-md mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-800">Atenção</h4>
                <p className="text-sm text-amber-700">
                  O cancelamento de documentos é uma operação irreversível e afetará relatórios financeiros e contábeis.
                  {tipoDocumento === 'CT-e' && " O valor deste CT-e será desconsiderado na apuração de receita do DRE."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tipoDocumento">Tipo de Documento*</Label>
            <Select 
              value={tipoDocumento} 
              onValueChange={(value) => setTipoDocumento(value as 'Contrato' | 'CT-e' | 'Manifesto')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de documento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Contrato">Contrato</SelectItem>
                <SelectItem value="CT-e">CT-e</SelectItem>
                <SelectItem value="Manifesto">Manifesto</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numeroDocumento">Número do {tipoDocumento}*</Label>
            <Input
              id="numeroDocumento"
              placeholder={`Digite o número do ${tipoDocumento}`}
              value={numeroDocumento}
              onChange={(e) => setNumeroDocumento(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataCancelamento">Data do Cancelamento</Label>
            <Input
              id="dataCancelamento"
              type="text"
              value={format(new Date(), 'dd/MM/yyyy HH:mm')}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do Cancelamento*</Label>
            <Select 
              value={motivo} 
              onValueChange={setMotivo}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo do cancelamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Erro de emissão">Erro de emissão</SelectItem>
                <SelectItem value="Duplicidade">Duplicidade</SelectItem>
                <SelectItem value="Serviço não realizado">Serviço não realizado</SelectItem>
                <SelectItem value="Informações incorretas">Informações incorretas</SelectItem>
                <SelectItem value="Cancelamento por solicitação do cliente">Solicitação do cliente</SelectItem>
                <SelectItem value="Problemas operacionais">Problemas operacionais</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="responsavel">Responsável pelo Cancelamento*</Label>
            <Input
              id="responsavel"
              placeholder="Nome do responsável"
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais sobre o cancelamento"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !numeroDocumento || !motivo || !responsavel}
            >
              {isSubmitting ? 'Processando...' : 'Confirmar Cancelamento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormularioCancelamento;
