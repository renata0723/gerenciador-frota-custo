
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CadastroPlacaFormProps {
  onSave: (data: { placaCavalo: string, placaCarreta?: string, tipoFrota: 'frota' | 'terceiro' }) => void;
  onCancel: () => void;
}

const CadastroPlacaForm: React.FC<CadastroPlacaFormProps> = ({ onSave, onCancel }) => {
  const [placaCavalo, setPlacaCavalo] = useState('');
  const [placaCarreta, setPlacaCarreta] = useState('');
  const [tipoFrota, setTipoFrota] = useState<'frota' | 'terceiro'>('frota');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!placaCavalo) {
      toast.error('Placa do cavalo é obrigatória');
      return;
    }
    
    setLoading(true);
    
    try {
      // Verificar se a placa já existe
      const { data: existingVehicle, error: checkError } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('placa_cavalo', placaCavalo)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 é o código quando nenhum registro é encontrado
        toast.error('Erro ao verificar placa existente');
        console.error(checkError);
        return;
      }
      
      if (existingVehicle) {
        toast.error('Esta placa já está cadastrada no sistema');
        return;
      }
      
      // Inserir novo veículo
      const { error } = await supabase
        .from('Veiculos')
        .insert({
          placa_cavalo: placaCavalo,
          placa_carreta: placaCarreta || null,
          tipo_frota: tipoFrota,
          status_veiculo: 'Ativo'
        });
        
      if (error) {
        toast.error('Erro ao cadastrar veículo');
        console.error(error);
        return;
      }
      
      toast.success('Veículo cadastrado com sucesso!');
      onSave({
        placaCavalo,
        placaCarreta,
        tipoFrota
      });
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao processar o cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="placaCavalo">Placa do Cavalo *</Label>
        <Input
          id="placaCavalo"
          value={placaCavalo}
          onChange={(e) => setPlacaCavalo(e.target.value.toUpperCase())}
          placeholder="ABC-1234"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="placaCarreta">Placa da Carreta</Label>
        <Input
          id="placaCarreta"
          value={placaCarreta}
          onChange={(e) => setPlacaCarreta(e.target.value.toUpperCase())}
          placeholder="XYZ-9876"
        />
      </div>
      
      <div>
        <Label htmlFor="tipoFrota">Tipo de Frota *</Label>
        <Select
          value={tipoFrota}
          onValueChange={(value) => setTipoFrota(value as 'frota' | 'terceiro')}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frota">Frota Própria</SelectItem>
            <SelectItem value="terceiro">Terceirizado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default CadastroPlacaForm;
