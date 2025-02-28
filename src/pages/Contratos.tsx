
import React, { useState } from 'react';
import { 
  FileText, Plus, MoreHorizontal, Search, Filter, Download, 
  Truck, FileCheck, User, Calendar, MapPin, Clipboard, 
  DollarSign, FileSpreadsheet, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
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
  DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { format } from 'date-fns';

interface Contract {
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
  manifestos: string[];
  ctes: string[];
  valorFrete: string;
  valorCarga: string;
  notasFiscais: string[];
  valorFreteTerceiro?: string;
  valorAdiantamento?: string;
  valorPedagio?: string;
  saldoPagar?: string;
  responsavelEntrega?: string;
  dataEntrega?: string;
  observacoes?: string;
  status: 'Em andamento' | 'Concluído' | 'Aguardando canhoto' | 'Cancelado';
}

const Contratos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  
  // Dados simulados
  const [contracts, setContracts] = useState<Contract[]>([
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
      manifestos: ['MF-12345'],
      ctes: ['CT-98765'],
      valorFrete: 'R$ 3.500,00',
      valorCarga: 'R$ 120.000,00',
      notasFiscais: ['NF-123456', 'NF-123457'],
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
      manifestos: ['MF-54321'],
      ctes: ['CT-12345'],
      valorFrete: 'R$ 2.800,00',
      valorCarga: 'R$ 85.000,00',
      notasFiscais: ['NF-654321'],
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
      manifestos: ['MF-67890'],
      ctes: ['CT-54321'],
      valorFrete: 'R$ 4.200,00',
      valorCarga: 'R$ 160.000,00',
      notasFiscais: ['NF-987654', 'NF-987655', 'NF-987656'],
      responsavelEntrega: 'José Oliveira',
      dataEntrega: '2023-06-25',
      status: 'Aguardando canhoto'
    }
  ]);

  // Funções
  const handleAddContract = () => {
    setShowAddDialog(true);
    logOperation('Abrir formulário', 'Formulário de novo contrato aberto', true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleViewContract = (contractId: string) => {
    logOperation('Visualizar Contrato', `Contrato ID: ${contractId}`, true);
    toast.info(`Visualizando detalhes do contrato ${contractId}`);
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
    }
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
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Contratos" 
        description="Gerenciamento de contratos de frete e cargas"
        icon={<FileText size={28} className="text-sistema-primary" />}
      />

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
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
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'todos' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('todos')}
          >
            Todos
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'Em andamento' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Em andamento')}
          >
            Em andamento
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'Concluído' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Concluído')}
          >
            Concluídos
          </button>
          <button 
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'Aguardando canhoto' ? 'border-sistema-primary text-sistema-primary' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
            onClick={() => setActiveTab('Aguardando canhoto')}
          >
            Aguardando canhoto
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
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Imprimir</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
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

      {/* Modal/Dialog para Adicionar Novo Contrato */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Contrato</DialogTitle>
            <DialogDescription>
              Preencha os dados do contrato. Clique em salvar quando finalizar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="tipo" className="text-sm font-medium">Tipo</label>
                <select 
                  id="tipo" 
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="frota">Frota</option>
                  <option value="terceiro">Terceiro</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="dataSaida" className="text-sm font-medium">Data Saída</label>
                <Input 
                  type="date" 
                  id="dataSaida" 
                />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="cidadeOrigem" className="text-sm font-medium">Cidade Origem</label>
                <Input id="cidadeOrigem" placeholder="Cidade" />
              </div>
              <div className="space-y-2">
                <label htmlFor="estadoOrigem" className="text-sm font-medium">Estado Origem</label>
                <Input id="estadoOrigem" placeholder="UF" maxLength={2} />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="cidadeDestino" className="text-sm font-medium">Cidade Destino</label>
                <Input id="cidadeDestino" placeholder="Cidade" />
              </div>
              <div className="space-y-2">
                <label htmlFor="estadoDestino" className="text-sm font-medium">Estado Destino</label>
                <Input id="estadoDestino" placeholder="UF" maxLength={2} />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <label htmlFor="cliente" className="text-sm font-medium">Cliente</label>
              <Input id="cliente" placeholder="Nome do cliente" />
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="placaCavalo" className="text-sm font-medium">Placa do Cavalo</label>
                <Input id="placaCavalo" placeholder="ABC1234" />
              </div>
              <div className="space-y-2">
                <label htmlFor="placaCarreta" className="text-sm font-medium">Placa da Carreta</label>
                <Input id="placaCarreta" placeholder="XYZ5678" />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="motorista" className="text-sm font-medium">Motorista</label>
                <Input id="motorista" placeholder="Nome do motorista" />
              </div>
              <div className="space-y-2">
                <label htmlFor="proprietario" className="text-sm font-medium">Proprietário</label>
                <Input id="proprietario" placeholder="Nome do proprietário" />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="valorFrete" className="text-sm font-medium">Valor do Frete</label>
                <Input id="valorFrete" placeholder="R$ 0,00" />
              </div>
              <div className="space-y-2">
                <label htmlFor="valorCarga" className="text-sm font-medium">Valor da Carga</label>
                <Input id="valorCarga" placeholder="R$ 0,00" />
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <label htmlFor="manifesto" className="text-sm font-medium">Número do Manifesto</label>
              <div className="flex gap-2">
                <Input id="manifesto" placeholder="MF-00000" />
                <Button size="sm" variant="outline">+ Adicionar</Button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <label htmlFor="cte" className="text-sm font-medium">Número do CTe</label>
              <div className="flex gap-2">
                <Input id="cte" placeholder="CT-00000" />
                <Button size="sm" variant="outline">+ Adicionar</Button>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <label htmlFor="observacoes" className="text-sm font-medium">Observações</label>
              <textarea 
                id="observacoes" 
                className="w-full p-2 border border-gray-300 rounded-md h-20" 
                placeholder="Observações adicionais"
              ></textarea>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancelar</Button>
            <Button type="submit" onClick={() => {
              toast.success("Contrato adicionado com sucesso!");
              setShowAddDialog(false);
              logOperation('Adicionar Contrato', 'Novo contrato adicionado', true);
            }}>Salvar Contrato</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Contratos;
