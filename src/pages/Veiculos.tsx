
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import VeiculosTable from '@/components/veiculos/VeiculosTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, FileDown, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { VeiculoData, listarVeiculos, excluirVeiculo } from '@/services/veiculoService';
import { toast } from 'sonner';
import PageHeader from '@/components/ui/PageHeader';
import { logOperation } from '@/utils/logOperations';
import VeiculosStats from '@/components/veiculos/VeiculosStats';
import VeiculosSearchBar from '@/components/veiculos/VeiculosSearchBar';
import VeiculosPagination from '@/components/veiculos/VeiculosPagination';
import VeiculosError from '@/components/veiculos/VeiculosError';

const Veiculos: React.FC = () => {
  const navigate = useNavigate();
  const [veiculosData, setVeiculosData] = useState<VeiculoData[]>([]);
  const [filteredData, setFilteredData] = useState<VeiculoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Carrega os dados dos veículos
  const carregarVeiculos = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await listarVeiculos();
      setVeiculosData(data);
      aplicarFiltros(data, activeTab, searchTerm);
      logOperation('Veículos', 'Listagem de veículos carregada com sucesso', true);
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
      setError('Falha ao carregar os dados dos veículos.');
      logOperation('Veículos', 'Falha ao carregar listagem de veículos', false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarVeiculos();
  }, []);

  // Aplicar filtros de busca e tab
  const aplicarFiltros = (data: VeiculoData[], tab: string, search: string) => {
    let resultado = [...data];
    
    // Filtrar por status
    if (tab === 'ativos') {
      resultado = resultado.filter(veiculo => veiculo.status === 'Ativo');
    } else if (tab === 'inativos') {
      resultado = resultado.filter(veiculo => veiculo.status === 'Inativo');
    }
    
    // Filtrar por termo de busca
    if (search) {
      const termoBusca = search.toLowerCase();
      resultado = resultado.filter(veiculo => 
        veiculo.placa.toLowerCase().includes(termoBusca) || 
        veiculo.modelo.toLowerCase().includes(termoBusca)
      );
    }
    
    setFilteredData(resultado);
    setCurrentPage(1); // Voltar para a primeira página ao aplicar filtros
  };

  // Aplicar filtros sempre que mudar a aba ou o termo de busca
  useEffect(() => {
    aplicarFiltros(veiculosData, activeTab, searchTerm);
  }, [activeTab, searchTerm, veiculosData]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calcular paginação
  const paginatedVeiculos = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Função para excluir um veículo
  const handleExcluirVeiculo = async (placa: string) => {
    try {
      const success = await excluirVeiculo(placa);
      
      if (success) {
        toast.success('Veículo excluído com sucesso!');
        carregarVeiculos();
        logOperation('Veículos', `Veículo ${placa} excluído com sucesso`, true);
      } else {
        toast.error('Erro ao excluir veículo');
        logOperation('Veículos', `Falha ao excluir veículo ${placa}`, false);
      }
    } catch (err) {
      console.error('Erro ao excluir veículo:', err);
      toast.error('Ocorreu um erro ao excluir o veículo');
      logOperation('Veículos', `Falha ao excluir veículo ${placa}`, false);
    }
  };

  const handleExportarRelatorio = () => {
    // Implementação pendente - exportação de relatório
    toast.info('Função de exportação será implementada em breve');
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Veículos" 
        description="Gerencie a frota de veículos da empresa"
      />
      
      <div className="flex justify-between items-center mb-6">
        <VeiculosSearchBar value={searchTerm} onSearch={handleSearch} />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportarRelatorio}
            className="flex items-center gap-2"
          >
            <FileDown size={16} />
            Exportar
          </Button>
          
          <Button onClick={() => carregarVeiculos()} variant="outline" className="flex items-center gap-2">
            <RefreshCw size={16} />
            Atualizar
          </Button>
          
          <Button onClick={() => navigate('/veiculos/novo')} className="flex items-center gap-2">
            <PlusCircle size={16} />
            Novo Veículo
          </Button>
        </div>
      </div>
      
      {/* Estatísticas */}
      {!isLoading && !error && <VeiculosStats veiculos={veiculosData} />}
      
      <Separator className="my-6" />
      
      <Tabs defaultValue="todos" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="inativos">Inativos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="todos" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <VeiculosError message={error} onRetry={carregarVeiculos} />
          ) : paginatedVeiculos.length > 0 ? (
            <>
              <VeiculosTable 
                veiculos={paginatedVeiculos} 
                onExcluir={handleExcluirVeiculo} 
                onReload={carregarVeiculos}
              />
              
              <div className="mt-4">
                <VeiculosPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum veículo encontrado.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="ativos" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <VeiculosError message={error} onRetry={carregarVeiculos} />
          ) : paginatedVeiculos.length > 0 ? (
            <>
              <VeiculosTable 
                veiculos={paginatedVeiculos} 
                onExcluir={handleExcluirVeiculo} 
                onReload={carregarVeiculos}
              />
              
              <div className="mt-4">
                <VeiculosPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum veículo ativo encontrado.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="inativos" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <VeiculosError message={error} onRetry={carregarVeiculos} />
          ) : paginatedVeiculos.length > 0 ? (
            <>
              <VeiculosTable 
                veiculos={paginatedVeiculos} 
                onExcluir={handleExcluirVeiculo} 
                onReload={carregarVeiculos}
              />
              
              <div className="mt-4">
                <VeiculosPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum veículo inativo encontrado.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchTerm('')}
                className="mt-2"
              >
                Limpar filtros
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Veiculos;
