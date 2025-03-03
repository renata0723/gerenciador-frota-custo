
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export interface ObservacoesData {
  operadorEntrega: string;
  dataEntrega: string;
  observacoes: string;
}

interface FormularioObservacoesProps {
  onSubmit: (data: ObservacoesData) => void;
  onBack: () => void;
  initialData?: ObservacoesData;
}

const FormularioObservacoes: React.FC<FormularioObservacoesProps> = ({
  onSubmit,
  onBack,
  initialData
}) => {
  const [formData, setFormData] = useState<ObservacoesData>(
    initialData || {
      operadorEntrega: '',
      dataEntrega: '',
      observacoes: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.operadorEntrega) {
      toast.error('Por favor, informe quem da operação entregou o contrato');
      return;
    }
    
    if (!formData.dataEntrega) {
      toast.error('Por favor, informe a data de entrega');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Observações e Informações Adicionais</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="operadorEntrega">Quem da operação entregou o contrato *</Label>
            <Input
              id="operadorEntrega"
              name="operadorEntrega"
              value={formData.operadorEntrega}
              onChange={handleChange}
              placeholder="Nome do operador"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dataEntrega">Data de entrega *</Label>
            <Input
              id="dataEntrega"
              name="dataEntrega"
              type="date"
              value={formData.dataEntrega}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Textarea
            id="observacoes"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            placeholder="Observações adicionais sobre o contrato"
            rows={4}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Finalizar Contrato
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioObservacoes;
