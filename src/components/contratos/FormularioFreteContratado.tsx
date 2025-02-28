
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

interface DadosFreteContratado {
  valorFreteContratado: number;
  valorAdiantamento: number;
  valorPedagio: number;
  saldoAPagar: number;
  aguardandoCanhoto: boolean;
}

interface FormularioFreteContratadoProps {
  contratoId?: string;
  valorTotalCTes?: number;
  onSave?: (dados: DadosFreteContratado) => void;
}

const FormularioFreteContratado: React.FC<FormularioFreteContratadoProps> = ({ 
  contratoId, 
  valorTotalCTes = 0,
  onSave 
}) => {
  const [dadosFrete, setDadosFrete] = useState<DadosFreteContratado>({
    valorFreteContratado: 0,
    valorAdiantamento: 0,
    valorPedagio: 0,
    saldoAPagar: 0,
    aguardandoCanhoto: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setDadosFrete(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Converter para número e garantir que seja um número válido
      const numValue = parseFloat(value);
      const valorAtualizado = isNaN(numValue) ? 0 : numValue;
      
      setDadosFrete(prev => {
        // Calcular o novo valor do saldo a pagar baseado nos outros campos
        let newState = {
          ...prev,
          [name]: valorAtualizado
        };
        
        // Atualizar automaticamente o saldo a pagar
        if (['valorFreteContratado', 'valorAdiantamento', 'valorPedagio'].includes(name)) {
          newState.saldoAPagar = newState.valorFreteContratado - newState.valorAdiantamento - newState.valorPedagio;
        }
        
        return newState;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (dadosFrete.valorFreteContratado <= 0) {
      toast.error('O valor do frete contratado deve ser maior que zero');
      return;
    }
    
    if (dadosFrete.valorAdiantamento < 0 || dadosFrete.valorPedagio < 0) {
      toast.error('Os valores de adiantamento e pedágio não podem ser negativos');
      return;
    }
    
    console.log('Dados do frete contratado salvos:', dadosFrete);
    
    if (onSave) {
      onSave(dadosFrete);
    }
    
    toast.success('Dados do frete contratado salvos com sucesso');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="valorFreteContratado">Valor do Frete Contratado (R$)</Label>
            <Input
              id="valorFreteContratado"
              name="valorFreteContratado"
              type="number"
              step="0.01"
              min="0"
              value={dadosFrete.valorFreteContratado || ''}
              onChange={handleChange}
              placeholder="0,00"
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
              value={dadosFrete.valorAdiantamento || ''}
              onChange={handleChange}
              placeholder="0,00"
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
              value={dadosFrete.valorPedagio || ''}
              onChange={handleChange}
              placeholder="0,00"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="mb-4">
              <Label>Valor Total dos CTes:</Label>
              <div className="text-lg font-medium">
                R$ {valorTotalCTes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            <div>
              <Label>Saldo a Pagar:</Label>
              <div className="text-xl font-semibold text-green-600">
                R$ {dadosFrete.saldoAPagar.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 p-4 border rounded-md">
            <Switch
              id="aguardandoCanhoto"
              name="aguardandoCanhoto"
              checked={dadosFrete.aguardandoCanhoto}
              onCheckedChange={(checked) => {
                setDadosFrete(prev => ({
                  ...prev,
                  aguardandoCanhoto: checked
                }));
              }}
            />
            <Label htmlFor="aguardandoCanhoto" className="cursor-pointer">
              Aguardando Canhoto
            </Label>
          </div>
          
          <div className="text-sm text-gray-500 mt-2">
            O saldo a pagar será registrado no módulo de Saldo a Pagar com status de "Aguardando Canhoto".
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full">
        Salvar Dados do Frete Contratado
      </Button>
    </form>
  );
};

export default FormularioFreteContratado;
