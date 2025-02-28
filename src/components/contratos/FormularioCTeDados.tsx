
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface CTeDados {
  numeroCTe: string;
  valorCarga: number;
  valorFrete: number;
}

interface FormularioCTeDadosProps {
  contratoId?: string;
  onSave: (dados: CTeDados) => void;
  initialData?: CTeDados;
}

const FormularioCTeDados: React.FC<FormularioCTeDadosProps> = ({ 
  contratoId, 
  onSave,
  initialData 
}) => {
  const [cte, setCte] = useState<CTeDados>(
    initialData || { numeroCTe: '', valorCarga: 0, valorFrete: 0 }
  );

  const handleChange = (field: keyof CTeDados, value: string) => {
    const newCte = { ...cte };
    
    if (field === 'numeroCTe') {
      newCte[field] = value;
    } else {
      // Converter para número e garantir que seja um número válido
      const numValue = parseFloat(value);
      newCte[field] = isNaN(numValue) ? 0 : numValue;
    }
    
    setCte(newCte);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!cte.numeroCTe) {
      toast.error('Preencha o número do CTe');
      return;
    }
    
    if (cte.valorCarga <= 0) {
      toast.error('O valor da carga deve ser maior que zero');
      return;
    }
    
    if (cte.valorFrete <= 0) {
      toast.error('O valor do frete deve ser maior que zero');
      return;
    }
    
    console.log('CTe enviado:', cte);
    onSave(cte);
    
    // Limpar o formulário após envio
    setCte({ numeroCTe: '', valorCarga: 0, valorFrete: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-md bg-gray-50">
      <h4 className="font-medium mb-4">Adicionar Novo CTe</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="cte-numero">Número do CTe</Label>
          <Input
            id="cte-numero"
            value={cte.numeroCTe}
            onChange={(e) => handleChange('numeroCTe', e.target.value)}
            placeholder="Digite o número do CTe"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="cte-valor-carga">Valor da Carga (R$)</Label>
          <Input
            id="cte-valor-carga"
            type="number"
            step="0.01"
            min="0"
            value={cte.valorCarga || ''}
            onChange={(e) => handleChange('valorCarga', e.target.value)}
            placeholder="0,00"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="cte-valor-frete">Valor do Frete (R$)</Label>
          <Input
            id="cte-valor-frete"
            type="number"
            step="0.01"
            min="0"
            value={cte.valorFrete || ''}
            onChange={(e) => handleChange('valorFrete', e.target.value)}
            placeholder="0,00"
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Salvar CTe
      </Button>
    </form>
  );
};

export default FormularioCTeDados;
