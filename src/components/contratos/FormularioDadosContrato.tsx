
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from '@/components/ui/date-picker';
import { supabase } from '@/integrations/supabase/client';
import { estadosBrasileiros } from '@/utils/constants';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CadastroPlacaForm from './CadastroPlacaForm';
import CadastroMotoristaForm from './CadastroMotoristaForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

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

interface FormularioDadosContratoProps {
  onSave: (data: DadosContratoFormData) => void;
  initialData?: DadosContratoFormData;
  onNext?: () => void;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({ 
  onSave, 
  initialData,
  onNext 
}) => {
  const [idContrato, setIdContrato] = useState<string>(initialData?.idContrato || '');
  const [dataSaida, setDataSaida] = useState<Date | undefined>(
    initialData?.dataSaida ? new Date(initialData.dataSaida) : undefined
  );
  const [cidadeOrigem, setCidadeOrigem] = useState<string>(initialData?.cidadeOrigem || '');
  const [estadoOrigem, setEstadoOrigem] = useState<string>(initialData?.estadoOrigem || '');
  const [cidadeDestino, setCidadeDestino] = useState<string>(initialData?.cidadeDestino || '');
  const [estadoDestino, setEstadoDestino] = useState<string>(initialData?.estadoDestino || '');
  const [clienteDestino, setClienteDestino] = useState<string>(initialData?.clienteDestino || '');
  const [tipo, setTipo] = useState<'frota' | 'terceiro'>(initialData?.tipo || 'frota');
  const [placaCavalo, setPlacaCavalo] = useState<string>(initialData?.placaCavalo || '');
  const [placaCarreta, setPlacaCarreta] = useState<string>(initialData?.placaCarreta || '');
  const [motorista, setMotorista] = useState<string>(initialData?.motorista || '');
  const [proprietario, setProprietario] = useState<string>(initialData?.proprietario || '');

  const [veiculos, setVeiculos] = useState<any[]>([]);
  const [motoristas, setMotoristas] = useState<any[]>([]);
  const [proprietarios, setProprietarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Dialogs para cadastro
  const [showNovaPlacaDialog, setShowNovaPlacaDialog] = useState(false);
  const [showNovoMotoristaDialog, setShowNovoMotoristaDialog] = useState(false);
  const [showNovoProprietarioDialog, setShowNovoProprietarioDialog] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      // Carregar veículos
      const { data: veiculosData } = await supabase
        .from('Veiculos')
        .select('*')
        .order('placa_cavalo', { ascending: true });
      
      if (veiculosData) {
        setVeiculos(veiculosData);
      }
      
      // Carregar motoristas
      const { data: motoristasData } = await supabase
        .from('Motoristas')
        .select('*')
        .order('nome', { ascending: true });
      
      if (motoristasData) {
        setMotoristas(motoristasData);
      }
      
      // Carregar proprietários
      const { data: proprietariosData } = await supabase
        .from('Proprietarios')
        .select('*')
        .order('nome', { ascending: true });
      
      if (proprietariosData) {
        setProprietarios(proprietariosData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Ocorreu um erro ao carregar os dados. Por favor, tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  const handleCidadeOrigemChange = (value: string) => {
    setCidadeOrigem(value);
    
    // Extrair o estado se a cidade estiver no formato "Cidade/UF"
    const partes = value.split('/');
    if (partes.length > 1) {
      setEstadoOrigem(partes[1].trim());
    }
  };

  const handleCidadeDestinoChange = (value: string) => {
    setCidadeDestino(value);
    
    // Extrair o estado se a cidade estiver no formato "Cidade/UF"
    const partes = value.split('/');
    if (partes.length > 1) {
      setEstadoDestino(partes[1].trim());
    }
  };

  const handleSubmit = () => {
    if (!idContrato || !dataSaida || !cidadeOrigem || !estadoOrigem || !cidadeDestino || !estadoDestino || !clienteDestino || !placaCavalo) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Se for terceirizado, proprietário é obrigatório
    if (tipo === 'terceiro' && !proprietario) {
      setError('Para veículos terceirizados, o proprietário é obrigatório.');
      return;
    }

    const contratoData: DadosContratoFormData = {
      idContrato,
      dataSaida: dataSaida.toISOString().split('T')[0],
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
    
    onSave(contratoData);
    
    if (onNext) {
      onNext();
    }
  };

  const handleNovaPlaca = (data: any) => {
    setShowNovaPlacaDialog(false);
    carregarDados();
    toast.success('Veículo cadastrado com sucesso!');
  };
  
  const handleNovoMotorista = (data: any) => {
    setShowNovoMotoristaDialog(false);
    carregarDados();
    toast.success('Motorista cadastrado com sucesso!');
  };
  
  const handleNovoProprietario = (data: any) => {
    setShowNovoProprietarioDialog(false);
    carregarDados();
    toast.success('Proprietário cadastrado com sucesso!');
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label htmlFor="idContrato">Número do Contrato</Label>
            <Input
              id="idContrato"
              value={idContrato}
              onChange={(e) => setIdContrato(e.target.value)}
              className="mt-1"
              placeholder="Número do contrato"
            />
          </div>

          <div>
            <Label htmlFor="dataSaida">Data de Saída</Label>
            <div className="mt-1">
              <DatePicker
                date={dataSaida}
                onDateChange={setDataSaida}
                placeholder="Selecione a data de saída"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidadeOrigem">Cidade de Origem</Label>
              <Input
                id="cidadeOrigem"
                value={cidadeOrigem}
                onChange={(e) => handleCidadeOrigemChange(e.target.value)}
                className="mt-1"
                placeholder="Cidade/UF"
              />
            </div>
            <div>
              <Label htmlFor="estadoOrigem">Estado de Origem</Label>
              <Select
                value={estadoOrigem}
                onValueChange={setEstadoOrigem}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estadosBrasileiros.map((estado) => (
                    <SelectItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidadeDestino">Cidade de Destino</Label>
              <Input
                id="cidadeDestino"
                value={cidadeDestino}
                onChange={(e) => handleCidadeDestinoChange(e.target.value)}
                className="mt-1"
                placeholder="Cidade/UF"
              />
            </div>
            <div>
              <Label htmlFor="estadoDestino">Estado de Destino</Label>
              <Select
                value={estadoDestino}
                onValueChange={setEstadoDestino}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estadosBrasileiros.map((estado) => (
                    <SelectItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="clienteDestino">Cliente Destinatário</Label>
            <Input
              id="clienteDestino"
              value={clienteDestino}
              onChange={(e) => setClienteDestino(e.target.value)}
              className="mt-1"
              placeholder="Nome do cliente destinatário"
            />
          </div>

          <div>
            <Label>Tipo de Frota</Label>
            <RadioGroup
              value={tipo}
              onValueChange={(value) => setTipo(value as 'frota' | 'terceiro')}
              className="flex space-x-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="frota" id="frota" />
                <Label htmlFor="frota" className="cursor-pointer">Própria</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="terceiro" id="terceiro" />
                <Label htmlFor="terceiro" className="cursor-pointer">Terceirizada</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="placaCavalo">Placa do Cavalo</Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="h-6 p-0 text-blue-600"
                  onClick={() => setShowNovaPlacaDialog(true)}
                >
                  + Novo
                </Button>
              </div>
              <Select
                value={placaCavalo}
                onValueChange={setPlacaCavalo}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione a placa" />
                </SelectTrigger>
                <SelectContent>
                  {veiculos.map((veiculo) => (
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
                className="mt-1"
                placeholder="Placa da carreta (opcional)"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between">
              <Label htmlFor="motorista">Motorista</Label>
              <Button 
                type="button" 
                variant="link" 
                className="h-6 p-0 text-blue-600"
                onClick={() => setShowNovoMotoristaDialog(true)}
              >
                + Novo
              </Button>
            </div>
            <Select
              value={motorista}
              onValueChange={setMotorista}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione o motorista" />
              </SelectTrigger>
              <SelectContent>
                {motoristas.map((mot) => (
                  <SelectItem key={mot.id} value={mot.id.toString()}>
                    {mot.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {tipo === 'terceiro' && (
            <div>
              <div className="flex justify-between">
                <Label htmlFor="proprietario">Proprietário</Label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="h-6 p-0 text-blue-600"
                  onClick={() => setShowNovoProprietarioDialog(true)}
                >
                  + Novo
                </Button>
              </div>
              <Select
                value={proprietario}
                onValueChange={setProprietario}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Selecione o proprietário" />
                </SelectTrigger>
                <SelectContent>
                  {proprietarios.map((prop) => (
                    <SelectItem key={prop.id} value={prop.nome}>
                      {prop.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
          >
            {onNext ? 'Próximo' : 'Salvar'}
          </Button>
        </CardFooter>
      </Card>

      {/* Diálogo para cadastro de nova placa */}
      <Dialog open={showNovaPlacaDialog} onOpenChange={setShowNovaPlacaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro de Novo Veículo</DialogTitle>
          </DialogHeader>
          <CadastroPlacaForm onSave={handleNovaPlaca} onCancel={() => setShowNovaPlacaDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Diálogo para cadastro de novo motorista */}
      <Dialog open={showNovoMotoristaDialog} onOpenChange={setShowNovoMotoristaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cadastro de Novo Motorista</DialogTitle>
          </DialogHeader>
          <CadastroMotoristaForm onSave={handleNovoMotorista} onCancel={() => setShowNovoMotoristaDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormularioDadosContrato;
