
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { DollarSign, Plus, Search, Filter, Download, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formataMoeda } from '@/utils/constants';
import NovaDespesaForm from '@/components/despesas/NovaDespesaForm';
import Placeholder, { LoadingPlaceholder } from '@/components/ui/Placeholder';

const DespesasGerais = () => {
  const [despesas, setDespesas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarDespesas();
  }, []);

  const carregarDespesas = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Despesas Gerais')
        .select('*');

      if (error) {
        console.error("Erro ao carregar despesas:", error);
        toast.error("Erro ao carregar a lista de despesas");
        return;
      }

      setDespesas(data || []);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Ocorreu um erro ao processar os dados das despesas");
    } finally {
      setLoading(false);
    }
  };

  const handleDespesaAdicionada = () => {
    setShowForm(false);
    carregarDespesas();
    toast.success("Despesa registrada com sucesso!");
  };

  const filteredDespesas = despesas.filter(despesa => 
    despesa.tipo_despesa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    despesa.descricao_detalhada?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    despesa.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDespesas = filteredDespesas.reduce((sum, despesa) => sum + (despesa.valor_despesa || 0), 0);

  return (
    <PageLayout>
      <PageHeader 
        title="Despesas Gerais" 
        description="Gerencie as despesas da empresa"
        icon={<DollarSign size={26} className="text-red-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Despesas Gerais' }
        ]}
        actions={
          <Button onClick={() => setShowForm(true)}>
            <Plus size={16} className="mr-2" />
            Nova Despesa
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total de Despesas</p>
              <h3 className="text-2xl font-bold text-gray-900">{formataMoeda(totalDespesas)}</h3>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <DollarSign size={20} className="text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {showForm ? (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Registrar Nova Despesa</h2>
          <NovaDespesaForm 
            onDespesaAdicionada={handleDespesaAdicionada} 
            onCancel={() => setShowForm(false)}
          />
        </Card>
      ) : null}

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
                placeholder="Buscar despesas..."
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
            </div>
          </div>
        </div>
        
        {loading ? (
          <LoadingPlaceholder className="m-4" />
        ) : despesas.length === 0 ? (
          <Placeholder 
            title="Nenhuma despesa encontrada" 
            description="Você ainda não possui nenhuma despesa registrada. Clique no botão acima para adicionar."
            buttonText="Adicionar Nova Despesa"
            onButtonClick={() => setShowForm(true)}
            className="m-4"
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Contrato</TableHead>
                  <TableHead>Conta Contábil</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDespesas.map((despesa) => (
                  <TableRow key={despesa.id}>
                    <TableCell>{despesa.data_despesa}</TableCell>
                    <TableCell>{despesa.tipo_despesa}</TableCell>
                    <TableCell>{despesa.categoria || 'N/A'}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{despesa.descricao_detalhada}</TableCell>
                    <TableCell>{despesa.contrato_id || 'N/A'}</TableCell>
                    <TableCell>{despesa.conta_contabil || 'Não atribuído'}</TableCell>
                    <TableCell className="text-right font-medium">{formataMoeda(despesa.valor_despesa)}</TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 text-xs rounded-full inline-flex items-center ${
                        despesa.contabilizado 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {despesa.contabilizado ? 'Contabilizado' : 'Pendente'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Mostrando {filteredDespesas.length} de {despesas.length} despesas
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
    </PageLayout>
  );
};

export default DespesasGerais;
