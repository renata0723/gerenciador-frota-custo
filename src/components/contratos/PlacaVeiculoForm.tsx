
import React, { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PlacaVeiculoFormProps {
  onSave: (placaCavalo: string, placaCarreta: string | null, tipoFrota: string, proprietario: string) => void;
  onCancel: () => void;
}

const PlacaVeiculoForm: React.FC<PlacaVeiculoFormProps> = ({ onSave, onCancel }) => {
  const [placaCavalo, setPlacaCavalo] = useState('');
  const [placaCarreta, setPlacaCarreta] = useState('');
  const [tipoFrota, setTipoFrota] = useState<'Própria' | 'Terceirizada'>('Própria');
  const [proprietario, setProprietario] = useState('');
  const [proprietarios, setProprietarios] = useState<{nome: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    carregarProprietarios();
  }, []);

  const carregarProprietarios = async () => {
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
      console.error('Erro ao processar dados:', error);
    }
  };

  const validarPlaca = (placa: string): boolean => {
    // Validação simples de formato de placa brasileira (ABC1234 ou ABC1D23)
    const regexPlacaAntiga = /^[A-Z]{3}\d{4}$/;
    const regexPlacaNova = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    
    return regexPlacaAntiga.test(placa) || regexPlacaNova.test(placa);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    
    // Validação das placas
    if (!validarPlaca(placaCavalo)) {
      setErro("Formato da placa do cavalo inválido. Use o formato ABC1234 ou ABC1D23.");
      return;
    }
    
    if (placaCarreta && !validarPlaca(placaCarreta)) {
      setErro("Formato da placa da carreta inválido. Use o formato ABC1234 ou ABC1D23.");
      return;
    }
    
    // Validação do proprietário para frota terceirizada
    if (tipoFrota === 'Terceirizada' && !proprietario) {
      setErro("Para veículos terceirizados, é necessário informar o proprietário.");
      return;
    }
    
    setLoading(true);
    
    try {
      // Verificar se a placa já existe
      const { data: veiculoExistente, error: erroConsulta } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('placa_cavalo', placaCavalo)
        .single();
        
      if (erroConsulta && erroConsulta.code !== 'PGRST116') {
        // Erro diferente de "não encontrado"
        console.error('Erro ao verificar placa existente:', erroConsulta);
        setErro("Erro ao verificar placa no sistema.");
        setLoading(false);
        return;
      }
      
      if (veiculoExistente) {
        setErro("Esta placa já está cadastrada no sistema.");
        setLoading(false);
        return;
      }
        
      // Cadastrar o veículo
      const { error: erroInsercao } = await supabase
        .from('Veiculos')
        .insert({
          placa_cavalo: placaCavalo,
          placa_carreta: placaCarreta || null,
          tipo_frota: tipoFrota.toLowerCase(),
          status_veiculo: 'Ativo'
        });
        
      if (erroInsercao) {
        console.error('Erro ao cadastrar veículo:', erroInsercao);
        setErro("Erro ao cadastrar veículo. Por favor, verifique as permissões ou tente novamente.");
        setLoading(false);
        return;
      }
      
      // Se for terceirizado, vincular ao proprietário
      if (tipoFrota === 'Terceirizada') {
        const { error: erroProprietario } = await supabase
          .from('VeiculoProprietarios')
          .insert({
            placa_cavalo: placaCavalo,
            proprietario_nome: proprietario
          });
          
        if (erroProprietario) {
          console.error('Erro ao vincular proprietário:', erroProprietario);
          // Continuar mesmo com erro, pois o veículo já foi cadastrado
          toast.error("Veículo cadastrado, mas houve um erro ao vincular ao proprietário.");
        }
      }
      
      toast.success('Veículo cadastrado com sucesso!');
      onSave(placaCavalo, placaCarreta || null, tipoFrota.toLowerCase(), proprietario);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErro("Ocorreu um erro ao cadastrar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{erro}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="placa_cavalo" className="text-base">
          Placa do Cavalo <span className="text-red-500">*</span>
        </Label>
        <Input
          id="placa_cavalo"
          placeholder="Formato: ABC-1234 ou ABC1D23"
          value={placaCavalo}
          onChange={(e) => setPlacaCavalo(e.target.value.toUpperCase().replace('-', ''))}
          className="uppercase"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="placa_carreta" className="text-base">
          Placa da Carreta (opcional)
        </Label>
        <Input
          id="placa_carreta"
          placeholder="Formato: ABC-1234 ou ABC1D23"
          value={placaCarreta}
          onChange={(e) => setPlacaCarreta(e.target.value.toUpperCase().replace('-', ''))}
          className="uppercase"
        />
      </div>
      
      <div className="space-y-2">
        <Label className="text-base">
          Tipo de Frota <span className="text-red-500">*</span>
        </Label>
        <RadioGroup 
          value={tipoFrota} 
          onValueChange={(value) => setTipoFrota(value as 'Própria' | 'Terceirizada')}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Própria" id="frota-propria" />
            <Label htmlFor="frota-propria">Própria</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Terceirizada" id="frota-terceirizada" />
            <Label htmlFor="frota-terceirizada">Terceirizada</Label>
          </div>
        </RadioGroup>
      </div>
      
      {tipoFrota === 'Terceirizada' && (
        <div className="space-y-2">
          <Label htmlFor="proprietario" className="text-base">
            Proprietário <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={proprietario} 
            onValueChange={setProprietario}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o proprietário" />
            </SelectTrigger>
            <SelectContent>
              {proprietarios.map((p) => (
                <SelectItem key={p.nome} value={p.nome}>
                  {p.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
};

export default PlacaVeiculoForm;
