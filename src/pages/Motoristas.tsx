
import React from 'react';
import { Plus, Search, FileText, Edit, Trash2, UserCheck, UserX, Filter } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Interface para tipagem dos dados de motoristas
interface Driver {
  id: string;
  name: string;
  document: string;
  license: string;
  licenseExpiry: string;
  status: 'active' | 'inactive';
  phone: string;
  address: string;
  hiringDate: string;
}

const Motoristas = () => {
  // Dados simulados para a tabela de motoristas
  const drivers: Driver[] = [
    {
      id: 'M001',
      name: 'João da Silva',
      document: '123.456.789-00',
      license: 'E12345678',
      licenseExpiry: '12/05/2024',
      status: 'active',
      phone: '(11) 98765-4321',
      address: 'Av. Paulista, 1000, São Paulo - SP',
      hiringDate: '10/01/2020',
    },
    {
      id: 'M002',
      name: 'Maria Oliveira',
      document: '987.654.321-00',
      license: 'D98765432',
      licenseExpiry: '23/07/2023',
      status: 'inactive',
      phone: '(11) 91234-5678',
      address: 'Rua Augusta, 500, São Paulo - SP',
      hiringDate: '05/03/2019',
    },
    {
      id: 'M003',
      name: 'Pedro Santos',
      document: '456.789.123-00',
      license: 'E45678912',
      licenseExpiry: '30/11/2024',
      status: 'active',
      phone: '(11) 97654-3210',
      address: 'Av. Rebouças, 750, São Paulo - SP',
      hiringDate: '15/06/2021',
    },
    {
      id: 'M004',
      name: 'Ana Pereira',
      document: '789.123.456-00',
      license: 'D78912345',
      licenseExpiry: '18/03/2025',
      status: 'active',
      phone: '(11) 95432-1098',
      address: 'Rua Oscar Freire, 300, São Paulo - SP',
      hiringDate: '22/09/2022',
    },
    {
      id: 'M005',
      name: 'Carlos Fernandes',
      document: '321.654.987-00',
      license: 'E32165498',
      licenseExpiry: '05/08/2023',
      status: 'inactive',
      phone: '(11) 99876-5432',
      address: 'Av. Brigadeiro Faria Lima, 1500, São Paulo - SP',
      hiringDate: '14/02/2018',
    },
  ];

  return (
    <PageLayout>
      <PageHeader 
        title="Motoristas" 
        description="Gerenciamento de motoristas da frota"
      />

      <div className="flex flex-col space-y-6">
        {/* Área de filtros e ações */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Buscar motorista..." 
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex gap-2">
                  <Filter size={16} />
                  <span>Filtros</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  Todos os motoristas
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Ativos
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  Inativos
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  CNH a vencer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex gap-2 w-full md:w-auto">
                <Plus size={16} />
                <span>Novo Motorista</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
              </DialogHeader>
              <div className="p-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Preencha os dados do novo motorista a ser cadastrado no sistema.
                </p>
                <div className="grid gap-4">
                  <p className="text-gray-600 dark:text-gray-300 text-xs font-semibold">
                    Formulário não implementado nesta versão
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de motoristas */}
        <div className="bg-white dark:bg-sistema-dark shadow-md rounded-lg overflow-hidden border border-gray-100 dark:border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Documento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CNH</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vencimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-sistema-dark divide-y divide-gray-200 dark:divide-gray-700">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{driver.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{driver.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{driver.document}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{driver.license}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        new Date(driver.licenseExpiry.split('/').reverse().join('-')) < new Date()
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {driver.licenseExpiry}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        driver.status === 'active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                      }`}>
                        {driver.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Visualizar detalhes">
                          <FileText size={16} className="text-gray-500 dark:text-gray-400" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Editar motorista">
                          <Edit size={16} className="text-blue-500 dark:text-blue-400" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <span className="sr-only">Abrir menu</span>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer">
                              <Trash2 size={16} className="mr-2" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                            {driver.status === 'active' ? (
                              <DropdownMenuItem className="text-gray-600 dark:text-gray-400 cursor-pointer">
                                <UserX size={16} className="mr-2" />
                                <span>Desativar</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600 dark:text-green-400 cursor-pointer">
                                <UserCheck size={16} className="mr-2" />
                                <span>Ativar</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Paginação */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando <span className="font-medium">5</span> de <span className="font-medium">24</span> motoristas
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" className="bg-sistema-primary text-white hover:bg-sistema-primary/90">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Próximo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Motoristas;
