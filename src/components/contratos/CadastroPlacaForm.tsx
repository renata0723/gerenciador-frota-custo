
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CadastroPlacaFormProps {
  onSave: (data: { placaCavalo?: string; placaCarreta?: string; tipoFrota: 'frota' | 'terceiro' }) => void;
  onCancel: () => void;
  isCarreta?: boolean;
}

const CadastroPlacaForm: React.FC<CadastroPlacaFormProps> = ({ 
  onSave, 
  onCancel,
  isCarreta = false 
}) => {
  const [placaCavalo, setPlacaCavalo] = useState('');
  const [placaCarreta, setPlacaCarreta] = useState('');
  const [tipoFrota, setTipoFrota] = useState<'frota' | 'terceiro'>('frota');
  const [carregando, setCarregando] = useState(false);

  const validarPlaca = (placa: string) => {
    // Validação básica de placa (formato antigo: ABC-1234 ou novo: ABC1D23)
    const regexAntigoMercosul = /^[A-Z]{3}-\d{4}$/;
    const regexNovoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    return regexAntigoMercosul.test(placa) || regexNovoMercosul.test(placa);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (isCarreta) {
        // Validar a placa da carreta
        if (!placaCarreta || !validarPlaca(placaCarreta)) {
          toast.error('Por favor, insira uma placa de carreta válida (formato: ABC-1234 ou ABC1D23)');
          return;
        }

        // Verificar se a placa já existe
        const { data: placaExistente, error: errorVerificacao } = await supabase
          .from('Veiculos')
          .select('*')
          .eq('placa_carreta', placaCarreta);

        if (errorVerificacao) {
          console.error('Erro ao verificar placa:', errorVerificacao);
          toast.error('Erro ao verificar placa no sistema');
          return;
        }

        if (placaExistente && placaExistente.length > 0) {
          toast.error('Esta placa de carreta já está cadastrada no sistema');
          return;
        }

        // Inserir a placa da carreta
        const { error } = await supabase
          .from('Veiculos')
          .insert({
            placa_carreta: placaCarreta,
            tipo_frota: tipoFrota,
            status_veiculo: 'Ativo'
          });

        if (error) {
          console.error('Erro ao cadastrar placa:', error);
          toast.error('Erro ao cadastrar placa de carreta');
          return;
        }

        toast.success('Placa de carreta cadastrada com sucesso!');
        onSave({ placaCarreta, tipoFrota });
      } else {
        // Validar a placa do cavalo
        if (!placaCavalo || !validarPlaca(placaCavalo)) {
          toast.error('Por favor, insira uma placa de cavalo válida (formato: ABC-1234 ou ABC1D23)');
          return;
        }

        // Verificar se a placa já existe
        const { data: placaExistente, error: errorVerificacao } = await supabase
          .from('Veiculos')
          .select('*')
          .eq('placa_cavalo', placaCavalo);

        if (errorVerificacao) {
          console.error('Erro ao verificar placa:', errorVerificacao);
          toast.error('Erro ao verificar placa no sistema');
          return;
        }

        if (placaExistente && placaExistente.length > 0) {
          toast.error('Esta placa de cavalo já está cadastrada no sistema');
          return;
        }

        // Inserir o veículo
        const { error } = await supabase
          .from('Veiculos')
          .insert({
            placa_cavalo: placaCavalo,
            placa_carreta: placaCarreta || null,
            tipo_frota: tipoFrota,
            status_veiculo: 'Ativo'
          });

        if (error) {
          console.error('Erro ao cadastrar veículo:', error);
          toast.error('Erro ao cadastrar veículo');
          return;
        }

        toast.success('Veículo cadastrado com sucesso!');
        onSave({ placaCavalo, placaCarreta, tipoFrota });
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Ocorreu um erro ao processar a solicitação');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      {isCarreta ? (
        <div className="space-y-2">
          <Label htmlFor="placaCarreta">Placa da Carreta *</Label>
          <Input
            id="placaCarreta"
            value={placaCarreta}
            onChange={(e) => setPlacaCarreta(e.target.value.toUpperCase())}
            placeholder="Formato: ABC-1234 ou ABC1D23"
            required
          />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="placaCavalo">Placa do Cavalo *</Label>
            <Input
              id="placaCavalo"
              value={placaCavalo}
              onChange={(e) => setPlacaCavalo(e.target.value.toUpperCase())}
              placeholder="Formato: ABC-1234 ou ABC1D23"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="placaCarreta">Placa da Carreta (opcional)</Label>
            <Input
              id="placaCarreta"
              value={placaCarreta}
              onChange={(e) => setPlacaCarreta(e.target.value.toUpperCase())}
              placeholder="Formato: ABC-1234 ou ABC1D23"
            />
          </div>
        </>
      )}
      
      <div className="space-y-2">
        <Label>Tipo de Frota *</Label>
        <RadioGroup 
          value={tipoFrota} 
          onValueChange={(value) => setTipoFrota(value as 'frota' | 'terceiro')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="frota" id="frota-propria" />
            <Label htmlFor="frota-propria" className="cursor-pointer">Própria</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="terceiro" id="frota-terceirizada" />
            <Label htmlFor="frota-terceirizada" className="cursor-pointer">Terceirizada</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={carregando}>
          {carregando ? 'Processando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default CadastroPlacaForm;
