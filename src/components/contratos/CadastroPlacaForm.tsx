
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TipoFreteVeiculo } from '@/types/veiculo';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { isValidPlaca } from '@/utils/validations';

interface CadastroPlacaFormProps {
  onSave: (data: any) => void;
  onCancel?: () => void;
}

const CadastroPlacaForm: React.FC<CadastroPlacaFormProps> = ({ onSave, onCancel }) => {
  const [placaCavalo, setPlacaCavalo] = useState('');
  const [placaCarreta, setPlacaCarreta] = useState('');
  const [tipoFrota, setTipoFrota] = useState<TipoFreteVeiculo>('propria');
  const [proprietario, setProprietario] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [placaErro, setPlacaErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const validarPlaca = (placa: string): boolean => {
    // Se a placa estiver vazia, retornamos true (não é obrigatória)
    if (!placa) return true;
    
    return isValidPlaca(placa);
  };

  const handlePlacaCavaloChange = (value: string) => {
    setPlacaCavalo(value.toUpperCase());
    if (value && !validarPlaca(value)) {
      setPlacaErro("A placa informada é inválida. Use o formato ABC-1234 ou ABC1D23.");
    } else {
      setPlacaErro(null);
    }
  };

  const handlePlacaCarretaChange = (value: string) => {
    setPlacaCarreta(value.toUpperCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    
    // Validar placa
    if (!placaCavalo) {
      setErro("A placa do cavalo é obrigatória");
      return;
    }
    
    if (!validarPlaca(placaCavalo)) {
      setErro("A placa do cavalo informada é inválida");
      return;
    }
    
    if (placaCarreta && !validarPlaca(placaCarreta)) {
      setErro("A placa da carreta informada é inválida");
      return;
    }
    
    // Se for terceirizada, proprietário é obrigatório
    if (tipoFrota === 'terceiro' && !proprietario) {
      setErro("Para veículos terceirizados, o proprietário é obrigatório");
      return;
    }

    setCarregando(true);
    
    try {
      // Verificar se a placa já existe
      const { data: placaExistente, error: erroConsulta } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('placa_cavalo', placaCavalo)
        .maybeSingle();
      
      if (erroConsulta) {
        console.error('Erro ao verificar placa:', erroConsulta);
        throw erroConsulta;
      }
      
      if (placaExistente) {
        setErro("Esta placa já está cadastrada no sistema");
        setCarregando(false);
        return;
      }
      
      // Inserir nova placa
      const { error } = await supabase
        .from('Veiculos')
        .insert({
          placa_cavalo: placaCavalo,
          placa_carreta: placaCarreta || null,
          tipo_frota: tipoFrota,
          status_veiculo: 'ativo'
        });
      
      if (error) {
        console.error('Erro ao cadastrar veículo:', error);
        throw error;
      }
      
      // Se for terceirizada, cadastrar proprietário também
      if (tipoFrota === 'terceiro' && proprietario) {
        // Verificar se o proprietário já existe
        const { data: propExistente, error: erroProp } = await supabase
          .from('Proprietarios')
          .select('*')
          .eq('nome', proprietario)
          .maybeSingle();
        
        if (erroProp) {
          console.error('Erro ao verificar proprietário:', erroProp);
        }
        
        // Se não existir, criar novo proprietário
        if (!propExistente) {
          const { error: erroInsercao } = await supabase
            .from('Proprietarios')
            .insert({
              nome: proprietario,
            });
          
          if (erroInsercao) {
            console.error('Erro ao cadastrar proprietário:', erroInsercao);
          }
        }
        
        // Cadastrar na tabela de relacionamento
        const { error: erroRelacao } = await supabase
          .from('VeiculoProprietarios')
          .insert({
            placa_cavalo: placaCavalo,
            proprietario_nome: proprietario
          });
        
        if (erroRelacao) {
          console.error('Erro ao vincular proprietário ao veículo:', erroRelacao);
        }
      }
      
      toast.success('Veículo cadastrado com sucesso!');
      onSave({ placaCavalo, placaCarreta, tipoFrota, proprietario });
    } catch (error) {
      console.error('Erro ao cadastrar veículo:', error);
      setErro('Ocorreu um erro ao cadastrar o veículo. Por favor, tente novamente.');
      toast.error('Erro ao cadastrar veículo');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{erro}</AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label htmlFor="placaCavalo">Placa do Cavalo*</Label>
        <Input
          id="placaCavalo"
          value={placaCavalo}
          onChange={(e) => handlePlacaCavaloChange(e.target.value)}
          className={`mt-1 ${placaErro ? 'border-red-500' : ''}`}
          placeholder="Digite a placa (ex: ABC-1234)"
        />
        {placaErro && <p className="text-red-500 text-sm mt-1">{placaErro}</p>}
      </div>
      
      <div>
        <Label htmlFor="placaCarreta">Placa da Carreta (opcional)</Label>
        <Input
          id="placaCarreta"
          value={placaCarreta}
          onChange={(e) => handlePlacaCarretaChange(e.target.value)}
          className="mt-1"
          placeholder="Digite a placa da carreta (opcional)"
        />
      </div>
      
      <div>
        <Label>Tipo de Frota*</Label>
        <RadioGroup
          value={tipoFrota}
          onValueChange={(v) => setTipoFrota(v as TipoFreteVeiculo)}
          className="flex space-x-4 mt-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="propria" id="propria" />
            <Label htmlFor="propria" className="cursor-pointer">Própria</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="terceiro" id="terceiro" />
            <Label htmlFor="terceiro" className="cursor-pointer">Terceirizada</Label>
          </div>
        </RadioGroup>
      </div>
      
      {tipoFrota === 'terceiro' && (
        <div>
          <Label htmlFor="proprietario">Proprietário*</Label>
          <Input
            id="proprietario"
            value={proprietario}
            onChange={(e) => setProprietario(e.target.value)}
            className="mt-1"
            placeholder="Nome do proprietário"
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={carregando}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={carregando || !!placaErro}
        >
          {carregando ? 'Cadastrando...' : 'Cadastrar Veículo'}
        </Button>
      </div>
    </form>
  );
};

export default CadastroPlacaForm;
