
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Plus, FileText, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import VeiculosTable from '@/components/veiculos/VeiculosTable';
import VeiculosStats from '@/components/veiculos/VeiculosStats';
import VeiculosSearchBar from '@/components/veiculos/VeiculosSearchBar';
import VeiculosPagination from '@/components/veiculos/VeiculosPagination';
import VeiculosError from '@/components/veiculos/VeiculosError';
import { 
  carregarVeiculos, 
  inativarVeiculo, 
  excluirVeiculo, 
  excluirTodosVeiculos,
  VeiculoData
} from '@/services/veiculoService';

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [veiculosData, setVeiculosData] = useState<VeiculoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Página Veículos carregada');
    carregarDadosVeiculos();
  }, []);

  const carregarDadosVeiculos = async () => {
    setLoading(true);
    const { veiculos, error } = await carregarVeiculos();
    
    if (error) {
      setError(error);
      toast.error(error);
    } else {
      setVeiculosData(veiculos);
      setError(null);
    }
    
    setLoading(false);
  };

  // Filtrar veículos pelo termo de busca
  const filteredVeiculos = veiculosData.filter(veiculo => 
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInativarVeiculo = async (id, motivo, data) => {
    const veiculoParaInativar = veiculosData.find(v => v.id === id);
    if (!veiculoParaInativar) return;

    const sucesso = await inativarVeiculo(
      id, 
      motivo, 
      data, 
      veiculoParaInativar.placa, 
      veiculoParaInativar.tipo
    );

    if (sucesso) {
      // Atualiza estado local
      setVeiculosData(veiculos => veiculos.map(veiculo => {
        if (veiculo.id === id) {
          return {
            ...veiculo,
            status: 'Inativo',
            inativacao: { data, motivo }
          };
        }
        return veiculo;
      }));
    }
  };

  const handleDeleteVeiculo = async (id) => {
    const veiculoParaDeletar = veiculosData.find(v => v.id === id);
    if (!veiculoParaDeletar) return;

    const sucesso = await excluirVeiculo(
      id,
      veiculoParaDeletar.placa,
      veiculoParaDeletar.tipo
    );

    if (sucesso) {
      // Atualiza estado local
      setVeiculosData(veiculos => veiculos.filter(veiculo => veiculo.id !== id));
    }
  };

  const handleExcluirTodosVeiculos = async () => {
    // Confirmar a exclusão
    if (!window.confirm("Tem certeza que deseja excluir TODOS os veículos? Esta ação não pode ser desfeita!")) {
      return;
    }

    setLoading(true);
    const sucesso = await excluirTodosVeiculos();
    
    if (sucesso) {
      setVeiculosData([]);
    }
    
    setLoading(false);
  };

  // Se ocorreu erro, mostra mensagem de erro
  if (error) {
    return (
      <PageLayout>
        <VeiculosError error={error} onRetry={carregarDadosVeiculos} />
      </PageLayout>
    );
  }

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
              onClick={handleExcluirTodosVeiculos}
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
        <VeiculosSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
        
        {loading ? (
          <div className="p-8 text-center">Carregando veículos...</div>
        ) : (
          <VeiculosTable 
            veiculos={filteredVeiculos}
            onInativar={handleInativarVeiculo}
            onDelete={handleDeleteVeiculo}
          />
        )}
        
        <VeiculosPagination 
          totalItems={veiculosData.length} 
          filteredItems={filteredVeiculos.length} 
        />
      </div>
    </PageLayout>
  );
};

export default Veiculos;
