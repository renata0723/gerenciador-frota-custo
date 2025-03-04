
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';

interface FormularioCancelamentoProps {
  onCancelamentoRealizado: () => void;
  onCancel?: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  onCancelamentoRealizado,
  onCancel
}) => {
  const [tipoDocumento, setTipoDocumento] = useState<string>('');
  const [numeroDocumento, setNumeroDocumento] = useState<string>('');
  const [motivo, setMotivo] = useState<string>('');
  const [responsavel, setResponsavel] = useState<string>('');
  const [observacoes, setObservacoes] = useState<string>('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tipoDocumento || !numeroDocumento || !motivo || !responsavel) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setEnviando(true);
      
      // Salvar o cancelamento no banco de dados
      const { error } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: tipoDocumento,
          numero_documento: numeroDocumento,
          motivo,
          responsavel,
          observacoes,
          data_cancelamento: new Date().toISOString().split('T')[0]
        });
        
      if (error) {
        console.error('Erro ao registrar cancelamento:', error);
        toast.error('Ocorreu um erro ao registrar o cancelamento');
        return;
      }
      
      // Atualizar status do documento dependendo do tipo
      let tabelaAlvo = '';
      let campoId = '';
      let novoStatus = '';
      
      switch (tipoDocumento) {
        case 'contrato':
          tabelaAlvo = 'Contratos';
          campoId = 'id';
          novoStatus = 'Cancelado';
          break;
        case 'cte':
        case 'manifesto':
        case 'nota_fiscal':
          tabelaAlvo = 'Canhoto';
          campoId = tipoDocumento === 'nota_fiscal' ? 'numero_nota_fiscal' : 
                    tipoDocumento === 'cte' ? 'numero_cte' : 'numero_manifesto';
          novoStatus = 'Cancelado';
          break;
        default:
          break;
      }
      
      if (tabelaAlvo && campoId) {
        const { error: updateError } = await supabase
          .from(tabelaAlvo)
          .update({ status_contrato: novoStatus })
          .eq(campoId, numeroDocumento);
          
        if (updateError) {
          console.error(`Erro ao atualizar status do documento ${tipoDocumento}:`, updateError);
          toast.error(`Documento cancelado, mas não foi possível atualizar o status`);
        }
      }
      
      // Registrar a operação
      logOperation('Cancelamentos', `Cancelamento de ${tipoDocumento}`, `Documento #${numeroDocumento} cancelado por ${responsavel}`);
      
      toast.success('Documento cancelado com sucesso');
      
      // Notificar componente pai sobre o cancelamento
      onCancelamentoRealizado();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tipoDocumento">Tipo de Documento*</Label>
          <Select 
            value={tipoDocumento} 
            onValueChange={setTipoDocumento}
          >
            <SelectTrigger id="tipoDocumento">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contrato">Contrato</SelectItem>
              <SelectItem value="cte">CT-e</SelectItem>
              <SelectItem value="manifesto">Manifesto</SelectItem>
              <SelectItem value="nota_fiscal">Nota Fiscal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numeroDocumento">Número do Documento*</Label>
          <Input
            id="numeroDocumento"
            placeholder="Nº do documento"
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo do Cancelamento*</Label>
        <Select 
          value={motivo} 
          onValueChange={setMotivo}
        >
          <SelectTrigger id="motivo">
            <SelectValue placeholder="Selecione o motivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Erro de Digitação">Erro de Digitação</SelectItem>
            <SelectItem value="Duplicidade">Duplicidade</SelectItem>
            <SelectItem value="Transporte Não Realizado">Transporte Não Realizado</SelectItem>
            <SelectItem value="Divergência de Valores">Divergência de Valores</SelectItem>
            <SelectItem value="Documento Incorreto">Documento Incorreto</SelectItem>
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
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          placeholder="Informações adicionais sobre o cancelamento"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={enviando}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={enviando}>
          {enviando ? 'Processando...' : 'Confirmar Cancelamento'}
        </Button>
      </div>
    </form>
  );
};

export default FormularioCancelamento;
