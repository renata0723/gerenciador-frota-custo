
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

import InfoBasicaForm from './dadosContrato/InfoBasicaForm';
import OrigemDestinoForm from './dadosContrato/OrigemDestinoForm';
import FreteVeiculosForm from './dadosContrato/FreteVeiculosForm';
import { DadosContratoFormData } from '@/types/contrato';
import { gerarNovoIdContrato, carregarPlacas, carregarMotoristas, carregarProprietarios } from './dadosContrato/utils';

interface FormularioDadosContratoProps {
  onSave: (data: DadosContratoFormData) => void;
  onNext?: () => void;
  initialData?: DadosContratoFormData;
  readOnly?: boolean;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({
  onSave,
  onNext,
  initialData,
  readOnly = false
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
  
  // Carregar opções ao iniciar
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Carregar dados 
        const placas = await carregarPlacas();
        setPlacasVeiculos(placas);
        
        const motoristasData = await carregarMotoristas();
        setMotoristas(motoristasData);
        
        const proprietariosData = await carregarProprietarios();
        setProprietarios(proprietariosData);
        
        // Se não tiver ID do contrato, gerar um novo
        if (!initialData?.idContrato && !readOnly) {
          const novoId = await gerarNovoIdContrato();
          setIdContrato(novoId);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setErro('Ocorreu um erro ao carregar os dados necessários');
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, [initialData?.idContrato, readOnly]);
  
  const handleCadastroPlacaSuccess = (data: any) => {
    setPlacaCavalo(data.placaCavalo);
    if (data.placaCarreta) setPlacaCarreta(data.placaCarreta);
    if (data.tipoFrota === 'terceiro') setTipo('terceiro');
    if (data.proprietario) setProprietario(data.proprietario);
    carregarPlacas().then(setPlacasVeiculos);
    toast.success('Veículo cadastrado com sucesso!');
  };
  
  const handleCadastroMotoristaSuccess = (data: any) => {
    setMotorista(String(data.id));
    carregarMotoristas().then(setMotoristas);
    toast.success('Motorista cadastrado com sucesso!');
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
    const formattedDate = dataSaida ? format(dataSaida, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd');
    
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
          
          <InfoBasicaForm 
            idContrato={idContrato}
            setIdContrato={setIdContrato}
            dataSaida={dataSaida}
            setDataSaida={setDataSaida}
            readOnly={readOnly}
          />
          
          <OrigemDestinoForm 
            cidadeOrigem={cidadeOrigem}
            setCidadeOrigem={setCidadeOrigem}
            estadoOrigem={estadoOrigem}
            setEstadoOrigem={setEstadoOrigem}
            cidadeDestino={cidadeDestino}
            setCidadeDestino={setCidadeDestino}
            estadoDestino={estadoDestino}
            setEstadoDestino={setEstadoDestino}
            clienteDestino={clienteDestino}
            setClienteDestino={setClienteDestino}
            readOnly={readOnly}
          />
          
          <FreteVeiculosForm 
            tipo={tipo}
            setTipo={setTipo}
            placaCavalo={placaCavalo}
            setPlacaCavalo={setPlacaCavalo}
            placaCarreta={placaCarreta}
            setPlacaCarreta={setPlacaCarreta}
            motorista={motorista}
            setMotorista={setMotorista}
            proprietario={proprietario}
            setProprietario={setProprietario}
            placasVeiculos={placasVeiculos}
            motoristas={motoristas}
            proprietarios={proprietarios}
            readOnly={readOnly}
            onCadastroPlacaSuccess={handleCadastroPlacaSuccess}
            onCadastroMotoristaSuccess={handleCadastroMotoristaSuccess}
          />
          
          {!readOnly && (
            <div className="flex justify-end space-x-2 mt-6 pt-4 border-t">
              <Button type="submit">
                {onNext ? 'Continuar' : 'Salvar Dados'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </form>
  );
};

export default FormularioDadosContrato;
