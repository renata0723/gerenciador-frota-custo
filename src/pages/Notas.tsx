
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { FileText, Plus, Search, Filter, DownloadCloud, Upload, MoreHorizontal, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Notas = () => {
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  
  // Dados simulados de notas fiscais
  const [notasFiscais, setNotasFiscais] = useState([
    { id: 'NF-12345', emissao: '15/06/2023', cliente: 'Empresa ABC Ltda', origem: 'São Paulo, SP', destino: 'Rio de Janeiro, RJ', valor: 'R$ 15.450,00', status: 'Finalizada' },
    { id: 'NF-12346', emissao: '18/06/2023', cliente: 'Distribuidora XYZ', origem: 'Curitiba, PR', destino: 'Florianópolis, SC', valor: 'R$ 8.720,50', status: 'Em trânsito' },
    { id: 'NF-12347', emissao: '20/06/2023', cliente: 'Indústria MNO', origem: 'Belo Horizonte, MG', destino: 'Brasília, DF', valor: 'R$ 22.150,00', status: 'Agendada' },
    { id: 'NF-12348', emissao: '22/06/2023', cliente: 'Comércio RST', origem: 'Salvador, BA', destino: 'Recife, PE', valor: 'R$ 5.890,75', status: 'Finalizada' },
    { id: 'NF-12349', emissao: '25/06/2023', cliente: 'Atacadista QWE', origem: 'Manaus, AM', destino: 'Belém, PA', valor: 'R$ 18.430,20', status: 'Em trânsito' },
    { id: 'NF-12350', emissao: '27/06/2023', cliente: 'Empresa DEF S.A.', origem: 'Porto Alegre, RS', destino: 'Curitiba, PR', valor: 'R$ 12.780,00', status: 'Agendada' },
    { id: 'NF-12351', emissao: '01/07/2023', cliente: 'Distribuidora GHI', origem: 'Goiânia, GO', destino: 'Brasília, DF', valor: 'R$ 7.650,25', status: 'Finalizada' },
    { id: 'NF-12352', emissao: '03/07/2023', cliente: 'Indústria JKL', origem: 'Fortaleza, CE', destino: 'Natal, RN', valor: 'R$ 9.340,00', status: 'Em trânsito' },
  ]);

  // Função para importar notas
  const handleImportarNotas = () => {
    toast.success("Importação iniciada", {
      description: "A importação de notas foi iniciada com sucesso."
    });
  };

  // Função para exportar notas
  const handleExportarNotas = () => {
    toast.success("Exportação concluída", {
      description: "As notas foram exportadas com sucesso."
    });
  };

  // Função para adicionar nova nota
  const handleAddNota = () => {
    toast.info("Nova nota", {
      description: "Formulário de nova nota fiscal aberto."
    });
    // Em um sistema real isso redirecionaria para a página de criação
    // navigate('/notas/nova');
  };

  // Filtrar notas com base na busca
  const filteredNotas = notasFiscais.filter(nota => 
    nota.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nota.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nota.origem.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nota.destino.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nota.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Função para definir a cor do status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Finalizada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Em trânsito':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Agendada':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  // Função para editar nota
  const handleEditNote = (nota) => {
    toast.info(`Editando nota fiscal ${nota.id}`);
    // Em um sistema real isso redirecionaria para a página de edição com o ID
    // navigate(`/notas/editar/${nota.id}`);
  };

  // Função para excluir nota
  const handleDeleteNote = (nota) => {
    setSelectedNote(nota);
    setIsDeleteDialogOpen(true);
  };

  // Função para confirmar exclusão
  const confirmDelete = () => {
    if (selectedNote) {
      setNotasFiscais(notasFiscais.filter(nota => nota.id !== selectedNote.id));
      toast.success(`Nota fiscal ${selectedNote.id} excluída com sucesso`);
      setIsDeleteDialogOpen(false);
      setSelectedNote(null);
    }
  };

  // Função para ver detalhes da nota
  const handleViewDetails = (nota) => {
    setSelectedNote(nota);
    setIsDetailsDialogOpen(true);
  };

  // Função para imprimir nota
  const handlePrintNote = (nota) => {
    toast.info(`Preparando impressão da nota fiscal ${nota.id}`);
  };

  return (
    <PageLayout>
      <PageHeader 
        title="Entrada de Notas" 
        description="Gerenciamento de notas fiscais e fretes"
        icon={<FileText size={28} className="text-sistema-primary" />}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              className="pl-10"
              placeholder="Buscar notas fiscais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter size={16} />
              <span className="hidden md:inline">Filtrar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportarNotas}>
              <DownloadCloud size={16} />
              <span className="hidden md:inline">Exportar</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleImportarNotas}>
              <Upload size={16} />
              <span className="hidden md:inline">Importar</span>
            </Button>
            
            <Button variant="default" size="sm" className="ml-auto flex items-center gap-1" onClick={handleAddNota}>
              <Plus size={16} />
              <span>Nova Nota</span>
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full table-default">
            <thead className="table-head">
              <tr>
                <th className="table-header-cell">Nº Nota</th>
                <th className="table-header-cell">Emissão</th>
                <th className="table-header-cell">Cliente</th>
                <th className="table-header-cell">Origem</th>
                <th className="table-header-cell">Destino</th>
                <th className="table-header-cell">Valor</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotas.length > 0 ? (
                filteredNotas.map((nota) => (
                  <tr key={nota.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="table-cell font-medium">{nota.id}</td>
                    <td className="table-cell">{nota.emissao}</td>
                    <td className="table-cell">{nota.cliente}</td>
                    <td className="table-cell">{nota.origem}</td>
                    <td className="table-cell">{nota.destino}</td>
                    <td className="table-cell">{nota.valor}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(nota.status)}`}>
                        {nota.status}
                      </span>
                    </td>
                    <td className="table-cell text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewDetails(nota)}>
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditNote(nota)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePrintNote(nota)}>
                            Imprimir
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteNote(nota)}
                          >
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="table-cell text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText size={32} className="text-gray-400" />
                      <p>Nenhuma nota fiscal encontrada</p>
                      {searchQuery && (
                        <Button variant="link" onClick={() => setSearchQuery('')}>
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
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium">{filteredNotas.length}</span> de <span className="font-medium">{notasFiscais.length}</span> notas
          </p>
          
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" className="bg-sistema-primary text-white hover:bg-sistema-primary/90">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">Próxima</Button>
          </div>
        </div>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a nota fiscal {selectedNote?.id}?
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para exibição de detalhes */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-sistema-primary" />
              Detalhes da Nota {selectedNote?.id}
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas da nota fiscal.
            </DialogDescription>
          </DialogHeader>
          
          {selectedNote && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Cliente:</span>
                <span className="col-span-3">{selectedNote.cliente}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Emissão:</span>
                <span className="col-span-3">{selectedNote.emissao}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Origem:</span>
                <span className="col-span-3">{selectedNote.origem}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Destino:</span>
                <span className="col-span-3">{selectedNote.destino}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Valor:</span>
                <span className="col-span-3">{selectedNote.valor}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedNote.status)}`}>
                    {selectedNote.status}
                  </span>
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" onClick={() => setIsDetailsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Notas;
