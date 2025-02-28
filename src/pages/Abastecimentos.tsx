
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Fuel, Search, Filter, Download, Calendar, Plus, Trash, Edit, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardCard from '@/components/dashboard/DashboardCard';
import { logOperation } from '@/utils/logOperations';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Interface para os dados de abastecimento
interface AbastecimentoItem {
  id: string;
  data: string;
  placa: string;
  motorista: string;
  posto: string;
  combustivel: string;
  litros: number;
  valorUnitario: number;
  valorTotal: number;
  km: number;
  kmAnterior?: number;
  mediaKm?: number;
  autorizadoPor: string;
  itensAdicionais?: Array<{
    item: string;
    quantidade: number;
    valor: number;
  }>;
}

// Dados iniciais para demonstração
const dadosIniciais: AbastecimentoItem[] = [
  {
    id: 'AB001',
    data: '05/04/2023',
    placa: 'ABC-1234',
    motorista: 'João Silva',
    posto: 'Posto Ipiranga - BR 116',
    combustivel: 'Diesel S10',
    litros: 150,
    valorUnitario: 5.79,
    valorTotal: 868.50,
    km: 45800,
    kmAnterior: 45300,
    mediaKm: 3.33,
    autorizadoPor: 'Carlos Operacional',
    itensAdicionais: [
      { item: 'Arla 32', quantidade: 20, valor: 180.00 }
    ]
  },
  {
    id: 'AB002',
    data: '08/04/2023',
    placa: 'DEF-5678',
    motorista: 'Pedro Santos',
    posto: 'Auto Posto Rodoviário',
    combustivel: 'Diesel S10',
    litros: 120,
    valorUnitario: 5.85,
    valorTotal: 702.00,
    km: 67500,
    kmAnterior: 67100,
    mediaKm: 3.33,
    autorizadoPor: 'Maria Gestora'
  },
  {
    id: 'AB003',
    data: '10/04/2023',
    placa: 'GHI-9012',
    motorista: 'Marcos Oliveira',
    posto: 'Posto Shell - Rod. Anhanguera',
    combustivel: 'Diesel Comum',
    litros: 180,
    valorUnitario: 5.59,
    valorTotal: 1006.20,
    km: 73200,
    kmAnterior: 72600,
    mediaKm: 3.33,
    autorizadoPor: 'Carlos Operacional',
    itensAdicionais: [
      { item: 'Óleo Motor', quantidade: 1, valor: 120.00 },
      { item: 'Arla 32', quantidade: 10, valor: 90.00 }
    ]
  },
  {
    id: 'AB004',
    data: '15/04/2023',
    placa: 'JKL-3456',
    motorista: 'Ana Costa',
    posto: 'Posto Petrobras - Rod. Dutra',
    combustivel: 'Diesel S10',
    litros: 200,
    valorUnitario: 5.75,
    valorTotal: 1150.00,
    km: 58700,
    kmAnterior: 58000,
    mediaKm: 3.50,
    autorizadoPor: 'Maria Gestora'
  },
];

// Chave para armazenamento no localStorage
const STORAGE_KEY = 'controlfrota_abastecimentos';

const Abastecimentos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState<AbastecimentoItem[]>([]);
  const [abastecimentoData, setAbastecimentoData] = useState<AbastecimentoItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7dias' | '30dias' | 'todos'>('todos');
  const [selectedItem, setSelectedItem] = useState<AbastecimentoItem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      setAbastecimentoData(JSON.parse(storedData));
    } else {
      // Se não existir dados no localStorage, usa os dados iniciais
      setAbastecimentoData(dadosIniciais);
      // Salva os dados iniciais no localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosIniciais));
    }
    
    logOperation('Abastecimentos', 'Acessou página de Abastecimentos', false);
  }, []);
  
  // Filtrar dados com base no termo de busca e período selecionado
  useEffect(() => {
    let filtered = abastecimentoData;
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.motorista.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por período
    if (selectedPeriod !== 'todos') {
      const hoje = new Date();
      const diasAtras = selectedPeriod === '7dias' ? 7 : 30;
      const dataLimite = new Date();
      dataLimite.setDate(hoje.getDate() - diasAtras);
      
      filtered = filtered.filter(item => {
        const partes = item.data.split('/');
        const dataItem = new Date(
          parseInt(partes[2]), 
          parseInt(partes[1]) - 1, 
          parseInt(partes[0])
        );
        return dataItem >= dataLimite;
      });
    }
    
    setFilteredItems(filtered);
  }, [searchTerm, abastecimentoData, selectedPeriod]);
  
  // Calcular totais
  const calcularTotais = () => {
    const totalLitros = abastecimentoData.reduce((acc, item) => acc + item.litros, 0);
    const totalValor = abastecimentoData.reduce((acc, item) => acc + item.valorTotal, 0);
    const mediaConsumoPonderada = totalLitros > 0 
      ? abastecimentoData.reduce((acc, item) => {
          return acc + (item.mediaKm || 0) * (item.litros / totalLitros);
        }, 0)
      : 0;
    
    return { totalLitros, totalValor, mediaConsumoPonderada };
  };
  
  const { totalLitros, totalValor, mediaConsumoPonderada } = calcularTotais();
  
  // Função para adicionar novo abastecimento
  const adicionarAbastecimento = (novoItem: Partial<AbastecimentoItem>) => {
    // Gerar ID único
    const novoId = `AB${(abastecimentoData.length + 1).toString().padStart(3, '0')}`;
    
    // Calcular média de km/l se tiver km anterior
    let mediaKm = undefined;
    if (novoItem.kmAnterior && novoItem.km) {
      const distanciaPercorrida = novoItem.km - novoItem.kmAnterior;
      mediaKm = distanciaPercorrida > 0 && novoItem.litros > 0 
        ? parseFloat((distanciaPercorrida / novoItem.litros).toFixed(2))
        : undefined;
    }
    
    const itemCompleto: AbastecimentoItem = {
      id: novoId,
      data: novoItem.data || new Date().toLocaleDateString('pt-BR'),
      placa: novoItem.placa || '',
      motorista: novoItem.motorista || '',
      posto: novoItem.posto || '',
      combustivel: novoItem.combustivel || 'Diesel S10',
      litros: novoItem.litros || 0,
      valorUnitario: novoItem.valorUnitario || 0,
      valorTotal: novoItem.valorTotal || 0,
      km: novoItem.km || 0,
      kmAnterior: novoItem.kmAnterior,
      mediaKm,
      autorizadoPor: novoItem.autorizadoPor || '',
      itensAdicionais: novoItem.itensAdicionais || []
    };
    
    const novosItens = [itemCompleto, ...abastecimentoData];
    setAbastecimentoData(novosItens);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosItens));
    
    toast.success('Abastecimento registrado com sucesso');
    setIsAddDialogOpen(false);
    logOperation('Abastecimentos', `Adicionou novo abastecimento ${novoId}`, true);
  };
  
  // Função para excluir abastecimento
  const excluirAbastecimento = (id: string) => {
    const novosItens = abastecimentoData.filter(item => item.id !== id);
    setAbastecimentoData(novosItens);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(novosItens));
    
    toast.success('Abastecimento excluído com sucesso');
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
    logOperation('Abastecimentos', `Excluiu abastecimento ${id}`, true);
  };
  
  // Função para mostrar detalhes
  const handleShowDetails = (item: AbastecimentoItem) => {
    setSelectedItem(item);
    setIsDetailsDialogOpen(true);
    logOperation('Abastecimentos', `Visualizou detalhes do abastecimento ${item.id}`, false);
  };
  
  // Função para confirmar exclusão
  const handleDelete = (item: AbastecimentoItem) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
    logOperation('Abastecimentos', `Iniciou exclusão do abastecimento ${item.id}`, false);
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Abastecimentos" 
        description="Controle de abastecimentos da frota"
        icon={<Fuel className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Abastecimentos' }
        ]}
        actions={
          <Button 
            className="bg-sistema-primary hover:bg-sistema-primary/90"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Abastecimento
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard title="Total Litros">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {totalLitros.toLocaleString('pt-BR')} L
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Volume total de combustível
          </div>
        </DashboardCard>
        
        <DashboardCard title="Valor Total">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            R$ {totalValor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Gasto total com abastecimentos
          </div>
        </DashboardCard>
        
        <DashboardCard title="Média Consumo">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {mediaConsumoPonderada.toFixed(2)} Km/L
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Média ponderada de consumo
          </div>
        </DashboardCard>
      </div>
      
      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 w-full"
                placeholder="Buscar por placa ou motorista..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant={selectedPeriod === '7dias' ? 'default' : 'outline'} 
                onClick={() => setSelectedPeriod('7dias')}
                className={selectedPeriod === '7dias' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
              >
                Últimos 7 dias
              </Button>
              <Button 
                variant={selectedPeriod === '30dias' ? 'default' : 'outline'} 
                onClick={() => setSelectedPeriod('30dias')}
                className={selectedPeriod === '30dias' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
              >
                Últimos 30 dias
              </Button>
              <Button 
                variant={selectedPeriod === 'todos' ? 'default' : 'outline'} 
                onClick={() => setSelectedPeriod('todos')}
                className={selectedPeriod === 'todos' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
              >
                Todos
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Data</th>
                <th scope="col" className="px-6 py-3">Placa</th>
                <th scope="col" className="px-6 py-3">Motorista</th>
                <th scope="col" className="px-6 py-3">Combustível</th>
                <th scope="col" className="px-6 py-3">Litros</th>
                <th scope="col" className="px-6 py-3">Valor</th>
                <th scope="col" className="px-6 py-3">Km</th>
                <th scope="col" className="px-6 py-3">Média Km/L</th>
                <th scope="col" className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-sistema-primary">{item.id}</td>
                    <td className="px-6 py-4">{item.data}</td>
                    <td className="px-6 py-4">{item.placa}</td>
                    <td className="px-6 py-4">{item.motorista}</td>
                    <td className="px-6 py-4">{item.combustivel}</td>
                    <td className="px-6 py-4">{item.litros.toLocaleString('pt-BR')} L</td>
                    <td className="px-6 py-4">R$ {item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4">{item.km.toLocaleString('pt-BR')}</td>
                    <td className="px-6 py-4">
                      {item.mediaKm 
                        ? item.mediaKm.toFixed(2)
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-gray-500 hover:text-blue-500 transition-colors duration-200" 
                          title="Ver detalhes"
                          onClick={() => handleShowDetails(item)}
                        >
                          <Info size={18} />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" 
                          title="Editar"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-red-500 transition-colors duration-200" 
                          title="Excluir"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Fuel size={32} className="mb-2 text-gray-400" />
                      <p>Nenhum registro encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal para visualização de detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-sistema-primary" />
              Detalhes do Abastecimento
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas do abastecimento {selectedItem?.id}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data:</span>
                <span className="col-span-3">{selectedItem.data}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Placa:</span>
                <span className="col-span-3">{selectedItem.placa}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Motorista:</span>
                <span className="col-span-3">{selectedItem.motorista}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Posto:</span>
                <span className="col-span-3">{selectedItem.posto}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Combustível:</span>
                <span className="col-span-3">{selectedItem.combustivel}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Litros:</span>
                <span className="col-span-3">{selectedItem.litros.toLocaleString('pt-BR')} L</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Valor Unit.:</span>
                <span className="col-span-3">R$ {selectedItem.valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Valor Total:</span>
                <span className="col-span-3">R$ {selectedItem.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Km Atual:</span>
                <span className="col-span-3">{selectedItem.km.toLocaleString('pt-BR')} km</span>
              </div>
              
              {selectedItem.kmAnterior && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Km Anterior:</span>
                  <span className="col-span-3">{selectedItem.kmAnterior.toLocaleString('pt-BR')} km</span>
                </div>
              )}
              
              {selectedItem.mediaKm && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Média:</span>
                  <span className="col-span-3">{selectedItem.mediaKm.toFixed(2)} km/l</span>
                </div>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Autorização:</span>
                <span className="col-span-3">{selectedItem.autorizadoPor}</span>
              </div>
              
              {selectedItem.itensAdicionais && selectedItem.itensAdicionais.length > 0 && (
                <>
                  <div className="mt-2 mb-1">
                    <h4 className="font-medium">Itens Adicionais:</h4>
                  </div>
                  
                  {selectedItem.itensAdicionais.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 items-center gap-4">
                      <span className="text-sm font-medium">{item.item}:</span>
                      <span className="col-span-3">
                        {item.quantidade} x R$ {(item.valor / item.quantidade).toFixed(2)} = R$ {item.valor.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o abastecimento {selectedItem?.id}?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedItem && excluirAbastecimento(selectedItem.id)} 
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Modal para adicionar novo abastecimento (simplificado) */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-sistema-primary" />
              Novo Abastecimento
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do abastecimento.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Data:</span>
              <div className="col-span-3">
                <Input 
                  type="date" 
                  id="novoData"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Placa:</span>
              <div className="col-span-3">
                <Input 
                  type="text" 
                  id="novoPlaca"
                  placeholder="ABC-1234"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Motorista:</span>
              <div className="col-span-3">
                <Input 
                  type="text" 
                  id="novoMotorista"
                  placeholder="Nome do motorista"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Posto:</span>
              <div className="col-span-3">
                <Input 
                  type="text" 
                  id="novoPosto"
                  placeholder="Nome do posto"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Combustível:</span>
              <div className="col-span-3">
                <select 
                  id="novoCombustivel"
                  className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="Diesel S10">Diesel S10</option>
                  <option value="Diesel Comum">Diesel Comum</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Etanol">Etanol</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Litros:</span>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  id="novoLitros"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Valor Unit.:</span>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  id="novoValorUnitario"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Km Atual:</span>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  id="novoKm"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Km Anterior:</span>
              <div className="col-span-3">
                <Input 
                  type="number" 
                  id="novoKmAnterior"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-sm font-medium">Autorizado por:</span>
              <div className="col-span-3">
                <Input 
                  type="text" 
                  id="novoAutorizadoPor"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                const placa = (document.getElementById('novoPlaca') as HTMLInputElement).value;
                const litros = parseFloat((document.getElementById('novoLitros') as HTMLInputElement).value) || 0;
                const valorUnitario = parseFloat((document.getElementById('novoValorUnitario') as HTMLInputElement).value) || 0;
                const km = parseInt((document.getElementById('novoKm') as HTMLInputElement).value) || 0;
                const kmAnterior = parseInt((document.getElementById('novoKmAnterior') as HTMLInputElement).value) || 0;
                
                if (!placa || litros <= 0 || valorUnitario <= 0) {
                  toast.error('Preencha os campos obrigatórios corretamente');
                  return;
                }
                
                const dataInput = (document.getElementById('novoData') as HTMLInputElement).value;
                const partes = dataInput.split('-');
                const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
                
                adicionarAbastecimento({
                  data: dataFormatada,
                  placa,
                  motorista: (document.getElementById('novoMotorista') as HTMLInputElement).value,
                  posto: (document.getElementById('novoPosto') as HTMLInputElement).value,
                  combustivel: (document.getElementById('novoCombustivel') as HTMLSelectElement).value,
                  litros,
                  valorUnitario,
                  valorTotal: litros * valorUnitario,
                  km,
                  kmAnterior: kmAnterior > 0 ? kmAnterior : undefined,
                  autorizadoPor: (document.getElementById('novoAutorizadoPor') as HTMLInputElement).value,
                });
              }}
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Abastecimentos;
