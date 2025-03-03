
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Calendar as CalendarIcon,
  Truck,
  User,
  Building,
  MapPin,
  Search
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CadastroMotoristaForm from './CadastroMotoristaForm';
import CadastroProprietarioForm from './CadastroProprietarioForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Importa constantes de estados
const estados = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' },
  { nome: 'Amapá', sigla: 'AP' },
  { nome: 'Amazonas', sigla: 'AM' },
  { nome: 'Bahia', sigla: 'BA' },
  { nome: 'Ceará', sigla: 'CE' },
  { nome: 'Distrito Federal', sigla: 'DF' },
  { nome: 'Espírito Santo', sigla: 'ES' },
  { nome: 'Goiás', sigla: 'GO' },
  { nome: 'Maranhão', sigla: 'MA' },
  { nome: 'Mato Grosso', sigla: 'MT' },
  { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { nome: 'Minas Gerais', sigla: 'MG' },
  { nome: 'Pará', sigla: 'PA' },
  { nome: 'Paraíba', sigla: 'PB' },
  { nome: 'Paraná', sigla: 'PR' },
  { nome: 'Pernambuco', sigla: 'PE' },
  { nome: 'Piauí', sigla: 'PI' },
  { nome: 'Rio de Janeiro', sigla: 'RJ' },
  { nome: 'Rio Grande do Norte', sigla: 'RN' },
  { nome: 'Rio Grande do Sul', sigla: 'RS' },
  { nome: 'Rondônia', sigla: 'RO' },
  { nome: 'Roraima', sigla: 'RR' },
  { nome: 'Santa Catarina', sigla: 'SC' },
  { nome: 'São Paulo', sigla: 'SP' },
  { nome: 'Sergipe', sigla: 'SE' },
  { nome: 'Tocantins', sigla: 'TO' }
];

export interface DadosContratoFormData {
  idContrato: string;
  dataSaida: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  clienteDestino: string;
  tipo: 'frota' | 'terceiro';
  placaCavalo: string;
  placaCarreta: string;
  motorista: string;
  proprietario: string;
  proprietarioInfo?: any;
}

interface FormularioDadosContratoProps {
  onSubmit: (data: DadosContratoFormData) => void;
  onNext: () => void;
  initialData?: DadosContratoFormData;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({
  onSubmit,
  onNext,
  initialData
}) => {
  const [formData, setFormData] = useState<DadosContratoFormData>({
    idContrato: '',
    dataSaida: '',
    cidadeOrigem: '',
    estadoOrigem: '',
    cidadeDestino: '',
    estadoDestino: '',
    clienteDestino: '',
    tipo: 'frota',
    placaCavalo: '',
    placaCarreta: '',
    motorista: '',
    proprietario: ''
  });
  
  const [dataAberta, setDataAberta] = useState(false);
  const [placasCavalo, setPlacasCavalo] = useState<string[]>([]);
  const [placasCarreta, setPlacasCarreta] = useState<string[]>([]);
  const [motoristas, setMotoristas] = useState<string[]>([]);
  const [proprietarios, setProprietarios] = useState<{nome: string, documento?: string, dados_bancarios?: string}[]>([]);
  const [cadastroAberto, setCadastroAberto] = useState<'motorista' | 'proprietario' | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [placaCavaloModalAberta, setPlacaCavaloModalAberta] = useState(false);
  const [placaCarretaModalAberta, setPlacaCarretaModalAberta] = useState(false);
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    
    carregarDados();
  }, [initialData]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      // Carregar placas de cavalo
      const { data: cavalos, error: errorCavalos } = await supabase
        .from('Veiculos')
        .select('placa_cavalo')
        .not('placa_cavalo', 'is', null);
        
      if (errorCavalos) throw errorCavalos;
      
      // Carregar placas de carreta
      const { data: carretas, error: errorCarretas } = await supabase
        .from('Veiculos')
        .select('placa_carreta')
        .not('placa_carreta', 'is', null);
        
      if (errorCarretas) throw errorCarretas;
      
      // Carregar motoristas
      const { data: motoristasData, error: errorMotoristas } = await supabase
        .from('Motoristas')
        .select('nome')
        .eq('status', 'active');
        
      if (errorMotoristas) throw errorMotoristas;
      
      // Carregar proprietários
      const { data: proprietariosData, error: errorProprietarios } = await supabase
        .from('Proprietarios')
        .select('nome, documento, dados_bancarios');
        
      if (errorProprietarios) throw errorProprietarios;
      
      setPlacasCavalo(cavalos.map(c => c.placa_cavalo).filter(Boolean));
      setPlacasCarreta(carretas.map(c => c.placa_carreta).filter(Boolean));
      setMotoristas(motoristasData.map(m => m.nome));
      setProprietarios(proprietariosData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Ocorreu um erro ao carregar os dados iniciais');
    } finally {
      setCarregando(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (field: keyof DadosContratoFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Se o tipo for alterado, limpe os dados relacionados
    if (field === 'tipo' && value === 'frota') {
      setFormData(prev => ({ ...prev, proprietario: '' }));
    }
    
    // Se o proprietário for selecionado, guarde suas informações
    if (field === 'proprietario') {
      const propInfo = proprietarios.find(p => p.nome === value);
      if (propInfo) {
        let dadosBancarios = null;
        try {
          dadosBancarios = propInfo.dados_bancarios ? JSON.parse(propInfo.dados_bancarios) : null;
        } catch (e) {
          console.error('Erro ao parsear dados bancários:', e);
        }
        
        setFormData(prev => ({ 
          ...prev, 
          proprietario: value,
          proprietarioInfo: {
            nome: propInfo.nome,
            documento: propInfo.documento,
            dadosBancarios
          }
        }));
      }
    }
  };
  
  const handleDataChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, dataSaida: format(date, 'yyyy-MM-dd') }));
      setDataAberta(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar campos obrigatórios
    if (!formData.idContrato.trim()) {
      toast.error('Número do contrato é obrigatório');
      return;
    }
    
    if (!formData.dataSaida) {
      toast.error('Data de saída é obrigatória');
      return;
    }
    
    if (!formData.cidadeOrigem.trim() || !formData.estadoOrigem.trim()) {
      toast.error('Cidade e estado de origem são obrigatórios');
      return;
    }
    
    if (!formData.cidadeDestino.trim() || !formData.estadoDestino.trim()) {
      toast.error('Cidade e estado de destino são obrigatórios');
      return;
    }
    
    if (!formData.clienteDestino.trim()) {
      toast.error('Cliente destino é obrigatório');
      return;
    }
    
    if (!formData.placaCavalo.trim()) {
      toast.error('Placa do cavalo é obrigatória');
      return;
    }
    
    if (!formData.motorista.trim()) {
      toast.error('Motorista é obrigatório');
      return;
    }
    
    if (formData.tipo === 'terceiro' && !formData.proprietario.trim()) {
      toast.error('Proprietário é obrigatório para veículos terceirizados');
      return;
    }
    
    onSubmit(formData);
  };
  
  const handleCadastroMotorista = async (data: { nome: string; cpf: string; tipo: "frota" | "terceiro"; }) => {
    setFormData(prev => ({ ...prev, motorista: data.nome }));
    await carregarDados(); // Recarregar dados atualizados
    setCadastroAberto(null);
  };
  
  const handleCadastroProprietario = async (dados: { nome: string }) => {
    setFormData(prev => ({ ...prev, proprietario: dados.nome }));
    await carregarDados(); // Recarregar dados atualizados
    setCadastroAberto(null);
  };

  const abrirSelecaoPlacaCavalo = () => {
    setPlacaCavaloModalAberta(true);
  };

  const abrirSelecaoPlacaCarreta = () => {
    setPlacaCarretaModalAberta(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Número do Contrato */}
      <div className="space-y-1">
        <Label htmlFor="idContrato" className="text-base">
          Número do Contrato *
        </Label>
        <Input
          id="idContrato"
          placeholder="Número gerado pelo setor de operação"
          value={formData.idContrato}
          onChange={handleInputChange}
          className="max-w-full"
          required
        />
      </div>

      {/* Data de Saída / Cidade Origem / Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <Label htmlFor="dataSaida" className="text-base">
            Data de Saída *
          </Label>
          <Popover open={dataAberta} onOpenChange={setDataAberta}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!formData.dataSaida && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.dataSaida ? format(new Date(formData.dataSaida), 'dd/MM/yyyy') : <span>dd/mm/aaaa</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.dataSaida ? new Date(formData.dataSaida) : undefined}
                onSelect={handleDataChange}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="cidadeOrigem" className="text-base">
            Cidade de Origem *
          </Label>
          <Input
            id="cidadeOrigem"
            placeholder="Cidade onde começa o transporte"
            value={formData.cidadeOrigem}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="estadoOrigem" className="text-base">
            Estado *
          </Label>
          <Select
            value={formData.estadoOrigem}
            onValueChange={(value) => handleSelectChange('estadoOrigem', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.sigla} value={estado.sigla}>
                  {estado.sigla}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cidade Destino / Estado / Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1">
          <Label htmlFor="cidadeDestino" className="text-base">
            Cidade de Destino *
          </Label>
          <Input
            id="cidadeDestino"
            placeholder="Cidade onde será entregue"
            value={formData.cidadeDestino}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="estadoDestino" className="text-base">
            Estado *
          </Label>
          <Select
            value={formData.estadoDestino}
            onValueChange={(value) => handleSelectChange('estadoDestino', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="UF" />
            </SelectTrigger>
            <SelectContent>
              {estados.map((estado) => (
                <SelectItem key={estado.sigla} value={estado.sigla}>
                  {estado.sigla}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor="clienteDestino" className="text-base">
            Cliente Destino *
          </Label>
          <Input
            id="clienteDestino"
            placeholder="Cliente que receberá a carga"
            value={formData.clienteDestino}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {/* Tipo */}
      <div className="space-y-1">
        <Label htmlFor="tipo" className="text-base">
          Tipo *
        </Label>
        <Select
          value={formData.tipo}
          onValueChange={(value) => handleSelectChange('tipo', value as 'frota' | 'terceiro')}
        >
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="frota">Frota</SelectItem>
            <SelectItem value="terceiro">Terceiro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Placas e Motorista */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="placaCavalo" className="text-base">
              Placa do Cavalo *
            </Label>
          </div>
          <div className="flex space-x-2">
            <Select
              value={formData.placaCavalo}
              onValueChange={(value) => handleSelectChange('placaCavalo', value)}
            >
              <SelectTrigger id="placaCavalo" className="flex-1">
                <SelectValue placeholder="Selecione a placa" />
              </SelectTrigger>
              <SelectContent>
                {placasCavalo.map((placa) => (
                  <SelectItem key={placa} value={placa}>
                    {placa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button"
              variant="outline"
              onClick={abrirSelecaoPlacaCavalo}
              className="h-10 w-10 p-2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="placaCarreta" className="text-base">
              Placa da Carreta
            </Label>
          </div>
          <div className="flex space-x-2">
            <Select
              value={formData.placaCarreta}
              onValueChange={(value) => handleSelectChange('placaCarreta', value)}
            >
              <SelectTrigger id="placaCarreta" className="flex-1">
                <SelectValue placeholder="Selecione a placa (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sem carreta</SelectItem>
                {placasCarreta.map((placa) => (
                  <SelectItem key={placa} value={placa}>
                    {placa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              type="button"
              variant="outline"
              onClick={abrirSelecaoPlacaCarreta}
              className="h-10 w-10 p-2"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="motorista" className="text-base">
              Motorista *
            </Label>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1"
              type="button"
              onClick={() => setCadastroAberto('motorista')}
            >
              <User className="h-4 w-4" /> Cadastrar
            </Button>
          </div>
          <Select
            value={formData.motorista}
            onValueChange={(value) => handleSelectChange('motorista', value)}
          >
            <SelectTrigger id="motorista">
              <SelectValue placeholder="Selecione o motorista" />
            </SelectTrigger>
            <SelectContent>
              {motoristas.map((motorista) => (
                <SelectItem key={motorista} value={motorista}>
                  {motorista}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {formData.tipo === 'terceiro' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="proprietario" className="text-base">
                Proprietário *
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 gap-1"
                type="button"
                onClick={() => setCadastroAberto('proprietario')}
              >
                <Building className="h-4 w-4" /> Cadastrar
              </Button>
            </div>
            <Select
              value={formData.proprietario}
              onValueChange={(value) => handleSelectChange('proprietario', value)}
            >
              <SelectTrigger id="proprietario">
                <SelectValue placeholder="Selecione o proprietário" />
              </SelectTrigger>
              <SelectContent>
                {proprietarios.map((proprietario) => (
                  <SelectItem key={proprietario.nome} value={proprietario.nome}>
                    {proprietario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="submit" className="gap-2">
          <Truck className="h-4 w-4" />
          Salvar e Continuar
        </Button>
      </div>

      {/* Modais de Cadastro */}
      {cadastroAberto === 'motorista' && (
        <CadastroMotoristaForm
          onSave={handleCadastroMotorista}
          onCancel={() => setCadastroAberto(null)}
        />
      )}
      
      {cadastroAberto === 'proprietario' && (
        <CadastroProprietarioForm
          onSave={handleCadastroProprietario}
          onCancel={() => setCadastroAberto(null)}
        />
      )}
    </form>
  );
};

export default FormularioDadosContrato;
