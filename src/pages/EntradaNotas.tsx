
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { FileText, Plus, Search, Filter, Download, Trash, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const EntradaNotas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dados simulados de notas
  const notesData = [
    { id: 'NF-12345', date: '10/04/2023', client: 'Empresa ABC Ltda', destination: 'São Paulo, SP', deliveryDate: '15/04/2023', value: 'R$ 15.450,00', status: 'Em trânsito' },
    { id: 'NF-12346', date: '11/04/2023', client: 'Distribuidora XYZ', destination: 'Rio de Janeiro, RJ', deliveryDate: '18/04/2023', value: 'R$ 8.720,50', status: 'Entregue' },
    { id: 'NF-12347', date: '12/04/2023', client: 'Indústria MNO', destination: 'Curitiba, PR', deliveryDate: '19/04/2023', value: 'R$ 22.150,00', status: 'Agendado' },
    { id: 'NF-12348', date: '13/04/2023', client: 'Comércio RST', destination: 'Belo Horizonte, MG', deliveryDate: '20/04/2023', value: 'R$ 5.890,75', status: 'Em trânsito' },
    { id: 'NF-12349', date: '14/04/2023', client: 'Atacadista UVW', destination: 'Salvador, BA', deliveryDate: '21/04/2023', value: 'R$ 12.540,30', status: 'Entregue' },
  ];

  // Filtrar notas pelo termo de busca
  const filteredNotes = notesData.filter(note => 
    note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <PageHeader 
        title="Entrada de Notas" 
        description="Gerencie notas fiscais e coletas de carga"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Entrada de Notas' }
        ]}
        actions={
          <Link 
            to="/notas/nova" 
            className="btn-primary flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Nova Nota
          </Link>
        }
      />

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
                placeholder="Buscar notas..."
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
                <th className="table-header-cell">Nº Nota</th>
                <th className="table-header-cell">Data Coleta</th>
                <th className="table-header-cell">Cliente</th>
                <th className="table-header-cell">Destino</th>
                <th className="table-header-cell">Data Entrega</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotes.map((note) => (
                <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  <td className="table-cell font-medium">{note.id}</td>
                  <td className="table-cell">{note.date}</td>
                  <td className="table-cell">{note.client}</td>
                  <td className="table-cell">{note.destination}</td>
                  <td className="table-cell">{note.deliveryDate}</td>
                  <td className="table-cell">{note.value}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      note.status === 'Entregue' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : note.status === 'Em trânsito'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {note.status}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
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
              
              {filteredNotes.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={32} className="mb-2 text-gray-400" />
                      <p>Nenhuma nota fiscal encontrada</p>
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
              Mostrando {filteredNotes.length} de {notesData.length} notas
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
              2
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

export default EntradaNotas;
