
import React from 'react';
import { Receipt, Plus, MoreHorizontal, Search, Filter, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { logOperation } from '@/utils/logOperations';

const Canhotos = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Dados simulados
  const canhotos = [
    {
      id: 'CH-001',
      contrato: 'CT-002',
      dataEntrega: '10/06/2023',
      cliente: 'Distribuidora ABC',
      motorista: 'Pedro Alves',
      notasFiscais: ['NF-654321'],
      responsavelRecebimento: 'Maria Santos',
      status: 'Recebido'
    },
    {
      id: 'CH-002',
      contrato: 'CT-003',
      dataEntrega: '25/06/2023',
      cliente: 'Supermercados Norte',
      motorista: 'Carlos Ferreira',
      notasFiscais: ['NF-987654', 'NF-987655', 'NF-987656'],
      responsavelRecebimento: 'José Oliveira',
      status: 'Pendente'
    }
  ];

  const handleAddCanhoto = () => {
    logOperation('Abrir formulário', 'Formulário de novo canhoto aberto', true);
    toast.success('Funcionalidade a ser implementada');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleExportCanhotos = () => {
    logOperation('Exportar Canhotos', 'Iniciada exportação de canhotos', true);
    toast.success('Canhotos exportados com sucesso');
  };

  // Filtrar canhotos com base na busca
  const filteredCanhotos = canhotos.filter(canhoto => 
    canhoto.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    canhoto.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    canhoto.motorista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <PageHeader 
        title="Canhotos" 
        description="Gerenciamento de canhotos de entrega"
        icon={<Receipt size={28} className="text-sistema-primary" />}
      />

      {/* Barra de ações */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar canhotos..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={16} />
              <span className="hidden md:inline">Filtrar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportCanhotos}>
              <Download size={16} />
              <span className="hidden md:inline">Exportar</span>
            </Button>
            
            <Button variant="default" size="sm" className="ml-auto flex items-center gap-1" onClick={handleAddCanhoto}>
              <Plus size={16} />
              <span>Novo Canhoto</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabela de canhotos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notas Fiscais</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredCanhotos.length > 0 ? (
                filteredCanhotos.map((canhoto) => (
                  <tr key={canhoto.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{canhoto.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.contrato}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.dataEntrega}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.motorista}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {canhoto.notasFiscais.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        canhoto.status === 'Recebido' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {canhoto.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Imprimir</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <Receipt size={32} className="text-gray-400" />
                      <p>Nenhum canhoto encontrado</p>
                      {searchTerm && (
                        <Button variant="link" onClick={() => setSearchTerm('')}>
                          Limpar busca
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default Canhotos;
