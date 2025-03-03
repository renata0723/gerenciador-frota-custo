
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoPagar: number;
  observacoes: string;
}

interface FormularioFreteContratadoProps {
  onSubmit: (data: FreteContratadoData) => void;
  onBack: () => void;
  onNext: () => void;
  initialData?: FreteContratadoData;
}

export const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData
}) => {
  const [formData, setFormData] = useState<FreteContratadoData>(
    initialData || {
      valorFreteContratado: 0,
      valorAdiantamento: 0,
      valorPedagio: 0,
      saldoPagar: 0,
      observacoes: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      const numValue = parseFloat(value);
      
      setFormData(prev => {
        const newData = {
          ...prev,
          [name]: isNaN(numValue) ? 0 : numValue
        };
        
        // Recalcular o saldo a pagar automaticamente
        if (name === 'valorFreteContratado' || name === 'valorAdiantamento' || name === 'valorPedagio') {
          newData.saldoPagar = newData.valorFreteContratado - newData.valorAdiantamento - newData.valorPedagio;
        }
        
        return newData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.valorFreteContratado <= 0) {
      toast.error('O valor do frete contratado deve ser maior que zero');
      return;
    }
    
    onSubmit(formData);
    onNext();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Frete Contratado</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$) *</Label>
            <Input
              id="valorFreteContratado"
              name="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorFreteContratado || ''}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="valorAdiantamento">Valor do Adiantamento (R$)</Label>
            <Input
              id="valorAdiantamento"
              name="valorAdiantamento"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorAdiantamento || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="valorPedagio">Valor do Pedágio (R$)</Label>
            <Input
              id="valorPedagio"
              name="valorPedagio"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorPedagio || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="saldoPagar">Saldo a Pagar (R$)</Label>
            <Input
              id="saldoPagar"
              name="saldoPagar"
              type="number"
              step="0.01"
              value={formData.saldoPagar || ''}
              readOnly
              className="bg-gray-100"
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
            rows={3}
          />
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  );
};
