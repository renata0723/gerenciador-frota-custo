
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CancelamentoDocumento } from '@/types/canhoto';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface FormularioCancelamentoProps {
  onCancelamentoRealizado?: () => void;
  onCancel?: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  onCancelamentoRealizado,
  onCancel 
}) => {
  const [formData, setFormData] = useState<CancelamentoDocumento>({
    tipo_documento: '',
    numero_documento: '',
    motivo: '',
    responsavel: '',
    observacoes: '',
    data_cancelamento: new Date().toISOString().split('T')[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.tipo_documento) {
      toast.error('Selecione o tipo de documento');
      return;
    }
    
    if (!formData.numero_documento) {
      toast.error('Informe o número do documento');
      return;
    }
    
    if (!formData.motivo) {
      toast.error('Informe o motivo do cancelamento');
      return;
    }
    
    if (!formData.responsavel) {
      toast.error('Informe o responsável pelo cancelamento');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Inserir registro de cancelamento
      const { error: errorCancelamento } = await supabase
        .from('Cancelamentos')
        .insert({
          tipo_documento: formData.tipo_documento,
          numero_documento: formData.numero_documento,
          motivo: formData.motivo,
          responsavel: formData.responsavel,
          observacoes: formData.observacoes,
          data_cancelamento: formData.data_cancelamento
        });
      
      if (errorCancelamento) throw errorCancelamento;
      
      // Atualizar status do documento nas tabelas correspondentes
      const atualizarStatusDocumento = async () => {
        try {
          let tabela = '';
          let campo = '';
          let valor = '';
          
          switch (formData.tipo_documento) {
            case 'Nota Fiscal':
              tabela = 'Notas Fiscais';
              campo = 'numero_nota_fiscal';
              valor = formData.numero_documento;
              break;
            case 'Contrato':
              tabela = 'Contratos';
              campo = 'id';
              valor = formData.numero_documento;
              break;
            case 'Manifesto':
              return; // Implementar quando necessário
            case 'CT-e':
              return; // Implementar quando necessário
            default:
              return;
          }
          
          if (tabela && campo && valor) {
            const { error } = await supabase
              .from(tabela)
              .update({ status_contrato: 'Cancelado' })
              .eq(campo, valor);
            
            if (error) {
              console.error(`Erro ao atualizar status do documento na tabela ${tabela}:`, error);
              throw error;
            }
          }
        } catch (error) {
          console.error('Erro ao atualizar status do documento:', error);
          throw error;
        }
      };
      
      await atualizarStatusDocumento();
      
      toast.success('Documento cancelado com sucesso!');
      
      if (onCancelamentoRealizado) {
        onCancelamentoRealizado();
      }
    } catch (error) {
      console.error('Erro ao cancelar documento:', error);
      toast.error('Ocorreu um erro ao cancelar o documento');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="tipo_documento">Tipo de Documento</Label>
        <Select 
          value={formData.tipo_documento} 
          onValueChange={(value) => handleSelectChange('tipo_documento', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de documento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nota Fiscal">Nota Fiscal</SelectItem>
            <SelectItem value="Contrato">Contrato</SelectItem>
            <SelectItem value="Manifesto">Manifesto</SelectItem>
            <SelectItem value="CT-e">CT-e</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="numero_documento">Número do Documento</Label>
        <Input
          id="numero_documento"
          name="numero_documento"
          value={formData.numero_documento}
          onChange={handleChange}
          placeholder="Digite o número do documento"
        />
      </div>
      
      <div>
        <Label htmlFor="motivo">Motivo do Cancelamento</Label>
        <Select 
          value={formData.motivo} 
          onValueChange={(value) => handleSelectChange('motivo', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o motivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Erro de cadastro">Erro de cadastro</SelectItem>
            <SelectItem value="Desistência do cliente">Desistência do cliente</SelectItem>
            <SelectItem value="Documento duplicado">Documento duplicado</SelectItem>
            <SelectItem value="Prazo excedido">Prazo excedido</SelectItem>
            <SelectItem value="Outro">Outro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="responsavel">Responsável pelo Cancelamento</Label>
        <Input
          id="responsavel"
          name="responsavel"
          value={formData.responsavel}
          onChange={handleChange}
          placeholder="Nome do responsável"
        />
      </div>
      
      <div>
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes || ''}
          onChange={handleChange}
          placeholder="Observações adicionais"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Processando...' : 'Confirmar Cancelamento'}
        </Button>
      </div>
    </form>
  );
};

export default FormularioCancelamento;
