
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  FileText, 
  Calendar, 
  Truck as TruckIcon,
  MapPin,
  User,
  DollarSign
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusColors = {
  'Em Andamento': 'bg-blue-100 text-blue-800',
  'Concluído': 'bg-green-100 text-green-800',
  'Cancelado': 'bg-red-100 text-red-800',
  'Aguardando Canhoto': 'bg-yellow-100 text-yellow-800',
  'Pendente': 'bg-orange-100 text-orange-800'
};

const ContratosPagina = () => {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('todos');
  const navigate = useNavigate();

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('Contratos')
        .select('*')
        .order('id', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error("Erro ao carregar contratos:", error);
        setError("Erro ao carregar a lista de contratos");
        toast.error("Erro ao carregar a lista de contratos");
        return;
      }

      setContratos(data || []);
    } catch (err) {
      console.error("Erro ao processar dados:", err);
      setError("Ocorreu um erro ao processar os dados dos contratos");
      toast.error("Ocorreu um erro ao processar os dados dos contratos");
    } finally {
      setLoading(false);
    }
  };

  const filteredContratos = contratos.filter(contrato => {
    // Filtro de pesquisa
    const matchesSearch = 
      contrato.cliente_destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.cidade_destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.placa_cavalo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(contrato.id).includes(searchTerm);
    
    // Filtro de status
    const matchesStatus = 
      statusFilter === 'todos' || 
      contrato.status_contrato === statusFilter;
    
    // Filtro de abas
    if (activeTab === 'todos') {
      return matchesSearch && matchesStatus;
    } else if (activeTab === 'andamento') {
      return matchesSearch && matchesStatus && contrato.status_contrato === 'Em Andamento';
    } else if (activeTab === 'concluidos') {
      return matchesSearch && matchesStatus && contrato.status_contrato === 'Concluído';
    } else if (activeTab === 'aguardando') {
      return matchesSearch && matchesStatus && contrato.status_contrato === 'Aguardando Canhoto';
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatarData = (dataString) => {
    if (!dataString) return 'N/A';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };

  const handleNovoContrato = () => {
    navigate('/contratos/novo');
  };

  // Renderização com tratamento de erro explícito
  if (error) {
    return (
      <Card className="shadow-sm border p-6">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <span className="text-lg font-medium">{error}</span>
          </div>
          <Button onClick={carregarContratos}>Tentar novamente</Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            className="pl-10 w-full"
            placeholder="Buscar contratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Aguardando Canhoto">Aguardando Canhoto</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span className="hidden md:inline">Exportar</span>
          </Button>
          
          <Button onClick={handleNovoContrato} className="flex items-center gap-2">
            <Plus size={16} />
            <span className="hidden md:inline">Novo Contrato</span>
          </Button>
        </div>
      </div>
      
      <Card className="shadow-sm border overflow-hidden">
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b px-4">
            <TabsList className="h-12">
              <TabsTrigger value="todos" className="data-[state=active]:bg-blue-50">Todos</TabsTrigger>
              <TabsTrigger value="andamento" className="data-[state=active]:bg-blue-50">Em Andamento</TabsTrigger>
              <TabsTrigger value="concluidos" className="data-[state=active]:bg-blue-50">Concluídos</TabsTrigger>
              <TabsTrigger value="aguardando" className="data-[state=active]:bg-blue-50">Aguardando Canhoto</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="todos" className="m-0">
            {renderContratosTable()}
          </TabsContent>
          
          <TabsContent value="andamento" className="m-0">
            {renderContratosTable('Em Andamento')}
          </TabsContent>
          
          <TabsContent value="concluidos" className="m-0">
            {renderContratosTable('Concluído')}
          </TabsContent>
          
          <TabsContent value="aguardando" className="m-0">
            {renderContratosTable('Aguardando Canhoto')}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );

  function renderContratosTable(filterStatus = null) {
    if (loading) {
      return <LoadingPlaceholder className="m-4" />;
    }
    
    if (contratos.length === 0) {
      return (
        <Placeholder 
          title="Nenhum contrato encontrado" 
          description="Você ainda não possui nenhum contrato registrado. Clique no botão acima para adicionar."
          buttonText="Adicionar Novo Contrato"
          onButtonClick={handleNovoContrato}
          className="m-4"
        />
      );
    }
    
    let displayedContratos = filteredContratos;
    
    if (filterStatus) {
      displayedContratos = displayedContratos.filter(c => c.status_contrato === filterStatus);
    }
    
    if (displayedContratos.length === 0) {
      return (
        <div className="p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Nenhum contrato encontrado</h3>
          <p className="text-gray-500 mt-1">Não há contratos que correspondam aos filtros selecionados.</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead className="w-[160px]">Data</TableHead>
              <TableHead>Cliente/Destino</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Valor Frete</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedContratos.map((contrato) => (
              <TableRow 
                key={contrato.id} 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => navigate(`/contratos/editar/${contrato.id}`)}
              >
                <TableCell className="font-medium">{contrato.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                      {formatarData(contrato.data_saida)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{contrato.cliente_destino || 'N/A'}</span>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {contrato.cidade_destino}/{contrato.estado_destino}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={contrato.tipo_frota === 'frota' ? 'outline' : 'secondary'}>
                    {contrato.tipo_frota === 'frota' ? 'Própria' : 'Terceirizada'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm">
                      <TruckIcon className="h-3.5 w-3.5 mr-1 text-gray-500" />
                      {contrato.placa_cavalo || 'N/A'}
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <User className="h-3 w-3 mr-1" />
                      {contrato.motorista || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <DollarSign className="h-3.5 w-3.5 mr-1 text-gray-500" />
                    {contrato.valor_frete 
                      ? `R$ ${parseFloat(contrato.valor_frete).toFixed(2).replace('.', ',')}`
                      : 'N/A'}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[contrato.status_contrato] || 'bg-gray-100 text-gray-800'}>
                    {contrato.status_contrato || 'Pendente'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {displayedContratos.length} de {contratos.length} contratos
          </p>
        </div>
      </div>
    );
  }
};

export default ContratosPagina;
