
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Truck, Plus, Search, Filter, Download, Trash, Edit, Eye, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Veiculos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados simulados de veículos
  const veiculosData = [
    { id: 1, placa: 'ABC-1234', tipo: 'Cavalo', modelo: 'Scania R450', ano: 2020, status: 'Ativo', frota: 'Própria' },
    { id: 2, placa: 'DEF-5678', tipo: 'Carreta', modelo: 'Randon SR GS', ano: 2019, status: 'Ativo', frota: 'Própria' },
    { id: 3, placa: 'GHI-9012', tipo: 'Cavalo', modelo: 'Volvo FH 460', ano: 2021, status: 'Em manutenção', frota: 'Própria' },
    { id: 4, placa: 'JKL-3456', tipo: 'Carreta', modelo: 'Librelato LS3', ano: 2018, status: 'Ativo', frota: 'Terceirizada' },
    { id: 5, placa: 'MNO-7890', tipo: 'Cavalo', modelo: 'Mercedes Actros', ano: 2022, status: 'Inativo', frota: 'Terceirizada' },
  ];

  // Filtrar veículos pelo termo de busca
  const filteredVeiculos = veiculosData.filter(veiculo => 
    veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <PageHeader 
        title="Veículos" 
        description="Gerencie sua frota de veículos"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Veículos' }
        ]}
        actions={
          <Link 
            to="/veiculos/novo" 
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Novo Veículo
          </Link>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-sistema-dark rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 dark:bg-blue-900/30">
              <Truck className="text-blue-700 dark:text-blue-400" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Veículos</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{veiculosData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-sistema-dark rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100 dark:bg-green-900/30">
              <Truck className="text-green-700 dark:text-green-400" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Frota Própria</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {veiculosData.filter(v => v.frota === 'Própria').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-sistema-dark rounded-xl p-6 border border-gray-100 dark:border-gray-800 shadow-card">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-yellow-100 dark:bg-yellow-900/30">
              <AlertTriangle className="text-yellow-700 dark:text-yellow-400" size={20} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Em Manutenção</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {veiculosData.filter(v => v.status === 'Em manutenção').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-card border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 animate-fade-in">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="input-field pl-10 w-full"
                placeholder="Buscar veículos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="btn-outline flex items-center">
                <Filter size={16} className="mr-2" />
                Filtrar
              </button>
              <button className="btn-outline flex items-center">
                <Download size={16} className="mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>
        
        <div className="table-container">
          <table className="table-default">
            <thead className="table-head">
              <tr>
                <th className="table-header-cell">Placa</th>
                <th className="table-header-cell">Tipo</th>
                <th className="table-header-cell">Modelo</th>
                <th className="table-header-cell">Ano</th>
                <th className="table-header-cell">Frota</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVeiculos.map((veiculo) => (
                <tr key={veiculo.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  <td className="table-cell font-medium">{veiculo.placa}</td>
                  <td className="table-cell">{veiculo.tipo}</td>
                  <td className="table-cell">{veiculo.modelo}</td>
                  <td className="table-cell">{veiculo.ano}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      veiculo.frota === 'Própria' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {veiculo.frota}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      veiculo.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : veiculo.status === 'Em manutenção'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {veiculo.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" title="Visualizar">
                        <Eye size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" title="Editar">
                        <Edit size={18} />
                      </button>
                      <button className="text-gray-500 hover:text-red-500 transition-colors duration-200" title="Excluir">
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredVeiculos.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Truck size={32} className="mb-2 text-gray-400" />
                      <p>Nenhum veículo encontrado</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {filteredVeiculos.length} de {veiculosData.length} veículos
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
              Anterior
            </button>
            <button className="px-3 py-1 rounded bg-sistema-primary text-white hover:bg-sistema-primary-dark">
              1
            </button>
            <button className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
              Próximo
            </button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Veiculos;
