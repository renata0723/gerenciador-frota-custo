
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

export interface PlacaVeiculoFormProps {
  onSave: (placaCavalo: string, placaCarreta: string, tipoFrota: string, proprietario: string) => void;
  onCancel: () => void;
}

const PlacaVeiculoForm: React.FC<PlacaVeiculoFormProps> = ({ onSave, onCancel }) => {
  const [placaCavalo, setPlacaCavalo] = useState('');
  const [placaCarreta, setPlacaCarreta] = useState('');
  const [tipoFrota, setTipoFrota] = useState('propria');
  const [proprietario, setProprietario] = useState('');
  const [proprietarios, setProprietarios] = useState<any[]>([]);
  
  React.useEffect(() => {
    const fetchProprietarios = async () => {
      try {
        const { data, error } = await supabase
          .from('Proprietarios')
          .select('nome');
        
        if (error) {
          console.error('Erro ao carregar proprietários:', error);
          return;
        }
        
        setProprietarios(data || []);
      } catch (error) {
        console.error('Erro ao processar proprietários:', error);
      }
    };
    
    fetchProprietarios();
  }, []);

  const handleSave = () => {
    if (!placaCavalo.trim()) {
      alert('Placa do cavalo mecânico é obrigatória');
      return;
    }
    
    if (tipoFrota === 'terceirizada' && !proprietario.trim()) {
      alert('Proprietário é obrigatório para frota terceirizada');
      return;
    }
    
    onSave(placaCavalo, placaCarreta, tipoFrota, proprietario);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="placaCavalo">Placa do Cavalo Mecânico *</Label>
        <Input
          id="placaCavalo"
          value={placaCavalo}
          onChange={(e) => setPlacaCavalo(e.target.value.toUpperCase())}
          placeholder="Ex: ABC-1234"
          className="mt-1"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="placaCarreta">Placa da Carreta</Label>
        <Input
          id="placaCarreta"
          value={placaCarreta}
          onChange={(e) => setPlacaCarreta(e.target.value.toUpperCase())}
          placeholder="Ex: XYZ-9876"
          className="mt-1"
        />
      </div>
      
      <div>
        <Label>Tipo de Frota *</Label>
        <RadioGroup
          value={tipoFrota}
          onValueChange={(value) => setTipoFrota(value)}
          className="flex mt-1 space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="propria" id="frota-propria" />
            <Label htmlFor="frota-propria" className="cursor-pointer">Própria</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="terceirizada" id="frota-terceirizada" />
            <Label htmlFor="frota-terceirizada" className="cursor-pointer">Terceirizada</Label>
          </div>
        </RadioGroup>
      </div>
      
      {tipoFrota === 'terceirizada' && (
        <div>
          <Label htmlFor="proprietario">Proprietário *</Label>
          <Select
            value={proprietario}
            onValueChange={setProprietario}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o proprietário" />
            </SelectTrigger>
            <SelectContent>
              {proprietarios.map((item, index) => (
                <SelectItem key={index} value={item.nome}>
                  {item.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default PlacaVeiculoForm;
