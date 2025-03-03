
import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Edit, Trash2, UserCheck, UserX, Filter, Truck, User } from 'lucide-react';
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
  DialogClose,
} from '@/components/ui/dialog';
import MotoristaForm, { MotoristaData } from '@/components/motoristas/MotoristaForm';
import CadastroMotoristaForm from '@/components/contratos/CadastroMotoristaForm';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

// Interface para tipagem dos dados de motoristas
interface Driver {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  vencimento_cnh: string;
  status: 'active' | 'inactive';
  tipo: 'frota' | 'parceiro';
  proprietario_vinculado?: string;
  telefone: string;
  endereco: string;
  data_contratacao: string;
}

const Motoristas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'active' | 'inactive'>('todos');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'frota' | 'parceiro'>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  
  // Carregar motoristas do banco de dados
  useEffect(() => {
    carregarMotoristas();
  }, [filtroStatus, filtroTipo]);
  
  const carregarMotoristas = async () => {
    setLoading(true);
    try {
      let query = supabase.from('Motoristas').select('*');
      
      // Aplicar filtros
      if (filtroStatus !== 'todos') {
        query = query.eq('status', filtroStatus);
      }
      
      if (filtroTipo !== 'todos') {
        query = query.eq('tipo', filtroTipo);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Erro ao carregar motoristas:', error);
        toast.error('Erro ao carregar dados dos motoristas');
        return;
      }
      
      // Tratar datas para formato legível
      const formattedData = data?.map(item => ({
        ...item,
        vencimento_cnh: item.vencimento_cnh ? new Date(item.vencimento_cnh).toLocaleDateString('pt-BR') : '',
        data_contratacao: item.data_contratacao ? new Date(item.data_contratacao).toLocaleDateString('pt-BR') : ''
      })) || [];
      
      setDrivers(formattedData as Driver[]);
    } catch (error) {
      console.error('Erro ao processar dados:', error);
      toast.error('Ocorreu um erro ao processar os dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMotorista = async (data: MotoristaData) => {
    console.log('Motorista salvo:', data);
    
    // Atualizar a lista após salvar
    await carregarMotoristas();
    setIsDialogOpen(false);
  };

  const handleEditMotorista = async (data: { nome: string; cpf: string; tipo: 'frota' | 'terceiro' }) => {
    await carregarMotoristas();
    setIsEditDialogOpen(false);
  };
  
  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('Motoristas')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        console.error('Erro ao atualizar status:', error);
        toast.error('Erro ao atualizar status do motorista');
        return;
      }
      
      toast.success(`Motorista ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso`);
      await carregarMotoristas();
    } catch (error) {
      console.error('Erro ao processar atualização:', error);
      toast.error('Ocorreu um erro ao processar a atualização');
    }
  };
  
  const handleDeleteMotorista = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este motorista?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('Motoristas')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Erro ao excluir motorista:', error);
        toast.error('Erro ao excluir motorista');
        return;
      }
      
      toast.success('Motorista excluído com sucesso');
      await carregarMotoristas();
    } catch (error) {
      console.error('Erro ao processar exclusão:', error);
      toast.error('Ocorreu um erro ao processar a exclusão');
    }
  };

  const handleViewDetails = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsEditDialogOpen(true);
  };
  
  // Filtrar por termo de busca
  const filteredDrivers = drivers.filter(driver => 
    driver.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (driver.cpf && driver.cpf.includes(searchTerm))
  );

  // Formatar CPF para exibição
  const formatarCPF = (cpf: string | null) => {
    if (!cpf) return '-';
    
    // Se já estiver formatado, não refazer
    if (cpf.includes('.') || cpf.includes('-')) return cpf;
    
    // Remove caracteres não numéricos
    const numerosApenas = cpf.replace(/\D/g, '');
    
    // Verifica se é um CPF válido (11 dígitos)
    if (numerosApenas.length !== 11) return cpf;
    
    // Formata CPF: 000.000.000-00
    return numerosApenas
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                <DropdownMenuItem className="cursor-pointer font-bold text-gray-500" disabled>
                  Status
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setFiltroStatus('todos')}>
                  Todos os motoristas
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setFiltroStatus('active')}>
                  Ativos
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setFiltroStatus('inactive')}>
                  Inativos
                </DropdownMenuItem>
                
                <DropdownMenuItem className="cursor-pointer font-bold text-gray-500 mt-2" disabled>
                  Tipo
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setFiltroTipo('todos')}>
                  Todos os tipos
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setFiltroTipo('frota')}>
                  Frota Própria
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => setFiltroTipo('parceiro')}>
                  Parceiros/Terceiros
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex gap-2 w-full md:w-auto">
                <Plus size={16} />
                <span>Novo Motorista</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
              </DialogHeader>
              <div className="p-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Preencha os dados do novo motorista a ser cadastrado no sistema.
                </p>
                <MotoristaForm 
                  onSave={handleSaveMotorista} 
                  onCancel={() => setIsDialogOpen(false)} 
                />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-sistema-dark divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Carregando motoristas...
                    </td>
                  </tr>
                ) : filteredDrivers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Nenhum motorista encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{driver.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{driver.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{formatarCPF(driver.cpf)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{driver.cnh || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {driver.vencimento_cnh ? (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            new Date(driver.vencimento_cnh.split('/').reverse().join('-')) < new Date()
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          }`}>
                            {driver.vencimento_cnh}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={driver.tipo === 'frota' ? 'outline' : 'secondary'}
                          className="flex items-center gap-1"
                        >
                          {driver.tipo === 'frota' ? (
                            <><Truck size={14} /> Frota</>
                          ) : (
                            <><User size={14} /> Parceiro</>
                          )}
                        </Badge>
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            title="Visualizar detalhes"
                            onClick={() => handleViewDetails(driver)}
                          >
                            <FileText size={16} className="text-gray-500 dark:text-gray-400" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8" 
                            title="Editar motorista"
                            onClick={() => handleEditClick(driver)}
                          >
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
                              <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer" onClick={() => handleDeleteMotorista(driver.id)}>
                                <Trash2 size={16} className="mr-2" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                              {driver.status === 'active' ? (
                                <DropdownMenuItem 
                                  className="text-gray-600 dark:text-gray-400 cursor-pointer"
                                  onClick={() => handleStatusChange(driver.id, 'inactive')}
                                >
                                  <UserX size={16} className="mr-2" />
                                  <span>Desativar</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem 
                                  className="text-green-600 dark:text-green-400 cursor-pointer"
                                  onClick={() => handleStatusChange(driver.id, 'active')}
                                >
                                  <UserCheck size={16} className="mr-2" />
                                  <span>Ativar</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Paginação - será implementada quando necessário */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando <span className="font-medium">{filteredDrivers.length}</span> motoristas
            </div>
          </div>
        </div>
      </div>

      {/* Dialog para Visualização de Detalhes */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Motorista</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Nome:</h3>
                <p className="text-base">{selectedDriver.nome}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-gray-500">CPF:</h3>
                <p className="text-base">{formatarCPF(selectedDriver.cpf)}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500">Tipo:</h3>
                <Badge variant={selectedDriver.tipo === 'frota' ? 'outline' : 'secondary'}>
                  {selectedDriver.tipo === 'frota' ? 'Frota Própria' : 'Parceiro'}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500">Status:</h3>
                <Badge variant={selectedDriver.status === 'active' ? 'success' : 'secondary'}>
                  {selectedDriver.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {selectedDriver.cnh && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">CNH:</h3>
                  <p className="text-base">{selectedDriver.cnh}</p>
                </div>
              )}

              {selectedDriver.vencimento_cnh && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Vencimento CNH:</h3>
                  <p className="text-base">{selectedDriver.vencimento_cnh}</p>
                </div>
              )}

              {selectedDriver.telefone && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Telefone:</h3>
                  <p className="text-base">{selectedDriver.telefone}</p>
                </div>
              )}

              {selectedDriver.data_contratacao && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Data de Contratação:</h3>
                  <p className="text-base">{selectedDriver.data_contratacao}</p>
                </div>
              )}

              {selectedDriver.endereco && (
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500">Endereço:</h3>
                  <p className="text-base">{selectedDriver.endereco}</p>
                </div>
              )}

              {selectedDriver.proprietario_vinculado && (
                <div className="col-span-2">
                  <h3 className="text-sm font-semibold text-gray-500">Proprietário Vinculado:</h3>
                  <p className="text-base">{selectedDriver.proprietario_vinculado}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <Button onClick={() => setIsViewDialogOpen(false)}>Fechar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog para Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Motorista</DialogTitle>
          </DialogHeader>
          {selectedDriver && (
            <CadastroMotoristaForm 
              onSave={handleEditMotorista} 
              onCancel={() => setIsEditDialogOpen(false)}
              motorista={{
                id: selectedDriver.id,
                nome: selectedDriver.nome,
                cpf: selectedDriver.cpf,
                tipo: selectedDriver.tipo === 'frota' ? 'frota' : 'terceiro'
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Motoristas;
