
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PlacaVeiculoFormProps {
  onPlacaAdded: (placa: string, isCavalo: boolean) => void;
  tipo: 'cavalo' | 'carreta';
  proprietario?: string;
}

const PlacaVeiculoForm: React.FC<PlacaVeiculoFormProps> = ({ onPlacaAdded, tipo, proprietario }) => {
  const [placa, setPlaca] = useState('');
  const [tipo_frota, setTipoFrota] = useState(proprietario ? 'terceiro' : 'frota');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!placa) {
      toast.error('Informe a placa do veículo');
      return;
    }
    
    // Validar formato da placa (ABC1234 ou ABC1D23)
    const regexPlaca = /^[A-Z]{3}\d[A-Z0-9]\d{2}$/;
    if (!regexPlaca.test(placa)) {
      toast.error('Formato de placa inválido. Use o formato Mercosul (ABC1D23) ou o tradicional (ABC1234)');
      return;
    }
    
    try {
      setEnviando(true);
      
      // Verificar se a placa já existe
      const { data, error } = await supabase
        .from('Veiculos')
        .select(tipo === 'cavalo' ? 'placa_cavalo' : 'placa_carreta')
        .or(tipo === 'cavalo' ? `placa_cavalo.eq.${placa}` : `placa_carreta.eq.${placa}`);
        
      if (error) {
        console.error('Erro ao verificar placa:', error);
        toast.error('Ocorreu um erro ao verificar a placa');
        return;
      }
      
      if (data && data.length > 0) {
        toast.error(`Esta placa já está cadastrada como ${tipo}`);
        return;
      }
      
      // Cadastrar nova placa
      const novoVeiculo: any = {
        tipo_frota,
        status_veiculo: 'Ativo'
      };
      
      if (tipo === 'cavalo') {
        novoVeiculo.placa_cavalo = placa;
      } else {
        novoVeiculo.placa_carreta = placa;
      }
      
      const { error: insertError } = await supabase
        .from('Veiculos')
        .insert(novoVeiculo);
        
      if (insertError) {
        console.error('Erro ao cadastrar veículo:', insertError);
        toast.error('Não foi possível cadastrar o veículo');
        return;
      }
      
      toast.success(`${tipo === 'cavalo' ? 'Cavalo' : 'Carreta'} cadastrado(a) com sucesso!`);
      onPlacaAdded(placa, tipo === 'cavalo');
      setPlaca('');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="placa">Placa do {tipo === 'cavalo' ? 'Cavalo' : 'Carreta'}</Label>
          <AlertCircle size={16} className="text-yellow-500" />
        </div>
        <Input
          id="placa"
          placeholder="ABC1D23"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          maxLength={7}
        />
        <p className="text-sm text-gray-500">Formato Mercosul: ABC1D23</p>
      </div>
      
      {!proprietario && (
        <div className="space-y-2">
          <Label htmlFor="tipo_frota">Tipo de Frota</Label>
          <Select value={tipo_frota} onValueChange={setTipoFrota}>
            <SelectTrigger id="tipo_frota">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="frota">Própria</SelectItem>
              <SelectItem value="terceiro">Terceirizada</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Adicionar Veículo'}
      </Button>
    </form>
  );
};

export default PlacaVeiculoForm;
