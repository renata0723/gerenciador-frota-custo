
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CancelamentoDocumento } from '@/types/canhoto';

interface FormularioCancelamentoProps {
  onCancelar: () => void;
  onSucesso: () => void;
}

const FormularioCancelamento: React.FC<FormularioCancelamentoProps> = ({ 
  onCancelar, 
  onSucesso 
}) => {
  const [formData, setFormData] = useState<CancelamentoDocumento>({
    tipo_documento: 'nota_fiscal',
    numero_documento: '',
    motivo: '',
    responsavel: '',
    observacoes: '',
    data_cancelamento: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero_documento || !formData.motivo || !formData.responsavel) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      // Inserir o registro de cancelamento
      const { error } = await supabase
        .from('Cancelamentos')
        .insert([
          {
            tipo_documento: formData.tipo_documento,
            numero_documento: formData.numero_documento,
            motivo: formData.motivo,
            responsavel: formData.responsavel,
            observacoes: formData.observacoes,
            data_cancelamento: formData.data_cancelamento || new Date().toISOString()
          }
        ]);

      if (error) {
        console.error("Erro ao registrar cancelamento:", error);
        toast.error("Erro ao registrar o cancelamento. Tente novamente.");
        return;
      }
      
      // Atualizar o status do documento dependendo do tipo
      let tabela = '';
      switch (formData.tipo_documento) {
        case 'nota_fiscal':
          tabela = 'Notas Fiscais';
          break;
        case 'manifesto':
        case 'cte':
        case 'contrato':
          tabela = 'Contratos';
          break;
        case 'canhoto':
          tabela = 'Canhoto';
          break;
        default:
          tabela = '';
      }
      
      if (tabela) {
        const coluna = formData.tipo_documento === 'nota_fiscal' 
          ? 'numero_nota_fiscal' 
          : formData.tipo_documento === 'manifesto'
            ? 'numero_manifesto'
            : formData.tipo_documento === 'cte'
              ? 'numero_cte'
              : 'id';

        await supabase
          .from(tabela)
          .update({ status: 'Cancelado' })
          .eq(coluna, formData.numero_documento);
      }
      
      toast.success("Documento cancelado com sucesso!");
      onSucesso();
    } catch (err) {
      console.error("Erro ao processar cancelamento:", err);
      toast.error("Ocorreu um erro ao processar o cancelamento.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tipo_documento">Tipo de Documento *</Label>
          <Select 
            value={formData.tipo_documento} 
            onValueChange={(value) => handleSelectChange('tipo_documento', value)}
          >
            <SelectTrigger id="tipo_documento">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nota_fiscal">Nota Fiscal</SelectItem>
              <SelectItem value="manifesto">Manifesto</SelectItem>
              <SelectItem value="cte">CT-e</SelectItem>
              <SelectItem value="contrato">Contrato</SelectItem>
              <SelectItem value="canhoto">Canhoto</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="numero_documento">Número do Documento *</Label>
          <Input
            id="numero_documento"
            name="numero_documento"
            value={formData.numero_documento}
            onChange={handleChange}
            placeholder="Ex: 123456"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável pelo Cancelamento *</Label>
          <Input
            id="responsavel"
            name="responsavel"
            value={formData.responsavel}
            onChange={handleChange}
            placeholder="Nome do responsável"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="data_cancelamento">Data do Cancelamento *</Label>
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              id="data_cancelamento"
              name="data_cancelamento"
              type="date"
              value={formData.data_cancelamento}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="motivo">Motivo do Cancelamento *</Label>
        <Input
          id="motivo"
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          placeholder="Explique o motivo do cancelamento"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações Adicionais</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Informações adicionais sobre o cancelamento"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit">
          Confirmar Cancelamento
        </Button>
      </div>
    </form>
  );
};

export default FormularioCancelamento;
