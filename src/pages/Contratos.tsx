
import React, { useState } from 'react';
import { Plus, FileText, MoreHorizontal, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import PageLayout from '../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Contract {
  id: string;
  name: string;
  cliente: string;
  status: 'Ativo' | 'Encerrado' | 'Pendente';
  inicio: string;
  fim: string;
  valor: string;
}

const Contratos = () => {
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      name: 'Contrato de Transporte - Mensal',
      cliente: 'Distribuidora ABC Ltda',
      status: 'Ativo',
      inicio: '01/01/2023',
      fim: '31/12/2023',
      valor: 'R$ 25.000,00',
    },
    {
      id: '2',
      name: 'Contrato de Entrega - Trimestral',
      cliente: 'Supermercados XYZ',
      status: 'Ativo',
      inicio: '15/03/2023',
      fim: '15/12/2023',
      valor: 'R$ 18.500,00',
    },
    {
      id: '3',
      name: 'Transporte de Carga Especial',
      cliente: 'Indústrias JKL S.A.',
      status: 'Encerrado',
      inicio: '10/06/2022',
      fim: '10/06/2023',
      valor: 'R$ 42.000,00',
    },
    {
      id: '4',
      name: 'Contrato Logístico Anual',
      cliente: 'Farmacêutica MNO',
      status: 'Pendente',
      inicio: '01/07/2023',
      fim: '30/06/2024',
      valor: 'R$ 120.000,00',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Função para registrar operações
  const logOperation = (operation: string, details: string) => {
    console.log(`[${new Date().toISOString()}] ${operation}: ${details}`);
    // Aqui poderíamos enviar para um backend ou armazenar em localStorage
    toast.success(`Operação registrada: ${operation}`);
  };

  const handleAddContract = () => {
    // Implementação futura - Modal para adicionar contrato
    logOperation('Adicionar Contrato', 'Iniciou processo de adição de contrato');
    toast.info('Funcionalidade de adicionar contrato será implementada em breve');
  };

  const handleViewContract = (contractId: string) => {
    logOperation('Visualizar Contrato', `Contrato ID: ${contractId}`);
    toast.info(`Visualizando detalhes do contrato ${contractId}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    logOperation('Pesquisar Contratos', `Termo: ${e.target.value}`);
  };

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.cliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout title="Contratos" description="Gerencie todos os contratos da sua frota">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="search"
            placeholder="Buscar contratos..."
            className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-4 text-sm focus:border-sistema-primary focus:outline-none focus:ring-1 focus:ring-sistema-primary dark:border-gray-800 dark:bg-sistema-dark dark:text-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10">
            <Filter className="mr-2 h-4 w-4" />
            Filtrar
          </Button>
          <Button onClick={handleAddContract} size="sm" className="h-10">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-sistema-dark">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contrato</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data Início</TableHead>
              <TableHead>Data Fim</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-sistema-primary"
                    onClick={() => handleViewContract(contract.id)}
                  >
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-gray-400" />
                      {contract.name}
                    </div>
                  </TableCell>
                  <TableCell>{contract.cliente}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        contract.status === 'Ativo'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : contract.status === 'Pendente'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                      }`}
                    >
                      {contract.status}
                    </span>
                  </TableCell>
                  <TableCell>{contract.inicio}</TableCell>
                  <TableCell>{contract.fim}</TableCell>
                  <TableCell>{contract.valor}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleViewContract(contract.id)}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum contrato encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
};

export default Contratos;
