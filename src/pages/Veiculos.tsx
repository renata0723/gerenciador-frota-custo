
import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Truck, Plus, Search, Filter, Download, Trash, Edit, Eye, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import VeiculosTable from '@/components/veiculos/VeiculosTable';
import VeiculosStats from '@/components/veiculos/VeiculosStats';

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [veiculosData, setVeiculosData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('*');

      if (error) {
        console.error("Erro ao carregar veículos:", error);
        toast.error("Erro ao carregar a lista de veículos");
        return;
      }

      // Mapear dados para o formato esperado pelo componente
      const veiculosFormatados = (data || []).map(veiculo => ({
        id: (veiculo as any).id || Math.random().toString(36).substr(2, 9),
        placa: (veiculo as any).placa_cavalo || (veiculo as any).placa_carreta || 'Sem placa',
        tipo: (veiculo as any).placa_cavalo ? 'Cavalo' : 'Carreta',
        modelo: 'Não especificado', // Valor padrão
        ano: new Date().getFullYear(), // Valor padrão
        status: (veiculo as any).status_veiculo || 'Ativo',
        frota: (veiculo as any).tipo_frota || 'Própria',
        inativacao: (veiculo as any).status_veiculo === 'Inativo' ? {
          data: (veiculo as any).data_inativacao || '2023-01-01',
          motivo: (veiculo as any).motivo_inativacao || 'Não especificado'
        } : null
      }));

      setVeiculosData(veiculosFormatados);
    } catch (error) {
      console.error("Erro ao processar dados:", error);
      toast.error("Ocorreu um erro ao processar os dados dos veículos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar veículos pelo termo de busca
  const filteredVeiculos = veiculosData.filter(veiculo => 
    (veiculo as any).placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (veiculo as any).modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (veiculo as any).tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInativarVeiculo = async (id: any, motivo: string, data: string) => {
    try {
      const veiculoParaInativar = veiculosData.find(v => (v as any).id === id);
      if (!veiculoParaInativar) return;

      // Atualiza no banco de dados
      const { error } = await supabase
        .from('Veiculos')
        .update({
          status_veiculo: 'Inativo',
          data_inativacao: data,
          motivo_inativacao: motivo
        })
        .eq('placa_cavalo', (veiculoParaInativar as any).placa)
        .eq('tipo', (veiculoParaInativar as any).tipo === 'Cavalo' ? 'cavalo' : 'carreta');

      if (error) {
        console.error("Erro ao inativar veículo:", error);
        toast.error("Erro ao inativar veículo");
        return;
      }

      // Atualiza estado local
      setVeiculosData(veiculos => veiculos.map(veiculo => {
        if ((veiculo as any).id === id) {
          return {
            ...(veiculo as any),
            status: 'Inativo',
            inativacao: { data, motivo }
          };
        }
        return veiculo;
      }));
      
      toast.success("Veículo inativado com sucesso!");
    } catch (error) {
      console.error("Erro ao processar inativação:", error);
      toast.error("Ocorreu um erro ao inativar o veículo");
    }
  };

  const handleDeleteVeiculo = async (id: any) => {
    try {
      const veiculoParaDeletar = veiculosData.find(v => (v as any).id === id);
      if (!veiculoParaDeletar) return;

      // Exclui do banco de dados
      const { error } = await supabase
        .from('Veiculos')
        .delete()
        .or(`placa_cavalo.eq.${(veiculoParaDeletar as any).placa},placa_carreta.eq.${(veiculoParaDeletar as any).placa}`);

      if (error) {
        console.error("Erro ao excluir veículo:", error);
        toast.error("Erro ao excluir veículo");
        return;
      }

      // Atualiza estado local
      setVeiculosData(veiculos => veiculos.filter(veiculo => (veiculo as any).id !== id));
      
      toast.success("Veículo excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao processar exclusão:", error);
      toast.error("Ocorreu um erro ao excluir o veículo");
    }
  };

  const excluirTodosVeiculos = async () => {
    // Confirmar a exclusão
    if (!window.confirm("Tem certeza que deseja excluir TODOS os veículos? Esta ação não pode ser desfeita!")) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('Veiculos')
        .delete()
        .neq('id', -1); // Condição que sempre será verdadeira, para excluir todos

      if (error) {
        console.error("Erro ao excluir todos os veículos:", error);
        toast.error("Erro ao excluir todos os veículos");
        return;
      }

      setVeiculosData([]);
      toast.success("Todos os veículos foram excluídos com sucesso!");
    } catch (error) {
      console.error("Erro ao processar exclusão em massa:", error);
      toast.error("Ocorreu um erro ao excluir os veículos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Veículos" 
        description="Gerencie sua frota de veículos"
        icon={<Truck size={26} className="text-blue-500" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos' }
        ]}
        actions={
          <>
            <Button 
              variant="destructive" 
              className="mr-2" 
              onClick={excluirTodosVeiculos}
              disabled={loading || veiculosData.length === 0}
            >
              <Trash size={16} className="mr-2" />
              Excluir Todos
            </Button>
            <Link to="/veiculos/relatorios">
              <Button variant="outline" className="mr-2">
                <FileText size={16} className="mr-2" />
                Relatórios
              </Button>
            </Link>
            <Link to="/veiculos/novo">
              <Button>
                <Plus size={16} className="mr-2" />
                Novo Veículo
              </Button>
            </Link>
          </>
        }
      />

      <VeiculosStats veiculosData={veiculosData} />

      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 animate-fade-in">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 w-full"
                placeholder="Buscar veículos..."
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
          <div className="p-8 text-center">Carregando veículos...</div>
        ) : (
          <VeiculosTable 
            veiculos={filteredVeiculos}
            onInativar={handleInativarVeiculo}
            onDelete={handleDeleteVeiculo}
          />
        )}
        
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {filteredVeiculos.length} de {veiculosData.length} veículos
            </p>
          </div>
          
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
      </div>
    </PageLayout>
  );
};

export default Veiculos;
