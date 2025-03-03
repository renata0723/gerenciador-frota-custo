import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Truck, User } from 'lucide-react';
import CadastroPlacaForm from './CadastroPlacaForm';
import CadastroProprietarioForm from './CadastroProprietarioForm';
import CadastroMotoristaForm from './CadastroMotoristaForm';
import { ProprietarioData } from './CadastroProprietarioForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  proprietarioInfo?: {
    nome: string;
    documento: string;
    dadosBancarios: {
      banco: string;
      agencia: string;
      conta: string;
      tipoConta: "corrente" | "poupanca";
      chavePix: string;
    };
  };
}

interface FormularioDadosContratoProps {
  onSubmit: (data: DadosContratoFormData) => void;
  onNext: () => void;
  initialData?: Partial<DadosContratoFormData>;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({
  onSubmit,
  onNext,
  initialData
}) => {
  const [formData, setFormData] = useState<DadosContratoFormData>({
    idContrato: initialData?.idContrato || '',
    dataSaida: initialData?.dataSaida || '',
    cidadeOrigem: initialData?.cidadeOrigem || '',
    estadoOrigem: initialData?.estadoOrigem || '',
    cidadeDestino: initialData?.cidadeDestino || '',
    estadoDestino: initialData?.estadoDestino || '',
    clienteDestino: initialData?.clienteDestino || '',
    tipo: initialData?.tipo || 'frota',
    placaCavalo: initialData?.placaCavalo || '',
    placaCarreta: initialData?.placaCarreta || '',
    motorista: initialData?.motorista || '',
    proprietario: initialData?.proprietario || '',
    proprietarioInfo: initialData?.proprietarioInfo
  });

  // Diálogos para cadastro
  const [dialogPlaca, setDialogPlaca] = useState(false);
  const [dialogCarreta, setDialogCarreta] = useState(false);
  const [dialogProprietario, setDialogProprietario] = useState(false);
  const [dialogMotorista, setDialogMotorista] = useState(false);
  const [proprietarios, setProprietarios] = useState<{nome: string, dados_bancarios: string}[]>([]);
  const [placasDisponiveis, setPlacasDisponiveis] = useState<{placa_cavalo: string, placa_carreta: string | null, tipo_frota: string}[]>([]);
  const [placasCarreta, setPlacasCarreta] = useState<string[]>([]);
  const [carregandoPlacas, setCarregandoPlacas] = useState(false);
  const [carregandoProprietarios, setCarregandoProprietarios] = useState(false);
  const [motoristas, setMotoristas] = useState<{nome: string, cpf: string}[]>([]);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(false);

  // Lista de estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Carregar placas, proprietários e motoristas ao iniciar
  useEffect(() => {
    carregarPlacas();
    carregarPlacasCarreta();
    carregarProprietarios();
    carregarMotoristas();
  }, []);

  // Quando o tipo de frota mudar, limpar proprietário se for frota própria
  useEffect(() => {
    if (formData.tipo === 'frota') {
      setFormData(prev => ({
        ...prev,
        proprietario: '',
        proprietarioInfo: undefined
      }));
    }
  }, [formData.tipo]);

  // Quando a placa do cavalo mudar, buscar proprietário automaticamente se for placa de terceiro
  useEffect(() => {
    if (formData.placaCavalo && formData.tipo === 'terceiro') {
      buscarProprietarioPorPlaca(formData.placaCavalo);
    }
  }, [formData.placaCavalo, formData.tipo]);

  const carregarPlacas = async () => {
    setCarregandoPlacas(true);
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('placa_cavalo, placa_carreta, tipo_frota')
        .eq('status_veiculo', 'Ativo');

      if (error) {
        console.error('Erro ao carregar placas:', error);
        toast.error('Erro ao carregar veículos disponíveis');
        return;
      }

      setPlacasDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao processar placas:', error);
    } finally {
      setCarregandoPlacas(false);
    }
  };

  const carregarPlacasCarreta = async () => {
    try {
      // Busca todas as placas de carretas distintas e não nulas
      const { data, error } = await supabase
        .from('Veiculos')
        .select('placa_carreta')
        .not('placa_carreta', 'is', null)
        .eq('status_veiculo', 'Ativo');

      if (error) {
        console.error('Erro ao carregar placas de carreta:', error);
        toast.error('Erro ao carregar placas de carreta disponíveis');
        return;
      }

      // Extrair as placas únicas
      const placasUnicas = [...new Set(data.map(item => item.placa_carreta).filter(Boolean))];
      setPlacasCarreta(placasUnicas);
    } catch (error) {
      console.error('Erro ao processar placas de carreta:', error);
    }
  };

  const carregarProprietarios = async () => {
    setCarregandoProprietarios(true);
    try {
      const { data, error } = await supabase
        .from('Proprietarios')
        .select('nome, dados_bancarios');

      if (error) {
        console.error('Erro ao carregar proprietários:', error);
        toast.error('Erro ao carregar proprietários');
        return;
      }

      setProprietarios(data || []);
    } catch (error) {
      console.error('Erro ao processar proprietários:', error);
    } finally {
      setCarregandoProprietarios(false);
    }
  };

  const carregarMotoristas = async () => {
    setCarregandoMotoristas(true);
    try {
      const { data, error } = await supabase
        .from('Motoristas')
        .select('nome, cpf')
        .eq('status', 'active');

      if (error) {
        console.error('Erro ao carregar motoristas:', error);
        toast.error('Erro ao carregar motoristas disponíveis');
        return;
      }

      setMotoristas(data || []);
    } catch (error) {
      console.error('Erro ao processar motoristas:', error);
    } finally {
      setCarregandoMotoristas(false);
    }
  };

  const buscarProprietarioPorPlaca = async (placa: string) => {
    try {
      // Primeiro, verificar se a placa é de terceiro
      const { data: veiculo, error: veiculoError } = await supabase
        .from('Veiculos')
        .select('*')
        .eq('placa_cavalo', placa)
        .single();

      if (veiculoError || !veiculo) {
        return; // Placa não encontrada ou erro
      }

      if (veiculo.tipo_frota !== 'terceiro') {
        // Se não for terceiro, não precisa buscar proprietário
        return;
      }

      // Buscar o proprietário vinculado à placa
      const { data: veiculoProprietario, error: vinculoError } = await supabase
        .from('VeiculoProprietarios')
        .select('proprietario_nome')
        .eq('placa_cavalo', placa)
        .single();

      if (vinculoError || !veiculoProprietario) {
        return; // Não há proprietário vinculado
      }

      // Agora buscar dados completos do proprietário
      const { data: proprietario, error: proprietarioError } = await supabase
        .from('Proprietarios')
        .select('*')
        .eq('nome', veiculoProprietario.proprietario_nome)
        .single();

      if (proprietarioError || !proprietario) {
        return; // Proprietário não encontrado
      }

      // Parse dos dados bancários
      let dadosBancarios;
      try {
        dadosBancarios = JSON.parse(proprietario.dados_bancarios);
      } catch (e) {
        console.error('Erro ao processar dados bancários:', e);
        dadosBancarios = {
          banco: 'Desconhecido',
          agencia: '',
          conta: '',
          tipoConta: 'corrente',
          chavePix: ''
        };
      }

      // Atualizar o formulário com as informações do proprietário
      setFormData(prev => ({
        ...prev,
        proprietario: proprietario.nome,
        proprietarioInfo: {
          nome: proprietario.nome,
          documento: '',
          dadosBancarios: {
            banco: dadosBancarios.banco,
            agencia: dadosBancarios.agencia,
            conta: dadosBancarios.conta,
            tipoConta: dadosBancarios.tipoConta,
            chavePix: dadosBancarios.chavePix || ''
          }
        }
      }));

      toast.success(`Proprietário ${proprietario.nome} vinculado automaticamente`);
    } catch (error) {
      console.error('Erro ao buscar proprietário por placa:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: keyof DadosContratoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Se selecionou uma placa, verificar e preencher a placa da carreta automaticamente
    if (field === 'placaCavalo') {
      const veiculo = placasDisponiveis.find(p => p.placa_cavalo === value);
      if (veiculo && veiculo.placa_carreta) {
        setFormData(prev => ({
          ...prev,
          placaCarreta: veiculo.placa_carreta || '',
          tipo: veiculo.tipo_frota as 'frota' | 'terceiro'
        }));
      }
    }

    // Se selecionou um proprietário, buscar seus dados completos
    if (field === 'proprietario' && value) {
      const prop = proprietarios.find(p => p.nome === value);
      if (prop) {
        try {
          const dadosBancarios = JSON.parse(prop.dados_bancarios);
          setFormData(prev => ({
            ...prev,
            proprietarioInfo: {
              nome: value,
              documento: '', // Seria preenchido com dados reais do banco
              dadosBancarios: {
                banco: dadosBancarios.banco || '',
                agencia: dadosBancarios.agencia || '',
                conta: dadosBancarios.conta || '',
                tipoConta: dadosBancarios.tipoConta || 'corrente',
                chavePix: dadosBancarios.chavePix || ''
              }
            }
          }));
        } catch (e) {
          console.error('Erro ao processar dados bancários:', e);
        }
      }
    }
  };

  const handleSavePlaca = async (data: { placaCavalo: string, placaCarreta?: string, tipoFrota: 'frota' | 'terceiro' }) => {
    setDialogPlaca(false);
    setFormData(prev => ({
      ...prev,
      placaCavalo: data.placaCavalo,
      placaCarreta: data.placaCarreta || '',
      tipo: data.tipoFrota
    }));
    await carregarPlacas();
    await carregarPlacasCarreta();
  };

  const handleSaveCarreta = async (data: { placaCavalo?: string, placaCarreta: string, tipoFrota: 'frota' | 'terceiro' }) => {
    setDialogCarreta(false);
    setFormData(prev => ({
      ...prev,
      placaCarreta: data.placaCarreta
    }));
    await carregarPlacasCarreta();
  };

  const handleSaveProprietario = async (data: ProprietarioData) => {
    setDialogProprietario(false);
    setFormData(prev => ({
      ...prev,
      proprietario: data.nome,
      proprietarioInfo: data
    }));
    await carregarProprietarios();

    // Se tiver uma placa selecionada, vincular o proprietário à placa
    if (formData.placaCavalo && formData.tipo === 'terceiro') {
      try {
        const { error } = await supabase
          .from('VeiculoProprietarios')
          .upsert({
            placa_cavalo: formData.placaCavalo,
            proprietario_nome: data.nome
          });

        if (error) {
          console.error('Erro ao vincular proprietário à placa:', error);
          toast.error('Erro ao vincular proprietário à placa');
          return;
        }

        toast.success(`Proprietário ${data.nome} vinculado à placa ${formData.placaCavalo}`);
      } catch (error) {
        console.error('Erro ao processar vínculo:', error);
      }
    }
  };

  const handleSaveMotorista = async (data: { nome: string; cpf: string }) => {
    setDialogMotorista(false);
    setFormData(prev => ({
      ...prev,
      motorista: data.nome
    }));
    await carregarMotoristas();
    toast.success(`Motorista ${data.nome} cadastrado com sucesso!`);
  };

  const handleProprietarioSelection = (nome: string, dados: any) => {
    setFormData(prev => ({
      ...prev,
      proprietario: nome,
      proprietarioInfo: {
        nome: nome,
        documento: dados.documento || '',
        dadosBancarios: {
          banco: dados.dados_bancarios ? JSON.parse(dados.dados_bancarios).banco || '' : '',
          agencia: dados.dados_bancarios ? JSON.parse(dados.dados_bancarios).agencia || '' : '',
          conta: dados.dados_bancarios ? JSON.parse(dados.dados_bancarios).conta || '' : '',
          tipoConta: dados.dados_bancarios ? JSON.parse(dados.dados_bancarios).tipoConta || 'corrente' : 'corrente',
          chavePix: dados.dados_bancarios ? JSON.parse(dados.dados_bancarios).pix || '' : '',
        }
      }
    }));
  };

  const handleAddNewProprietario = (novoProprietario: any) => {
    setFormData(prev => ({
      ...prev,
      proprietario: novoProprietario.nome,
      proprietarioInfo: {
        nome: novoProprietario.nome,
        documento: novoProprietario.documento || '',
        dadosBancarios: {
          banco: novoProprietario.banco || '',
          agencia: novoProprietario.agencia || '',
          conta: novoProprietario.conta || '',
          tipoConta: novoProprietario.tipoConta || 'corrente',
          chavePix: novoProprietario.pix || '',
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.idContrato) {
      toast.error('O número do contrato é obrigatório');
      return;
    }
    
    if (!formData.dataSaida) {
      toast.error('A data de saída é obrigatória');
      return;
    }
    
    if (!formData.cidadeOrigem || !formData.estadoOrigem) {
      toast.error('Origem completa é obrigatória');
      return;
    }
    
    if (!formData.cidadeDestino || !formData.estadoDestino) {
      toast.error('Destino completo é obrigatório');
      return;
    }
    
    if (!formData.placaCavalo) {
      toast.error('A placa do cavalo é obrigatória');
      return;
    }
    
    if (!formData.motorista) {
      toast.error('O motorista é obrigatório');
      return;
    }

    // Se for terceiro, proprietário é obrigatório
    if (formData.tipo === 'terceiro' && !formData.proprietario) {
      toast.error('Para frota terceirizada, o proprietário é obrigatório');
      return;
    }
    
    onSubmit(formData);
    onNext();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Dados do Contrato</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="idContrato">Número do Contrato *</Label>
          <Input
            id="idContrato"
            name="idContrato"
            value={formData.idContrato}
            onChange={handleChange}
            placeholder="Número gerado pelo setor de operação"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataSaida">Data de Saída *</Label>
            <Input
              id="dataSaida"
              name="dataSaida"
              type="date"
              value={formData.dataSaida}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidadeOrigem">Cidade de Origem *</Label>
              <Input
                id="cidadeOrigem"
                name="cidadeOrigem"
                value={formData.cidadeOrigem}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estadoOrigem">Estado *</Label>
              <Select 
                value={formData.estadoOrigem} 
                onValueChange={(value) => handleSelectChange('estadoOrigem', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidadeDestino">Cidade de Destino *</Label>
              <Input
                id="cidadeDestino"
                name="cidadeDestino"
                value={formData.cidadeDestino}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estadoDestino">Estado *</Label>
              <Select 
                value={formData.estadoDestino} 
                onValueChange={(value) => handleSelectChange('estadoDestino', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="clienteDestino">Cliente Destino *</Label>
            <Input
              id="clienteDestino"
              name="clienteDestino"
              value={formData.clienteDestino}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tipo">Tipo *</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleSelectChange('tipo', value as 'frota' | 'terceiro')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frota">Frota</SelectItem>
                <SelectItem value="terceiro">Terceiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="placaCavalo" className="flex justify-between">
              <span>Placa do Cavalo *</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => setDialogPlaca(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Cadastrar
              </Button>
            </Label>
            <div className="flex space-x-2">
              <Select 
                value={formData.placaCavalo} 
                onValueChange={(value) => handleSelectChange('placaCavalo', value)}
                disabled={carregandoPlacas}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={carregandoPlacas ? "Carregando..." : "Selecione a placa"} />
                </SelectTrigger>
                <SelectContent>
                  {placasDisponiveis.map(placa => (
                    <SelectItem key={placa.placa_cavalo} value={placa.placa_cavalo}>
                      {placa.placa_cavalo} ({placa.tipo_frota === 'frota' ? 'Própria' : 'Terceiro'})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={carregarPlacas}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="placaCarreta" className="flex justify-between">
              <span>Placa da Carreta</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => setDialogCarreta(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Cadastrar
              </Button>
            </Label>
            <div className="flex space-x-2">
              <Select 
                value={formData.placaCarreta} 
                onValueChange={(value) => handleSelectChange('placaCarreta', value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione a placa da carreta" />
                </SelectTrigger>
                <SelectContent>
                  {placasCarreta.map(placa => (
                    <SelectItem key={placa} value={placa}>
                      {placa}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={carregarPlacasCarreta}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="motorista" className="flex justify-between">
              <span>Motorista *</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => setDialogMotorista(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Cadastrar
              </Button>
            </Label>
            <div className="flex space-x-2">
              <Select 
                value={formData.motorista} 
                onValueChange={(value) => handleSelectChange('motorista', value)}
                disabled={carregandoMotoristas}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={carregandoMotoristas ? "Carregando..." : "Selecione o motorista"} />
                </SelectTrigger>
                <SelectContent>
                  {motoristas.map(m => (
                    <SelectItem key={m.nome} value={m.nome}>{m.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={carregarMotoristas}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="proprietario" className="flex justify-between">
              <span>Proprietário *</span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="h-6 px-2 text-xs"
                onClick={() => setDialogProprietario(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Cadastrar
              </Button>
            </Label>
            <div className="flex space-x-2">
              <Select 
                value={formData.proprietario} 
                onValueChange={(value) => handleSelectChange('proprietario', value)}
                disabled={carregandoProprietarios}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={carregandoProprietarios ? "Carregando..." : "Selecione o proprietário"} />
                </SelectTrigger>
                <SelectContent>
                  {proprietarios.map(prop => (
                    <SelectItem key={prop.nome} value={prop.nome}>{prop.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={carregarProprietarios}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            Próximo
          </Button>
        </div>
      </form>

      <Dialog open={dialogPlaca} onOpenChange={setDialogPlaca}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Cadastrar Novo Cavalo
            </DialogTitle>
          </DialogHeader>
          <CadastroPlacaForm
            onSave={handleSavePlaca}
            onCancel={() => setDialogPlaca(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogCarreta} onOpenChange={setDialogCarreta}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Truck className="mr-2 h-5 w-5" />
              Cadastrar Nova Carreta
            </DialogTitle>
          </DialogHeader>
          <CadastroPlacaForm
            onSave={handleSaveCarreta}
            onCancel={() => setDialogCarreta(false)}
            isCarreta={true}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogProprietario} onOpenChange={setDialogProprietario}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Cadastrar Novo Proprietário
            </DialogTitle>
          </DialogHeader>
          <CadastroProprietarioForm
            onSave={handleSaveProprietario}
            onCancel={() => setDialogProprietario(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={dialogMotorista} onOpenChange={setDialogMotorista}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Cadastrar Novo Motorista
            </DialogTitle>
          </DialogHeader>
          <CadastroMotoristaForm
            onSave={handleSaveMotorista}
            onCancel={() => setDialogMotorista(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormularioDadosContrato;
