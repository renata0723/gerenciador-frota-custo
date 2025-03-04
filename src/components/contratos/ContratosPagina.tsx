
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Search, Filter, Download, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formataMoeda } from '@/utils/constants';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';

const ContratosPagina = () => {
  const navigate = useNavigate();
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('*')
        .order('data_saida', { ascending: false });

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
    contrato.placa_cavalo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const novoContrato = () => {
    navigate('/contratos/novo');
  };

  const visualizarContrato = (id: string) => {
    navigate(`/contratos/editar/${id}`);
  };

  return (
    <>
      <Card className="shadow-sm border mb-6">
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
              <Button variant="outline" className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Relatórios
              </Button>
              <Button onClick={novoContrato} className="flex items-center">
                <Plus size={16} className="mr-2" />
                Novo Contrato
              </Button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <LoadingPlaceholder className="m-4" />
        ) : contratos.length === 0 ? (
          <Placeholder 
            title="Nenhum contrato encontrado" 
            description="Você ainda não possui nenhum contrato cadastrado. Clique no botão acima para criar um novo."
            buttonText="Criar Novo Contrato"
            onButtonClick={novoContrato}
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data de Saída</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Origem / Destino</TableHead>
                  <TableHead>Placas</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor do Frete</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContratos.map((contrato) => (
                  <TableRow key={contrato.id} className="cursor-pointer hover:bg-gray-50" onClick={() => visualizarContrato(contrato.id)}>
                    <TableCell>{contrato.data_saida}</TableCell>
                    <TableCell className="font-medium">{contrato.cliente_destino}</TableCell>
                    <TableCell>{contrato.cidade_origem} → {contrato.cidade_destino}</TableCell>
                    <TableCell>{contrato.placa_cavalo} {contrato.placa_carreta ? `/ ${contrato.placa_carreta}` : ''}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${
                        contrato.tipo_frota === 'propria' 
                          ? 'bg-green-100 text-green-800'  
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {contrato.tipo_frota === 'propria' ? 'Própria' : 'Terceirizada'}
                      </div>
                    </TableCell>
                    <TableCell>{formataMoeda(contrato.valor_frete || 0)}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${
                        contrato.status_contrato === 'Concluído' 
                          ? 'bg-green-100 text-green-800' 
                          : contrato.status_contrato === 'Em trânsito'
                            ? 'bg-blue-100 text-blue-800'
                            : contrato.status_contrato === 'Cancelado'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contrato.status_contrato || 'Pendente'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={(e) => {
                          e.stopPropagation();
                          visualizarContrato(contrato.id);
                        }}
                      >
                        Visualizar
                      </Button>
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
    </>
  );
};

export default ContratosPagina;
