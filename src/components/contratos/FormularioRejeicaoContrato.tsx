
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ThumbsDown } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const FormularioRejeicaoContrato = () => {
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motivoRejeicao) {
      toast({
        title: "Erro",
        description: "Por favor, selecione um motivo de rejeição",
        variant: "destructive",
      });
      return;
    }
    
    // Aqui seria implementada a lógica para salvar a rejeição do contrato
    toast({
      title: "Contrato rejeitado",
      description: "O contrato foi rejeitado e devolvido para correção",
    });
    
    // Limpar formulário
    setMotivoRejeicao('');
    setObservacoes('');
    setResponsavel('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <ThumbsDown className="h-6 w-6 text-red-500" />
        <h2 className="text-xl font-semibold">Rejeição de Contrato</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="motivo">Motivo da Rejeição</Label>
          <Select value={motivoRejeicao} onValueChange={setMotivoRejeicao}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o motivo da rejeição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dados_incompletos">Dados incompletos</SelectItem>
              <SelectItem value="erro_documentacao">Erro na documentação</SelectItem>
              <SelectItem value="valores_incorretos">Valores incorretos</SelectItem>
              <SelectItem value="inconsistencia_dados">Inconsistência nos dados</SelectItem>
              <SelectItem value="documentos_faltantes">Documentos faltantes</SelectItem>
              <SelectItem value="outro">Outro motivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea 
            id="observacoes" 
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Descreva detalhadamente o motivo da rejeição e as correções necessárias"
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="responsavel">Responsável pela Rejeição</Label>
          <Input 
            id="responsavel" 
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
            placeholder="Nome do responsável"
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" variant="rejected">
            <ThumbsDown className="h-5 w-5" />
            Rejeitar e Devolver Contrato
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioRejeicaoContrato;
