
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CTe {
  numeroCTe: string;
  valorCarga: number;
  valorFrete: number;
}

interface FormularioCTeDadosProps {
  contratoId?: string;
  onSave?: (dados: CTe[]) => void;
}

const FormularioCTeDados: React.FC<FormularioCTeDadosProps> = ({ contratoId, onSave }) => {
  const [ctes, setCtes] = useState<CTe[]>([{ numeroCTe: '', valorCarga: 0, valorFrete: 0 }]);

  const handleAddCTe = () => {
    setCtes([...ctes, { numeroCTe: '', valorCarga: 0, valorFrete: 0 }]);
  };

  const handleRemoveCTe = (index: number) => {
    if (ctes.length > 1) {
      const newCtes = [...ctes];
      newCtes.splice(index, 1);
      setCtes(newCtes);
    } else {
      toast.error('Pelo menos um CTe deve ser mantido');
    }
  };

  const handleCTeChange = (index: number, field: keyof CTe, value: string) => {
    const newCtes = [...ctes];
    
    if (field === 'numeroCTe') {
      newCtes[index][field] = value;
    } else {
      // Converter para número e garantir que seja um número válido
      const numValue = parseFloat(value);
      newCtes[index][field] = isNaN(numValue) ? 0 : numValue;
    }
    
    setCtes(newCtes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    for (const cte of ctes) {
      if (!cte.numeroCTe) {
        toast.error('Preencha todos os números de CTe');
        return;
      }
    }
    
    console.log('CTes salvos:', ctes);
    
    if (onSave) {
      onSave(ctes);
    }
    
    toast.success('Dados dos CTes salvos com sucesso');
  };

  const calcularTotalCarga = () => {
    return ctes.reduce((total, cte) => total + cte.valorCarga, 0);
  };

  const calcularTotalFrete = () => {
    return ctes.reduce((total, cte) => total + cte.valorFrete, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {ctes.map((cte, index) => (
          <div key={index} className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">CTe #{index + 1}</h4>
              {ctes.length > 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  className="h-8 text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveCTe(index)}
                >
                  Remover
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`cte-numero-${index}`}>Número do CTe</Label>
                <Input
                  id={`cte-numero-${index}`}
                  value={cte.numeroCTe}
                  onChange={(e) => handleCTeChange(index, 'numeroCTe', e.target.value)}
                  placeholder="Digite o número do CTe"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`cte-valor-carga-${index}`}>Valor da Carga (R$)</Label>
                <Input
                  id={`cte-valor-carga-${index}`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={cte.valorCarga || ''}
                  onChange={(e) => handleCTeChange(index, 'valorCarga', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor={`cte-valor-frete-${index}`}>Valor do Frete (R$)</Label>
                <Input
                  id={`cte-valor-frete-${index}`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={cte.valorFrete || ''}
                  onChange={(e) => handleCTeChange(index, 'valorFrete', e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleAddCTe}
          className="w-full"
        >
          Adicionar mais um CTe
        </Button>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Valor Total da Carga:</Label>
            <div className="text-xl font-semibold">
              R$ {calcularTotalCarga().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          
          <div>
            <Label>Valor Total do Frete:</Label>
            <div className="text-xl font-semibold">
              R$ {calcularTotalFrete().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Salvar Dados dos CTes
      </Button>
    </form>
  );
};

export default FormularioCTeDados;
