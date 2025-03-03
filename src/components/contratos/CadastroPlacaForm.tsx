
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logOperation } from '@/utils/logOperations';

interface Proprietario {
  nome: string;
  documento: string;
  dados_bancarios?: string;
}

interface CadastroPlacaFormProps {
  onSave: (data: { 
    placaCavalo?: string; 
    placaCarreta?: string; 
    tipoFrota: 'frota' | 'terceiro'; 
    proprietario?: string;
    proprietarioInfo?: {
      nome: string;
      documento: string;
      dadosBancarios?: any;
    }
  }) => void;
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
  const [proprietario, setProprietario] = useState('');
  const [proprietarios, setProprietarios] = useState<Proprietario[]>([]);
  const [carregandoProprietarios, setCarregandoProprietarios] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [proprietarioSelecionado, setProprietarioSelecionado] = useState<Proprietario | null>(null);

  useEffect(() => {
    if (tipoFrota === 'terceiro') {
      carregarProprietarios();
    }
  }, [tipoFrota]);

  const carregarProprietarios = async () => {
    setCarregandoProprietarios(true);
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('*');

      if (error) {
        console.error('Erro ao carregar proprietários:', error);
        toast.error('Erro ao carregar proprietários');
      } else if (data) {
        setProprietarios(data);
      }
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao processar dados dos proprietários');
    } finally {
      setCarregandoProprietarios(false);
    }
  };

  const validarPlaca = (placa: string) => {
    // Validação básica de placa (formato antigo: ABC-1234 ou novo: ABC1D23)
    const regexAntigoMercosul = /^[A-Z]{3}-\d{4}$/;
    const regexNovoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    
    // Formato sem hífen também é válido para placas antigas
    const regexAntigoSemHifen = /^[A-Z]{3}\d{4}$/;
    
    return regexAntigoMercosul.test(placa) || 
           regexNovoMercosul.test(placa) || 
           regexAntigoSemHifen.test(placa);
  };

  const formatarPlaca = (placa: string) => {
    // Remover espaços e caracteres especiais
    const placaLimpa = placa.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
    
    // Formatar placa no padrão antigo (ABC1234 -> ABC-1234)
    if (/^[A-Z]{3}\d{4}$/.test(placaLimpa)) {
      return `${placaLimpa.substring(0, 3)}-${placaLimpa.substring(3)}`;
    }
    
    return placaLimpa;
  };

  const handleProprietarioChange = async (novoProprietario: string) => {
    setProprietario(novoProprietario);
    
    // Buscar dados completos do proprietário
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', novoProprietario)
        .single();
        
      if (error) {
        console.error('Erro ao buscar dados do proprietário:', error);
      } else if (data) {
        setProprietarioSelecionado({
          nome: data.nome,
          documento: data.documento,
          dados_bancarios: data.dados_bancarios
        });
      }
    } catch (error) {
      console.error('Erro ao processar dados do proprietário:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (isCarreta) {
        // Formatar e validar a placa da carreta
        const placaFormatada = formatarPlaca(placaCarreta);
        
        if (!placaFormatada || !validarPlaca(placaFormatada)) {
          toast.error('Por favor, insira uma placa de carreta válida (formato: ABC-1234 ou ABC1D23)');
          setCarregando(false);
          return;
        }

        // Verificar se a placa já existe
        const { data: placaExistente, error: errorVerificacao } = await supabase
          .from('Veiculos')
          .select('*')
          .eq('placa_carreta', placaFormatada);

        if (errorVerificacao) {
          console.error('Erro ao verificar placa:', errorVerificacao);
          toast.error('Erro ao verificar placa no sistema');
          setCarregando(false);
          return;
        }

        if (placaExistente && placaExistente.length > 0) {
          toast.error('Esta placa de carreta já está cadastrada no sistema');
          setCarregando(false);
          return;
        }

        // Inserir a placa da carreta
        const { error } = await supabase
          .from('Veiculos')
          .insert({
            placa_carreta: placaFormatada,
            tipo_frota: tipoFrota,
            status_veiculo: 'Ativo'
          });

        if (error) {
          console.error('Erro ao cadastrar placa:', error);
          toast.error('Erro ao cadastrar placa de carreta');
          logOperation('Veículos', 'Erro ao cadastrar carreta', error.message);
          setCarregando(false);
          return;
        }

        logOperation('Veículos', 'Cadastro de carreta', `Placa: ${placaFormatada}`);
        toast.success('Placa de carreta cadastrada com sucesso!');
        
        const resultData = { 
          placaCarreta: placaFormatada, 
          tipoFrota 
        };
        
        // Adicionar proprietário se for terceirizado
        if (tipoFrota === 'terceiro' && proprietario) {
          Object.assign(resultData, { 
            proprietario,
            proprietarioInfo: proprietarioSelecionado ? {
              nome: proprietarioSelecionado.nome,
              documento: proprietarioSelecionado.documento,
              dadosBancarios: proprietarioSelecionado.dados_bancarios ? JSON.parse(proprietarioSelecionado.dados_bancarios) : null
            } : undefined
          });
        }
        
        onSave(resultData);
      } else {
        // Formatar e validar a placa do cavalo
        const placaFormatada = formatarPlaca(placaCavalo);
        
        if (!placaFormatada || !validarPlaca(placaFormatada)) {
          toast.error('Por favor, insira uma placa de cavalo válida (formato: ABC-1234 ou ABC1D23)');
          setCarregando(false);
          return;
        }

        // Verificar se a placa já existe
        const { data: placaExistente, error: errorVerificacao } = await supabase
          .from('Veiculos')
          .select('*')
          .eq('placa_cavalo', placaFormatada);

        if (errorVerificacao) {
          console.error('Erro ao verificar placa:', errorVerificacao);
          toast.error('Erro ao verificar placa no sistema');
          setCarregando(false);
          return;
        }

        if (placaExistente && placaExistente.length > 0) {
          toast.error('Esta placa de cavalo já está cadastrada no sistema');
          setCarregando(false);
          return;
        }

        const placaCarretaFormatada = placaCarreta ? formatarPlaca(placaCarreta) : null;
        
        // Se informou placa da carreta, validar também
        if (placaCarretaFormatada && !validarPlaca(placaCarretaFormatada)) {
          toast.error('Por favor, insira uma placa de carreta válida (formato: ABC-1234 ou ABC1D23)');
          setCarregando(false);
          return;
        }

        // Inserir o veículo
        const { error } = await supabase
          .from('Veiculos')
          .insert({
            placa_cavalo: placaFormatada,
            placa_carreta: placaCarretaFormatada || null,
            tipo_frota: tipoFrota,
            status_veiculo: 'Ativo'
          });

        if (error) {
          console.error('Erro ao cadastrar veículo:', error);
          toast.error('Erro ao cadastrar veículo. Por favor, verifique as permissões ou tente novamente.');
          logOperation('Veículos', 'Erro ao cadastrar cavalo', error.message);
          setCarregando(false);
          return;
        }

        // Se for veículo terceirizado e tiver proprietário selecionado, associar
        if (tipoFrota === 'terceiro' && proprietario) {
          // Associar proprietário ao veículo
          const { error: errorAssociacao } = await supabase
            .from('VeiculoProprietarios')
            .insert({
              placa_cavalo: placaFormatada,
              proprietario_nome: proprietario
            });
            
          if (errorAssociacao) {
            console.error('Erro ao associar proprietário:', errorAssociacao);
            toast.error('Veículo cadastrado, mas houve erro ao associar proprietário');
          }
        }

        logOperation('Veículos', 'Cadastro de cavalo', `Placa: ${placaFormatada}`);
        toast.success('Veículo cadastrado com sucesso!');
        
        const resultData = { 
          placaCavalo: placaFormatada, 
          placaCarreta: placaCarretaFormatada || undefined, 
          tipoFrota 
        };
        
        // Adicionar proprietário se for terceirizado
        if (tipoFrota === 'terceiro' && proprietario) {
          Object.assign(resultData, { 
            proprietario,
            proprietarioInfo: proprietarioSelecionado ? {
              nome: proprietarioSelecionado.nome,
              documento: proprietarioSelecionado.documento,
              dadosBancarios: proprietarioSelecionado.dados_bancarios ? JSON.parse(proprietarioSelecionado.dados_bancarios) : null
            } : undefined
          });
        }
        
        onSave(resultData);
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
      
      {tipoFrota === 'terceiro' && (
        <div className="space-y-2">
          <Label htmlFor="proprietario">Proprietário *</Label>
          <Select 
            value={proprietario} 
            onValueChange={handleProprietarioChange}
            disabled={carregandoProprietarios}
          >
            <SelectTrigger>
              <SelectValue placeholder={carregandoProprietarios ? "Carregando..." : "Selecione o proprietário"} />
            </SelectTrigger>
            <SelectContent>
              {proprietarios.map((prop) => (
                <SelectItem key={prop.nome} value={prop.nome}>{prop.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
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
