
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { estadosBrasileiros } from '@/utils/constants';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Truck } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CadastroPlacaForm from './CadastroPlacaForm';
import CadastroMotoristaForm from './CadastroMotoristaForm';

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
}

export interface FormularioDadosContratoProps {
  onSave: (data: DadosContratoFormData) => void;
  onNext?: () => void;
  initialData?: DadosContratoFormData;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({
  onSave,
  onNext,
  initialData
}) => {
  // Estados para os campos do formulário
  const [idContrato, setIdContrato] = useState(initialData?.idContrato || '');
  const [dataSaida, setDataSaida] = useState<Date | undefined>(
    initialData?.dataSaida ? new Date(initialData.dataSaida) : new Date()
  );
  const [cidadeOrigem, setCidadeOrigem] = useState(initialData?.cidadeOrigem || '');
  const [estadoOrigem, setEstadoOrigem] = useState(initialData?.estadoOrigem || 'SP');
  const [cidadeDestino, setCidadeDestino] = useState(initialData?.cidadeDestino || '');
  const [estadoDestino, setEstadoDestino] = useState(initialData?.estadoDestino || '');
  const [clienteDestino, setClienteDestino] = useState(initialData?.clienteDestino || '');
  const [tipo, setTipo] = useState<'frota' | 'terceiro'>(initialData?.tipo || 'frota');
  const [placaCavalo, setPlacaCavalo] = useState(initialData?.placaCavalo || '');
  const [placaCarreta, setPlacaCarreta] = useState(initialData?.placaCarreta || '');
  const [motorista, setMotorista] = useState(initialData?.motorista || '');
  const [proprietario, setProprietario] = useState(initialData?.proprietario || '');
  
  // Estados para listas de opções
  const [placasVeiculos, setPlacasVeiculos] = useState<any[]>([]);
  const [motoristas, setMotoristas] = useState<any[]>([]);
  const [proprietarios, setProprietarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  
  // Estados para modais
  const [modalCadastroPlaca, setModalCadastroPlaca] = useState(false);
  const [modalCadastroMotorista, setModalCadastroMotorista] = useState(false);
  
  // Carregar opções ao iniciar
  useEffect(() => {
    carregarPlacas();
    carregarMotoristas();
    carregarProprietarios();
    
    // Se não tiver ID do contrato, gerar um novo
    if (!initialData?.idContrato) {
      gerarNovoIdContrato();
    }
  }, []);
  
  const gerarNovoIdContrato = async () => {
    try {
      // Obter a data atual formatada YYYYMMDD
      const dataAtual = format(new Date(), 'yyyyMMdd');
      
      // Consultar contratos do dia para gerar número sequencial
      const { data, error } = await supabase
        .from('Contratos')
        .select('id')
        .gte('created_at', `${format(new Date(), 'yyyy-MM-dd')}T00:00:00`)
        .order('id', { ascending: false })
        .limit(1);
        
      if (error) throw error;
      
      // Gerar número sequencial
      let sequencial = '001';
      if (data && data.length > 0) {
        // Extrair o número sequencial do último contrato do dia
        const ultimoId = String(data[0].id);
        if (ultimoId.length >= 3) {
          const ultimoSequencial = parseInt(ultimoId.substring(ultimoId.length - 3));
          sequencial = String(ultimoSequencial + 1).padStart(3, '0');
        }
      }
      
      // Definir novo ID no formato YYYYMMDDXXX
      // Exemplo: 20240101001
      const novoId = `${dataAtual}${sequencial}`;
      setIdContrato(novoId);
        
    } catch (error) {
      console.error('Erro ao gerar ID do contrato:', error);
      // Fallback: timestamp + 3 dígitos aleatórios
      const timestamp = Date.now();
      const aleatorio = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      setIdContrato(`${timestamp}${aleatorio}`);
    }
  };
  
  const carregarPlacas = async () => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('status_veiculo', 'ativo');
        
      if (error) throw error;
      if (data) setPlacasVeiculos(data);
    } catch (error) {
      console.error('Erro ao carregar veículos:', error);
      setErro('Não foi possível carregar os veículos');
    } finally {
      setCarregando(false);
    }
  };
  
  const carregarMotoristas = async () => {
    try {
      const { data, error } = await supabase
        .from('Motorista')
        .select('id, nome');
        
      if (error) throw error;
      if (data) setMotoristas(data);
    } catch (error) {
      console.error('Erro ao carregar motoristas:', error);
    }
  };
  
  const carregarProprietarios = async () => {
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('nome');
        
      if (error) throw error;
      if (data) setProprietarios(data);
    } catch (error) {
      console.error('Erro ao carregar proprietários:', error);
    }
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar dados
    if (!idContrato || !dataSaida || !cidadeOrigem || !estadoOrigem || 
        !cidadeDestino || !estadoDestino || !clienteDestino || !placaCavalo || !motorista) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Se for terceirizado, proprietário é obrigatório
    if (tipo === 'terceiro' && !proprietario) {
      toast.error('Proprietário é obrigatório para veículos terceirizados');
      return;
    }
    
    // Formatar objeto de dados
    const formattedDate = format(dataSaida || new Date(), 'yyyy-MM-dd');
    
    const formData: DadosContratoFormData = {
      idContrato,
      dataSaida: formattedDate,
      cidadeOrigem,
      estadoOrigem,
      cidadeDestino,
      estadoDestino,
      clienteDestino,
      tipo,
      placaCavalo,
      placaCarreta,
      motorista,
      proprietario
    };
    
    // Enviar dados
    onSave(formData);
    if (onNext) onNext();
  };
  
  const handleCadastroPlacaSuccess = (data: any) => {
    setModalCadastroPlaca(false);
    setPlacaCavalo(data.placaCavalo);
    if (data.placaCarreta) setPlacaCarreta(data.placaCarreta);
    if (data.tipoFrota === 'terceiro') setTipo('terceiro');
    if (data.proprietario) setProprietario(data.proprietario);
    carregarPlacas();
    toast.success('Veículo cadastrado com sucesso!');
  };
  
  const handleCadastroMotoristaSuccess = (data: any) => {
    setModalCadastroMotorista(false);
    setMotorista(String(data.id));
    carregarMotoristas();
    toast.success('Motorista cadastrado com sucesso!');
  };

  return (
    <form onSubmit={handleSave}>
      <Card>
        <CardContent className="pt-6">
          {erro && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="idContrato">Número do Contrato*</Label>
              <Input
                id="idContrato"
                value={idContrato}
                onChange={(e) => setIdContrato(e.target.value)}
                placeholder="Número do contrato"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataSaida">Data de Saída*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataSaida && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dataSaida ? (
                      format(dataSaida, 'PPP', { locale: ptBR })
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataSaida}
                    onSelect={setDataSaida}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="cidadeOrigem">Cidade de Origem*</Label>
                <Input
                  id="cidadeOrigem"
                  value={cidadeOrigem}
                  onChange={(e) => setCidadeOrigem(e.target.value)}
                  placeholder="Cidade de origem"
                />
              </div>
              
              <div>
                <Label htmlFor="estadoOrigem">Estado*</Label>
                <Select value={estadoOrigem} onValueChange={setEstadoOrigem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosBrasileiros.map((estado) => (
                      <SelectItem key={estado.sigla} value={estado.sigla}>
                        {estado.sigla} - {estado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="cidadeDestino">Cidade de Destino*</Label>
                <Input
                  id="cidadeDestino"
                  value={cidadeDestino}
                  onChange={(e) => setCidadeDestino(e.target.value)}
                  placeholder="Cidade de destino"
                />
              </div>
              
              <div>
                <Label htmlFor="estadoDestino">Estado*</Label>
                <Select value={estadoDestino} onValueChange={setEstadoDestino}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estadosBrasileiros.map((estado) => (
                      <SelectItem key={estado.sigla} value={estado.sigla}>
                        {estado.sigla} - {estado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="clienteDestino">Cliente Destinatário*</Label>
              <Input
                id="clienteDestino"
                value={clienteDestino}
                onChange={(e) => setClienteDestino(e.target.value)}
                placeholder="Nome do cliente destinatário"
              />
            </div>
          </div>
          
          <div className="space-y-6 mb-4">
            <div>
              <Label>Tipo de Frete*</Label>
              <RadioGroup
                value={tipo}
                onValueChange={(v) => setTipo(v as 'frota' | 'terceiro')}
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="frota" id="frota" />
                  <Label htmlFor="frota" className="cursor-pointer">Frota Própria</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="terceiro" id="terceiro" />
                  <Label htmlFor="terceiro" className="cursor-pointer">Frete Terceirizado</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="placaCavalo">Placa do Cavalo*</Label>
                  <Dialog open={modalCadastroPlaca} onOpenChange={setModalCadastroPlaca}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        <Truck className="mr-1 h-3 w-3" />
                        Nova Placa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cadastrar Nova Placa de Cavalo</DialogTitle>
                      </DialogHeader>
                      <CadastroPlacaForm 
                        onSave={handleCadastroPlacaSuccess}
                        onCancel={() => setModalCadastroPlaca(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <Select value={placaCavalo} onValueChange={setPlacaCavalo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a placa" />
                  </SelectTrigger>
                  <SelectContent>
                    {placasVeiculos.map((veiculo) => (
                      <SelectItem key={veiculo.placa_cavalo} value={veiculo.placa_cavalo}>
                        {veiculo.placa_cavalo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="placaCarreta">Placa da Carreta</Label>
                <Input
                  id="placaCarreta"
                  value={placaCarreta}
                  onChange={(e) => setPlacaCarreta(e.target.value)}
                  placeholder="Placa da carreta (opcional)"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="motorista">Motorista*</Label>
                  <Dialog open={modalCadastroMotorista} onOpenChange={setModalCadastroMotorista}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Novo Motorista
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
                      </DialogHeader>
                      <CadastroMotoristaForm 
                        onSave={handleCadastroMotoristaSuccess}
                        onCancel={() => setModalCadastroMotorista(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                <Select value={motorista} onValueChange={setMotorista}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o motorista" />
                  </SelectTrigger>
                  <SelectContent>
                    {motoristas.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {tipo === 'terceiro' && (
                <div>
                  <Label htmlFor="proprietario">Proprietário*</Label>
                  <Select value={proprietario} onValueChange={setProprietario}>
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
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
            <Button type="submit">
              {onNext ? 'Continuar' : 'Salvar Dados'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormularioDadosContrato;
