
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Download, Plus, FileText } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error("Erro ao carregar contratos:", error);
        toast.error("Erro ao carregar a lista de contratos");
        return;
      }

      setContratos(data || []);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Ocorreu um erro ao processar os dados dos contratos");
    } finally {
      setLoading(false);
    }
  };

  const filteredContratos = contratos.filter(contrato => 
    contrato.cliente_destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.cidade_destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contrato.placa_cavalo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(contrato.id).includes(searchTerm)
  );

  return (
    <Card className="shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <LoadingPlaceholder className="m-4" />
      ) : contratos.length === 0 ? (
        <Placeholder 
          title="Nenhum contrato encontrado" 
          description="Você ainda não possui nenhum contrato registrado. Clique no botão acima para adicionar."
          buttonText="Adicionar Novo Contrato"
          onButtonClick={() => navigate('/contratos/novo')}
          className="m-4"
        />
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Origem/Destino</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Placa Cavalo</TableHead>
                <TableHead>Placa Carreta</TableHead>
                <TableHead>Valor Frete</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContratos.map((contrato) => (
                <TableRow key={contrato.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/contratos/editar/${contrato.id}`)}>
                  <TableCell className="font-medium">{contrato.id}</TableCell>
                  <TableCell>{contrato.cliente_destino || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{contrato.cidade_origem || 'N/A'}</span>
                      <span className="text-gray-500 text-xs">para {contrato.cidade_destino || 'N/A'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contrato.tipo_frota === 'frota' ? 'Própria' : 'Terceirizada'}
                    </Badge>
                  </TableCell>
                  <TableCell>{contrato.placa_cavalo || 'N/A'}</TableCell>
                  <TableCell>{contrato.placa_carreta || 'N/A'}</TableCell>
                  <TableCell>
                    {contrato.valor_frete 
                      ? `R$ ${parseFloat(contrato.valor_frete).toFixed(2).replace('.', ',')}`
                      : 'N/A'}
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
        </div>
      )}
      
      <div className="p-4 border-t flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Mostrando {filteredContratos.length} de {contratos.length} contratos
        </p>
        <div className="flex space-x-2">
          <Button variant="outline" className="px-3 py-1" disabled>
            Anterior
          </Button>
          <Button className="px-3 py-1">
            1
          </Button>
          <Button variant="outline" className="px-3 py-1" disabled>
            Próximo
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ContratosPagina;
