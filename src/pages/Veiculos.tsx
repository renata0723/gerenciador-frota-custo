
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Truck, Plus, Search, Filter, Download, Trash, Edit, Eye, AlertTriangle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import VeiculosTable from '@/components/veiculos/VeiculosTable';
import VeiculosStats from '@/components/veiculos/VeiculosStats';

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [veiculosData, setVeiculosData] = useState([
    { 
      id: 1, 
      placa: 'ABC-1234', 
      tipo: 'Cavalo', 
      modelo: 'Scania R450', 
      ano: 2020, 
      status: 'Ativo', 
      frota: 'Própria',
      inativacao: null
    },
    { 
      id: 2, 
      placa: 'DEF-5678', 
      tipo: 'Carreta', 
      modelo: 'Randon SR GS', 
      ano: 2019, 
      status: 'Ativo', 
      frota: 'Própria',
      inativacao: null
    },
    { 
      id: 3, 
      placa: 'GHI-9012', 
      tipo: 'Cavalo', 
      modelo: 'Volvo FH 460', 
      ano: 2021, 
      status: 'Inativo', 
      frota: 'Própria',
      inativacao: { 
        data: '2023-07-15', 
        motivo: 'Manutenção prolongada' 
      }
    },
    { 
      id: 4, 
      placa: 'JKL-3456', 
      tipo: 'Carreta', 
      modelo: 'Librelato LS3', 
      ano: 2018, 
      status: 'Ativo', 
      frota: 'Terceirizada',
      inativacao: null
    },
    { 
      id: 5, 
      placa: 'MNO-7890', 
      tipo: 'Cavalo', 
      modelo: 'Mercedes Actros', 
      ano: 2022, 
      status: 'Inativo', 
      frota: 'Terceirizada',
      inativacao: { 
        data: '2023-09-20', 
        motivo: 'Contrato encerrado' 
      }
    },
  ]);

  // Filtrar veículos pelo termo de busca
  const filteredVeiculos = veiculosData.filter(veiculo => 
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInativarVeiculo = (id, motivo, data) => {
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
    
    toast({
      title: "Veículo inativado",
      description: "O veículo foi inativado com sucesso!",
    });
  };

  const handleDeleteVeiculo = (id) => {
    setVeiculosData(veiculos => veiculos.filter(veiculo => veiculo.id !== id));
    
    toast({
      title: "Veículo excluído",
      description: "O veículo foi excluído com sucesso!",
      variant: "destructive"
    });
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Veículos" 
        description="Gerencie sua frota de veículos"
        icon={<Truck size={26} className="text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos' }
        ]}
        actions={
          <>
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
        
        <VeiculosTable 
          veiculos={filteredVeiculos}
          onInativar={handleInativarVeiculo}
          onDelete={handleDeleteVeiculo}
        />
        
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
