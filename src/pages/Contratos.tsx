
import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, MoreHorizontal, Search, Filter, Download, 
  Truck, FileCheck, User, Calendar, MapPin, Clipboard, 
  DollarSign, FileSpreadsheet, CheckCircle, Clock, AlertCircle,
  X, Save, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { logOperation } from '@/utils/logOperations';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Manifesto {
  id: string;
  numero: string;
}

interface CTE {
  id: string;
  numero: string;
}

interface NotaFiscal {
  id: string;
  numero: string;
}

interface RejeicaoContrato {
  data: string;
  motivo: string;
  responsavel: string;
}

export interface Contract {
  id: string;
  tipo: 'Frota' | 'Terceiro';
  dataSaida: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  cliente: string;
  placaCavalo: string;
  placaCarreta: string;
  motorista: string;
  proprietario: string;
  manifestos: Manifesto[];
  ctes: CTE[];
  valorFrete: string;
  valorCarga: string;
  notasFiscais: NotaFiscal[];
  valorFreteTerceiro?: string;
  valorAdiantamento?: string;
  valorPedagio?: string;
  saldoPagar?: string;
  responsavelEntrega?: string;
  dataEntrega?: string;
  observacoes?: string;
  status: 'Em andamento' | 'Concluído' | 'Aguardando canhoto' | 'Cancelado' | 'Rejeitado' | 'Correção pendente';
  rejeicao?: RejeicaoContrato;
}

const Contratos = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  const [activeContract, setActiveContract] = useState<Contract | null>(null);
  const [formTab, setFormTab] = useState('dados');
  
  // Estados para o formulário
  const [newContract, setNewContract] = useState<Omit<Contract, 'id'>>({
    tipo: 'Frota',
    dataSaida: format(new Date(), 'yyyy-MM-dd'),
    cidadeOrigem: '',
    estadoOrigem: '',
    cidadeDestino: '',
    estadoDestino: '',
    cliente: '',
    placaCavalo: '',
    placaCarreta: '',
    motorista: '',
    proprietario: '',
    manifestos: [],
    ctes: [],
    valorFrete: '',
    valorCarga: '',
    notasFiscais: [],
    status: 'Em andamento'
  });

  // Estados para os campos temporários
  const [novoManifesto, setNovoManifesto] = useState('');
  const [novoCte, setNovoCte] = useState('');
  const [novaNotaFiscal, setNovaNotaFiscal] = useState('');
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  
  // Validação de campos duplicados
  const [manifestoDuplicado, setManifestoDuplicado] = useState(false);
  const [cteDuplicado, setCteDuplicado] = useState(false);
  const [notaFiscalDuplicada, setNotaFiscalDuplicada] = useState(false);

  // Estados para erros de validação
  const [erros, setErros] = useState<Record<string, string>>({});

  // Dados simulados
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const savedContracts = localStorage.getItem('contratos');
    return savedContracts ? JSON.parse(savedContracts) : [
      {
        id: 'CT-001',
        tipo: 'Frota',
        dataSaida: '2023-06-15',
        cidadeOrigem: 'São Paulo',
        estadoOrigem: 'SP',
        cidadeDestino: 'Rio de Janeiro',
        estadoDestino: 'RJ',
        cliente: 'Indústrias XYZ Ltda',
        placaCavalo: 'ABC1234',
        placaCarreta: 'XYZ5678',
        motorista: 'João Silva',
        proprietario: 'LogiFrota S.A.',
        manifestos: [{ id: '1', numero: 'MF-12345' }],
        ctes: [{ id: '1', numero: 'CT-98765' }],
        valorFrete: 'R$ 3.500,00',
        valorCarga: 'R$ 120.000,00',
        notasFiscais: [{ id: '1', numero: 'NF-123456' }, { id: '2', numero: 'NF-123457' }],
        status: 'Em andamento'
      },
      {
        id: 'CT-002',
        tipo: 'Terceiro',
        dataSaida: '2023-06-10',
        cidadeOrigem: 'Curitiba',
        estadoOrigem: 'PR',
        cidadeDestino: 'Florianópolis',
        estadoDestino: 'SC',
        cliente: 'Distribuidora ABC',
        placaCavalo: 'DEF5678',
        placaCarreta: 'GHI9012',
        motorista: 'Pedro Alves',
        proprietario: 'Transportes Rápidos Ltda',
        manifestos: [{ id: '2', numero: 'MF-54321' }],
        ctes: [{ id: '2', numero: 'CT-12345' }],
        valorFrete: 'R$ 2.800,00',
        valorCarga: 'R$ 85.000,00',
        notasFiscais: [{ id: '3', numero: 'NF-654321' }],
        valorFreteTerceiro: 'R$ 2.300,00',
        valorAdiantamento: 'R$ 1.000,00',
        valorPedagio: 'R$ 150,00',
        saldoPagar: 'R$ 1.150,00',
        responsavelEntrega: 'Maria Santos',
        dataEntrega: '2023-06-20',
        observacoes: 'Entrega realizada sem atrasos',
        status: 'Concluído'
      },
      {
        id: 'CT-003',
        tipo: 'Frota',
        dataSaida: '2023-06-18',
        cidadeOrigem: 'Salvador',
        estadoOrigem: 'BA',
        cidadeDestino: 'Recife',
        estadoDestino: 'PE',
        cliente: 'Supermercados Norte',
        placaCavalo: 'JKL3456',
        placaCarreta: 'MNO7890',
        motorista: 'Carlos Ferreira',
        proprietario: 'LogiFrota S.A.',
        manifestos: [{ id: '3', numero: 'MF-67890' }],
        ctes: [{ id: '3', numero: 'CT-54321' }],
        valorFrete: 'R$ 4.200,00',
        valorCarga: 'R$ 160.000,00',
        notasFiscais: [{ id: '4', numero: 'NF-987654' }, { id: '5', numero: 'NF-987655' }, { id: '6', numero: 'NF-987656' }],
        responsavelEntrega: 'José Oliveira',
        dataEntrega: '2023-06-25',
        status: 'Aguardando canhoto'
      }
    ];
  });

  // Salvar no localStorage quando os contratos mudarem
  useEffect(() => {
    localStorage.setItem('contratos', JSON.stringify(contracts));
  }, [contracts]);

  // Funções
  const handleAddContract = () => {
    resetForm();
    setShowAddDialog(true);
    logOperation('Abrir formulário', 'Formulário de novo contrato aberto', true);
  };

  const resetForm = () => {
    setNewContract({
      tipo: 'Frota',
      dataSaida: format(new Date(), 'yyyy-MM-dd'),
      cidadeOrigem: '',
      estadoOrigem: '',
      cidadeDestino: '',
      estadoDestino: '',
      cliente: '',
      placaCavalo: '',
      placaCarreta: '',
      motorista: '',
      proprietario: '',
      manifestos: [],
      ctes: [],
      valorFrete: '',
      valorCarga: '',
      notasFiscais: [],
      status: 'Em andamento'
    });
    setNovoManifesto('');
    setNovoCte('');
    setNovaNotaFiscal('');
    setErros({});
    setFormTab('dados');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewContract = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      setActiveContract(contract);
      setShowAddDialog(true);
      setFormTab('dados');
    }
    logOperation('Visualizar Contrato', `Contrato ID: ${contractId}`, true);
  };

  const handleExportContracts = () => {
    logOperation('Exportar Contratos', 'Iniciada exportação de contratos', true);
    toast.success('Contratos exportados com sucesso');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Em andamento':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Concluído':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Aguardando canhoto':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Cancelado':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'Rejeitado':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      case 'Correção pendente':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  // Validação do formulário
  const validarFormulario = () => {
    const erros: Record<string, string> = {};
    
    if (!newContract.cidadeOrigem) erros.cidadeOrigem = 'Cidade de origem é obrigatória';
    if (!newContract.estadoOrigem) erros.estadoOrigem = 'Estado de origem é obrigatório';
    if (!newContract.cidadeDestino) erros.cidadeDestino = 'Cidade de destino é obrigatória';
    if (!newContract.estadoDestino) erros.estadoDestino = 'Estado de destino é obrigatório';
    if (!newContract.cliente) erros.cliente = 'Cliente é obrigatório';
    if (!newContract.placaCavalo) erros.placaCavalo = 'Placa do cavalo é obrigatória';
    if (!newContract.placaCarreta) erros.placaCarreta = 'Placa da carreta é obrigatória';
    if (!newContract.motorista) erros.motorista = 'Motorista é obrigatório';
    if (!newContract.proprietario) erros.proprietario = 'Proprietário é obrigatório';
    if (!newContract.valorFrete) erros.valorFrete = 'Valor do frete é obrigatório';
    if (!newContract.valorCarga) erros.valorCarga = 'Valor da carga é obrigatório';
    
    if (newContract.tipo === 'Terceiro') {
      if (!newContract.valorFreteTerceiro) erros.valorFreteTerceiro = 'Valor do frete do terceiro é obrigatório';
    }
    
    setErros(erros);
    return Object.keys(erros).length === 0;
  };

  // Adicionar novo manifesto
  const adicionarManifesto = () => {
    if (!novoManifesto.trim()) {
      toast.error('Número do manifesto não pode estar vazio');
      return;
    }
    
    // Verificar duplicidade
    const manifestoExistente = newContract.manifestos.some(m => m.numero === novoManifesto);
    if (manifestoExistente) {
      setManifestoDuplicado(true);
      toast.error('Este número de manifesto já foi adicionado');
      return;
    }
    
    setManifestoDuplicado(false);
    const id = Date.now().toString();
    setNewContract({
      ...newContract,
      manifestos: [...newContract.manifestos, { id, numero: novoManifesto }]
    });
    setNovoManifesto('');
  };

  // Remover manifesto
  const removerManifesto = (id: string) => {
    setNewContract({
      ...newContract,
      manifestos: newContract.manifestos.filter(m => m.id !== id)
    });
  };

  // Adicionar novo CTE
  const adicionarCte = () => {
    if (!novoCte.trim()) {
      toast.error('Número do CTE não pode estar vazio');
      return;
    }
    
    // Verificar duplicidade
    const cteExistente = newContract.ctes.some(c => c.numero === novoCte);
    if (cteExistente) {
      setCteDuplicado(true);
      toast.error('Este número de CTE já foi adicionado');
      return;
    }
    
    setCteDuplicado(false);
    const id = Date.now().toString();
    setNewContract({
      ...newContract,
      ctes: [...newContract.ctes, { id, numero: novoCte }]
    });
    setNovoCte('');
  };

  // Remover CTE
  const removerCte = (id: string) => {
    setNewContract({
      ...newContract,
      ctes: newContract.ctes.filter(c => c.id !== id)
    });
  };

  // Adicionar nova nota fiscal
  const adicionarNotaFiscal = () => {
    if (!novaNotaFiscal.trim()) {
      toast.error('Número da nota fiscal não pode estar vazio');
      return;
    }
    
    // Verificar duplicidade
    const notaExistente = newContract.notasFiscais.some(n => n.numero === novaNotaFiscal);
    if (notaExistente) {
      setNotaFiscalDuplicada(true);
      toast.error('Esta nota fiscal já foi adicionada');
      return;
    }
    
    setNotaFiscalDuplicada(false);
    const id = Date.now().toString();
    setNewContract({
      ...newContract,
      notasFiscais: [...newContract.notasFiscais, { id, numero: novaNotaFiscal }]
    });
    setNovaNotaFiscal('');
  };

  // Remover nota fiscal
  const removerNotaFiscal = (id: string) => {
    setNewContract({
      ...newContract,
      notasFiscais: newContract.notasFiscais.filter(n => n.id !== id)
    });
  };

  // Salvar contrato
  const salvarContrato = () => {
    if (!validarFormulario()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    
    // Calcular saldo a pagar para terceiros
    if (newContract.tipo === 'Terceiro') {
      const valorFrete = parseFloat(newContract.valorFreteTerceiro || '0');
      const valorAdiantamento = parseFloat(newContract.valorAdiantamento || '0');
      const valorPedagio = parseFloat(newContract.valorPedagio || '0');
      const saldo = valorFrete - valorAdiantamento - valorPedagio;
      
      newContract.saldoPagar = saldo.toFixed(2);
    }
    
    if (activeContract) {
      // Editar contrato existente
      const updatedContracts = contracts.map(c => 
        c.id === activeContract.id ? { ...newContract, id: activeContract.id } : c
      );
      setContracts(updatedContracts);
      toast.success('Contrato atualizado com sucesso');
      logOperation('Atualizar Contrato', `Contrato ID: ${activeContract.id}`, true);
    } else {
      // Adicionar novo contrato
      const newId = `CT-${(contracts.length + 1).toString().padStart(3, '0')}`;
      const contractToAdd = { ...newContract, id: newId };
      setContracts([...contracts, contractToAdd]);
      toast.success('Contrato adicionado com sucesso');
      logOperation('Adicionar Contrato', `Contrato ID: ${newId}`, true);
    }
    
    setShowAddDialog(false);
    setActiveContract(null);
    resetForm();
  };

  // Rejeitar contrato
  const rejeitarContrato = () => {
    if (!activeContract) return;
    
    if (!motivoRejeicao.trim()) {
      toast.error('Informe o motivo da rejeição');
      return;
    }
    
    const updatedContracts = contracts.map(c => {
      if (c.id === activeContract.id) {
        return {
          ...c,
          status: 'Rejeitado',
          rejeicao: {
            data: format(new Date(), 'yyyy-MM-dd'),
            motivo: motivoRejeicao,
            responsavel: 'Controladoria'
          }
        };
      }
      return c;
    });
    
    setContracts(updatedContracts);
    setShowRejectDialog(false);
    setShowAddDialog(false);
    setMotivoRejeicao('');
    toast.success('Contrato rejeitado com sucesso');
    logOperation('Rejeitar Contrato', `Contrato ID: ${activeContract.id}`, true);
  };

  // Enviar para correção
  const enviarParaCorrecao = () => {
    if (!activeContract) return;
    
    const updatedContracts = contracts.map(c => {
      if (c.id === activeContract.id) {
        return {
          ...c,
          status: 'Correção pendente'
        };
      }
      return c;
    });
    
    setContracts(updatedContracts);
    setShowAddDialog(false);
    toast.success('Contrato enviado para correção');
    logOperation('Enviar para Correção', `Contrato ID: ${activeContract.id}`, true);
  };

  // Finalizar contrato
  const finalizarContrato = () => {
    if (!activeContract) return;
    
    const updatedContracts = contracts.map(c => {
      if (c.id === activeContract.id) {
        return {
          ...c,
          status: 'Concluído',
          dataEntrega: format(new Date(), 'yyyy-MM-dd'),
          responsavelEntrega: 'Controladoria'
        };
      }
      return c;
    });
    
    setContracts(updatedContracts);
    setShowAddDialog(false);
    toast.success('Contrato finalizado com sucesso');
    logOperation('Finalizar Contrato', `Contrato ID: ${activeContract.id}`, true);
  };

  // Aguardar canhoto
  const aguardarCanhoto = () => {
    if (!activeContract) return;
    
    const updatedContracts = contracts.map(c => {
      if (c.id === activeContract.id) {
        return {
          ...c,
          status: 'Aguardando canhoto'
        };
      }
      return c;
    });
    
    setContracts(updatedContracts);
    setShowAddDialog(false);
    toast.success('Contrato marcado como aguardando canhoto');
    logOperation('Aguardar Canhoto', `Contrato ID: ${activeContract.id}`, true);
  };

  // Excluir contrato
  const excluirContrato = (id: string) => {
    const updatedContracts = contracts.filter(c => c.id !== id);
    setContracts(updatedContracts);
    toast.success('Contrato excluído com sucesso');
    logOperation('Excluir Contrato', `Contrato ID: ${id}`, true);
  };

  // Filtrar contratos com base na busca e aba selecionada
  const filteredContracts = contracts
    .filter(contract => 
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.placaCavalo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(contract => {
      if (activeTab === 'todos') return true;
      return contract.status.toLowerCase() === activeTab.toLowerCase();
    });

  // Estatísticas
  const stats = {
    total: contracts.length,
    emAndamento: contracts.filter(c => c.status === 'Em andamento').length,
    concluidos: contracts.filter(c => c.status === 'Concluído').length,
    aguardandoCanhoto: contracts.filter(c => c.status === 'Aguardando canhoto').length,
    rejeitados: contracts.filter(c => c.status === 'Rejeitado' || c.status === 'Correção pendente').length,
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Contratos" 
        description="Gerenciamento de contratos de frete e cargas"
        icon={<FileText size={28} className="text-sistema-primary" />}
      />

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-5 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
            <div className="p-2 bg-sistema-primary/10 rounded-full">
              <FileText className="h-5 w-5 text-sistema-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Em andamento</p>
              <h3 className="text-2xl font-bold">{stats.emAndamento}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Concluídos</p>
              <h3 className="text-2xl font-bold">{stats.concluidos}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aguardando canhoto</p>
              <h3 className="text-2xl font-bold">{stats.aguardandoCanhoto}</h3>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rejeitados</p>
              <h3 className="text-2xl font-bold">{stats.rejeitados}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <ThumbsDown className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de ações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar contratos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={16} />
              <span className="hidden md:inline">Filtrar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportContracts}>
              <Download size={16} />
              <span className="hidden md:inline">Exportar</span>
            </Button>
            
            <Button variant="default" size="sm" className="ml-auto flex items-center gap-1" onClick={handleAddContract}>
              <Plus size={16} />
              <span>Novo Contrato</span>
            </Button>
          </div>
        </div>
        
        {/* Abas de status */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'todos' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('todos')}
          >
            Todos
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'Em andamento' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Em andamento')}
          >
            Em andamento
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'Concluído' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Concluído')}
          >
            Concluídos
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'Aguardando canhoto' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Aguardando canhoto')}
          >
            Aguardando canhoto
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'Rejeitado' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Rejeitado')}
          >
            Rejeitados
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'Correção pendente' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Correção pendente')}
          >
            Correção pendente
          </button>
        </div>
      </div>
      
      {/* Tabela de contratos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Contrato</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Saída</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Origem/Destino</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Frete</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredContracts.length > 0 ? (
                filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{contract.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contract.tipo === 'Frota' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                          {contract.tipo}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(contract.dataSaida), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contract.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contract.cidadeOrigem}/{contract.estadoOrigem} → {contract.cidadeDestino}/{contract.estadoDestino}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contract.motorista}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {contract.valorFrete}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewContract(contract.id)}>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setActiveContract(contract);
                            setNewContract({
                              ...contract,
                            });
                            setShowAddDialog(true);
                          }}>Editar</DropdownMenuItem>
                          {contract.status === 'Em andamento' && (
                            <>
                              <DropdownMenuItem onClick={() => {
                                setActiveContract(contract);
                                aguardarCanhoto();
                              }}>Marcar como aguardando canhoto</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setActiveContract(contract);
                                finalizarContrato();
                              }}>Finalizar contrato</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setActiveContract(contract);
                                setShowRejectDialog(true);
                              }} className="text-red-600">Rejeitar contrato</DropdownMenuItem>
                            </>
                          )}
                          {contract.status === 'Rejeitado' && (
                            <DropdownMenuItem onClick={() => {
                              setActiveContract(contract);
                              enviarParaCorrecao();
                            }}>Enviar para correção</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600" onClick={() => excluirContrato(contract.id)}>
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <FileText size={32} className="text-gray-400" />
                      <p>Nenhum contrato encontrado</p>
                      {searchTerm && (
                        <Button variant="link" onClick={() => setSearchTerm('')}>
                          Limpar busca
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium">{filteredContracts.length}</span> de <span className="font-medium">{contracts.length}</span> contratos
          </p>
          
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-sistema-primary text-white hover:bg-sistema-primary/90">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Próxima</Button>
          </div>
        </div>
      </div>

      {/* Modal/Dialog para Adicionar Novo Contrato ou Editar Existente */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{activeContract ? `Detalhes do Contrato ${activeContract.id}` : 'Adicionar Novo Contrato'}</DialogTitle>
            <DialogDescription>
              {activeContract ? 'Visualize ou edite os dados do contrato.' : 'Preencha os dados do contrato. Clique em salvar quando finalizar.'}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={formTab} onValueChange={setFormTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="dados">Dados do Contrato</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="valores">Valores</TabsTrigger>
              <TabsTrigger value="observacoes">Observações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dados">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select 
                    value={newContract.tipo} 
                    onValueChange={(value) => 
                      setNewContract({
                        ...newContract, 
                        tipo: value as 'Frota' | 'Terceiro'
                      })
                    }
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frota">Frota</SelectItem>
                      <SelectItem value="Terceiro">Terceiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataSaida">Data Saída</Label>
                  <Input 
                    type="date" 
                    id="dataSaida" 
                    value={newContract.dataSaida}
                    onChange={(e) => setNewContract({...newContract, dataSaida: e.target.value})}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidadeOrigem">Cidade Origem</Label>
                  <Input 
                    id="cidadeOrigem" 
                    placeholder="Cidade" 
                    value={newContract.cidadeOrigem}
                    onChange={(e) => setNewContract({...newContract, cidadeOrigem: e.target.value})}
                    className={erros.cidadeOrigem ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.cidadeOrigem && (
                    <p className="text-red-500 text-xs mt-1">{erros.cidadeOrigem}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoOrigem">Estado Origem</Label>
                  <Input 
                    id="estadoOrigem" 
                    placeholder="UF" 
                    maxLength={2}
                    value={newContract.estadoOrigem}
                    onChange={(e) => setNewContract({...newContract, estadoOrigem: e.target.value.toUpperCase()})}
                    className={erros.estadoOrigem ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.estadoOrigem && (
                    <p className="text-red-500 text-xs mt-1">{erros.estadoOrigem}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidadeDestino">Cidade Destino</Label>
                  <Input 
                    id="cidadeDestino" 
                    placeholder="Cidade" 
                    value={newContract.cidadeDestino}
                    onChange={(e) => setNewContract({...newContract, cidadeDestino: e.target.value})}
                    className={erros.cidadeDestino ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.cidadeDestino && (
                    <p className="text-red-500 text-xs mt-1">{erros.cidadeDestino}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estadoDestino">Estado Destino</Label>
                  <Input 
                    id="estadoDestino" 
                    placeholder="UF" 
                    maxLength={2}
                    value={newContract.estadoDestino}
                    onChange={(e) => setNewContract({...newContract, estadoDestino: e.target.value.toUpperCase()})}
                    className={erros.estadoDestino ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.estadoDestino && (
                    <p className="text-red-500 text-xs mt-1">{erros.estadoDestino}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Input 
                  id="cliente" 
                  placeholder="Nome do cliente" 
                  value={newContract.cliente}
                  onChange={(e) => setNewContract({...newContract, cliente: e.target.value})}
                  className={erros.cliente ? "border-red-500" : ""}
                  disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                />
                {erros.cliente && (
                  <p className="text-red-500 text-xs mt-1">{erros.cliente}</p>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="placaCavalo">Placa do Cavalo</Label>
                  <Input 
                    id="placaCavalo" 
                    placeholder="ABC1234" 
                    value={newContract.placaCavalo}
                    onChange={(e) => setNewContract({...newContract, placaCavalo: e.target.value.toUpperCase()})}
                    className={erros.placaCavalo ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.placaCavalo && (
                    <p className="text-red-500 text-xs mt-1">{erros.placaCavalo}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="placaCarreta">Placa da Carreta</Label>
                  <Input 
                    id="placaCarreta" 
                    placeholder="XYZ5678" 
                    value={newContract.placaCarreta}
                    onChange={(e) => setNewContract({...newContract, placaCarreta: e.target.value.toUpperCase()})}
                    className={erros.placaCarreta ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.placaCarreta && (
                    <p className="text-red-500 text-xs mt-1">{erros.placaCarreta}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="motorista">Motorista</Label>
                  <Input 
                    id="motorista" 
                    placeholder="Nome do motorista" 
                    value={newContract.motorista}
                    onChange={(e) => setNewContract({...newContract, motorista: e.target.value})}
                    className={erros.motorista ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.motorista && (
                    <p className="text-red-500 text-xs mt-1">{erros.motorista}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proprietario">Proprietário</Label>
                  <Input 
                    id="proprietario" 
                    placeholder="Nome do proprietário" 
                    value={newContract.proprietario}
                    onChange={(e) => setNewContract({...newContract, proprietario: e.target.value})}
                    className={erros.proprietario ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.proprietario && (
                    <p className="text-red-500 text-xs mt-1">{erros.proprietario}</p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documentos">
              <div className="space-y-4">
                {/* Manifestos */}
                <div className="space-y-2">
                  <Label htmlFor="manifesto" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número do Manifesto
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="manifesto" 
                      placeholder="MF-00000" 
                      value={novoManifesto}
                      onChange={(e) => {
                        setNovoManifesto(e.target.value);
                        setManifestoDuplicado(false);
                      }}
                      className={manifestoDuplicado ? "border-red-500" : ""}
                      disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={adicionarManifesto}
                      disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                    >
                      + Adicionar
                    </Button>
                  </div>
                  {manifestoDuplicado && (
                    <p className="text-red-500 text-xs">Este manifesto já foi adicionado</p>
                  )}
                </div>
                
                {/* Lista de Manifestos */}
                {newContract.manifestos.length > 0 && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Manifestos Adicionados
                    </Label>
                    <div className="border rounded-md divide-y">
                      {newContract.manifestos.map((manifesto) => (
                        <div key={manifesto.id} className="flex items-center justify-between p-2">
                          <span>{manifesto.numero}</span>
                          {(activeContract?.status !== 'Concluído' && activeContract?.status !== 'Aguardando canhoto') && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => removerManifesto(manifesto.id)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* CTEs */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="cte" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número do CTe
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="cte" 
                      placeholder="CT-00000" 
                      value={novoCte}
                      onChange={(e) => {
                        setNovoCte(e.target.value);
                        setCteDuplicado(false);
                      }}
                      className={cteDuplicado ? "border-red-500" : ""}
                      disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={adicionarCte}
                      disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                    >
                      + Adicionar
                    </Button>
                  </div>
                  {cteDuplicado && (
                    <p className="text-red-500 text-xs">Este CTe já foi adicionado</p>
                  )}
                </div>
                
                {/* Lista de CTEs */}
                {newContract.ctes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      CTes Adicionados
                    </Label>
                    <div className="border rounded-md divide-y">
                      {newContract.ctes.map((cte) => (
                        <div key={cte.id} className="flex items-center justify-between p-2">
                          <span>{cte.numero}</span>
                          {(activeContract?.status !== 'Concluído' && activeContract?.status !== 'Aguardando canhoto') && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => removerCte(cte.id)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Notas Fiscais */}
                <div className="space-y-2 mt-6">
                  <Label htmlFor="notaFiscal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Número da Nota Fiscal
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="notaFiscal" 
                      placeholder="NF-00000" 
                      value={novaNotaFiscal}
                      onChange={(e) => {
                        setNovaNotaFiscal(e.target.value);
                        setNotaFiscalDuplicada(false);
                      }}
                      className={notaFiscalDuplicada ? "border-red-500" : ""}
                      disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={adicionarNotaFiscal}
                      disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                    >
                      + Adicionar
                    </Button>
                  </div>
                  {notaFiscalDuplicada && (
                    <p className="text-red-500 text-xs">Esta nota fiscal já foi adicionada</p>
                  )}
                </div>
                
                {/* Lista de Notas Fiscais */}
                {newContract.notasFiscais.length > 0 && (
                  <div className="space-y-2">
                    <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notas Fiscais Adicionadas
                    </Label>
                    <div className="border rounded-md divide-y">
                      {newContract.notasFiscais.map((nota) => (
                        <div key={nota.id} className="flex items-center justify-between p-2">
                          <span>{nota.numero}</span>
                          {(activeContract?.status !== 'Concluído' && activeContract?.status !== 'Aguardando canhoto') && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500"
                              onClick={() => removerNotaFiscal(nota.id)}
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="valores">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="valorFrete">Valor do Frete (Receita)</Label>
                  <Input 
                    id="valorFrete" 
                    placeholder="R$ 0,00" 
                    value={newContract.valorFrete}
                    onChange={(e) => setNewContract({...newContract, valorFrete: e.target.value})}
                    className={erros.valorFrete ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.valorFrete && (
                    <p className="text-red-500 text-xs mt-1">{erros.valorFrete}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valorCarga">Valor da Carga</Label>
                  <Input 
                    id="valorCarga" 
                    placeholder="R$ 0,00" 
                    value={newContract.valorCarga}
                    onChange={(e) => setNewContract({...newContract, valorCarga: e.target.value})}
                    className={erros.valorCarga ? "border-red-500" : ""}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                  {erros.valorCarga && (
                    <p className="text-red-500 text-xs mt-1">{erros.valorCarga}</p>
                  )}
                </div>
              </div>
              
              {/* Valores específicos para Terceiros */}
              {newContract.tipo === 'Terceiro' && (
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorFreteTerceiro">Valor do Frete Contratado</Label>
                      <Input 
                        id="valorFreteTerceiro" 
                        placeholder="R$ 0,00" 
                        value={newContract.valorFreteTerceiro || ''}
                        onChange={(e) => setNewContract({...newContract, valorFreteTerceiro: e.target.value})}
                        className={erros.valorFreteTerceiro ? "border-red-500" : ""}
                        disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                      />
                      {erros.valorFreteTerceiro && (
                        <p className="text-red-500 text-xs mt-1">{erros.valorFreteTerceiro}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorAdiantamento">Valor Adiantamento</Label>
                      <Input 
                        id="valorAdiantamento" 
                        placeholder="R$ 0,00" 
                        value={newContract.valorAdiantamento || ''}
                        onChange={(e) => setNewContract({...newContract, valorAdiantamento: e.target.value})}
                        disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valorPedagio">Valor Pedágio</Label>
                      <Input 
                        id="valorPedagio" 
                        placeholder="R$ 0,00" 
                        value={newContract.valorPedagio || ''}
                        onChange={(e) => setNewContract({...newContract, valorPedagio: e.target.value})}
                        disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                      />
                    </div>
                  </div>
                  
                  {/* Saldo a Pagar (calculado automaticamente) */}
                  <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <Label>Saldo a Pagar</Label>
                      <div className="text-xl font-semibold">
                        R$ {(
                          parseFloat(newContract.valorFreteTerceiro || '0') - 
                          parseFloat(newContract.valorAdiantamento || '0') - 
                          parseFloat(newContract.valorPedagio || '0')
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="observacoes">
              <div className="space-y-4">
                {activeContract?.status === 'Rejeitado' && activeContract.rejeicao && (
                  <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-red-600 flex items-center gap-2">
                        <ThumbsDown size={16} /> 
                        Contrato Rejeitado
                      </CardTitle>
                      <CardDescription>
                        Data: {format(new Date(activeContract.rejeicao.data), 'dd/MM/yyyy')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label>Motivo da Rejeição:</Label>
                        <p className="text-sm">{activeContract.rejeicao.motivo}</p>
                      </div>
                      <div className="mt-2">
                        <Label>Responsável:</Label>
                        <p className="text-sm">{activeContract.rejeicao.responsavel}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="responsavelEntrega">Quem da operação entregou o contrato</Label>
                  <Input 
                    id="responsavelEntrega" 
                    placeholder="Nome do responsável" 
                    value={newContract.responsavelEntrega || ''}
                    onChange={(e) => setNewContract({...newContract, responsavelEntrega: e.target.value})}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dataEntrega">Data de entrega à controladoria</Label>
                  <Input 
                    type="date"
                    id="dataEntrega" 
                    value={newContract.dataEntrega || ''}
                    onChange={(e) => setNewContract({...newContract, dataEntrega: e.target.value})}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <textarea 
                    id="observacoes" 
                    className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-sistema-primary dark:bg-gray-800 dark:border-gray-600" 
                    placeholder="Observações adicionais"
                    value={newContract.observacoes || ''}
                    onChange={(e) => setNewContract({...newContract, observacoes: e.target.value})}
                    disabled={activeContract?.status === 'Concluído' || activeContract?.status === 'Aguardando canhoto'}
                  ></textarea>
                </div>
                
                {/* Informações do status atual */}
                {activeContract && (
                  <Card className="border-gray-200 bg-gray-50 dark:bg-gray-800/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText size={16} /> 
                        Status do Contrato
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(activeContract.status)}`}>
                          {activeContract.status}
                        </span>
                        {activeContract.status === 'Concluído' && (
                          <span className="text-sm text-gray-500">
                            Finalizado em: {activeContract.dataEntrega ? format(new Date(activeContract.dataEntrega), 'dd/MM/yyyy') : 'N/A'}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="flex justify-between items-center">
            <div>
              {activeContract && activeContract.status === 'Em andamento' && (
                <Button variant="outline" className="mr-2 border-red-500 text-red-500 hover:bg-red-50" onClick={() => {
                  setShowAddDialog(false);
                  setShowRejectDialog(true);
                }}>
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  Rejeitar
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Fechar</Button>
              </DialogClose>
              
              {(activeContract?.status !== 'Concluído' && activeContract?.status !== 'Aguardando canhoto') && (
                <Button type="button" onClick={salvarContrato}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Rejeição de Contrato */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <ThumbsDown size={18} />
              Rejeitar Contrato
            </DialogTitle>
            <DialogDescription>
              Informe o motivo da rejeição do contrato. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="motivoRejeicao">Motivo da Rejeição</Label>
              <textarea 
                id="motivoRejeicao" 
                className="w-full p-2 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-600" 
                placeholder="Descreva o motivo da rejeição do contrato..."
                value={motivoRejeicao}
                onChange={(e) => setMotivoRejeicao(e.target.value)}
              ></textarea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>Cancelar</Button>
            <Button 
              className="bg-red-600 hover:bg-red-700" 
              onClick={rejeitarContrato}
            >
              Rejeitar Contrato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Contratos;
