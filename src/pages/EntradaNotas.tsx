import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { FileText, Plus, Search, Filter, Download, Trash, Edit, Info, AlertCircle, Pencil } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { logOperation } from '@/utils/logOperations';
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

interface NotaFiscal {
  id: string;
  date: string;
  client: string;
  destination: string;
  deliveryDate: string;
  value: string;
  status: string;
  password?: string;
  volume?: string;
  weight?: string;
  palletsPerNote?: string;
  totalPallets?: string;
  cargoType?: string;
  cargoQuantity?: string;
  quotationValue?: string;
  vehicleType?: string;
}

const STORAGE_KEY = 'controlfrota_notas_fiscais';
const ITEMS_PER_PAGE = 6;

const EntradaNotas = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<NotaFiscal | null>(null);
  const [isDuplicateWarningOpen, setIsDuplicateWarningOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const dadosIniciaisNotas: NotaFiscal[] = [
    { id: 'NF-12345', date: '10/04/2023', client: 'Empresa ABC Ltda', destination: 'São Paulo, SP', deliveryDate: '15/04/2023', value: 'R$ 15.450,00', status: 'Em trânsito' },
    { id: 'NF-12346', date: '11/04/2023', client: 'Distribuidora XYZ', destination: 'Rio de Janeiro, RJ', deliveryDate: '18/04/2023', value: 'R$ 8.720,50', status: 'Entregue' },
    { id: 'NF-12347', date: '12/04/2023', client: 'Indústria MNO', destination: 'Curitiba, PR', deliveryDate: '19/04/2023', value: 'R$ 22.150,00', status: 'Agendado' },
    { id: 'NF-12348', date: '13/04/2023', client: 'Comércio RST', destination: 'Belo Horizonte, MG', deliveryDate: '20/04/2023', value: 'R$ 5.890,75', status: 'Em trânsito' },
    { id: 'NF-12349', date: '14/04/2023', client: 'Atacadista UVW', destination: 'Salvador, BA', deliveryDate: '21/04/2023', value: 'R$ 12.540,30', status: 'Entregue' },
  ];

  const [notesData, setNotesData] = useState<NotaFiscal[]>([]);

  useEffect(() => {
    const storedNotes = localStorage.getItem(STORAGE_KEY);
    if (storedNotes) {
      setNotesData(JSON.parse(storedNotes));
    } else {
      setNotesData(dadosIniciaisNotas);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosIniciaisNotas));
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.updatedNote) {
      const updatedNote = location.state.updatedNote;
      
      setNotesData(current => {
        const updated = current.map(note => 
          note.id === updatedNote.id ? updatedNote : note
        );
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
      
      toast.success(`Nota fiscal ${updatedNote.id} atualizada com sucesso`);
      window.history.replaceState({}, document.title);
      logOperation('EntradaNotas', `Atualizou nota fiscal ${updatedNote.id}`, 'true');
    }
    
    if (location.state && location.state.newNote) {
      const newNote = location.state.newNote;
      
      setNotesData(current => {
        const noteExists = current.some(note => note.id === newNote.id);
        
        if (noteExists) {
          toast.error(`Nota fiscal ${newNote.id} já existe`);
          return current;
        }
        
        const updated = [newNote, ...current];
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
        
        return updated;
      });
      
      toast.success(`Nota fiscal ${newNote.id} cadastrada com sucesso`);
      window.history.replaceState({}, document.title);
      logOperation('EntradaNotas', `Cadastrou nova nota fiscal ${newNote.id}`, 'true');
    }
  }, [location]);

  const filteredNotes = notesData.filter(note => 
    note.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(filteredNotes.length / ITEMS_PER_PAGE)));
    setCurrentPage(1);
  }, [filteredNotes.length]);

  const getCurrentPageNotes = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredNotes.slice(startIndex, endIndex);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleAddNote = () => {
    logOperation('EntradaNotas', 'Iniciou o cadastro de nova nota fiscal', 'false');
  };

  const verificarNotaDuplicada = (numeroNota: string) => {
    return notesData.some(note => note.id === numeroNota);
  };

  const handleDeleteClick = (note: NotaFiscal) => {
    setSelectedNote(note);
    setIsDeleteDialogOpen(true);
    logOperation('EntradaNotas', `Iniciou exclusão da nota fiscal ${note.id}`, 'false');
  };

  const confirmDelete = () => {
    if (selectedNote) {
      const updatedNotes = notesData.filter(note => note.id !== selectedNote.id);
      setNotesData(updatedNotes);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event('storage'));
      
      toast.success(`Nota fiscal ${selectedNote.id} excluída com sucesso`);
      logOperation('EntradaNotas', `Excluiu nota fiscal ${selectedNote.id}`, 'true');
      setIsDeleteDialogOpen(false);
      setSelectedNote(null);
    }
  };

  const handleEditClick = (note: NotaFiscal) => {
    logOperation('EntradaNotas', `Iniciou edição da nota fiscal ${note.id}`, 'false');
    toast.info(`Iniciando edição da nota fiscal ${note.id}`);
    navigate(`/entrada-notas/editar/${note.id}`, { state: { noteData: note } });
  };

  const handleDetailsClick = (note: NotaFiscal) => {
    setSelectedNote(note);
    setIsDetailsDialogOpen(true);
    logOperation('EntradaNotas', `Visualizou detalhes da nota fiscal ${note.id}`, 'false');
  };

  const handleQuickSave = (updatedNote: NotaFiscal) => {
    setNotesData(current => {
      const updated = current.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event('storage'));
      
      return updated;
    });
    
    toast.success(`Nota fiscal ${updatedNote.id} atualizada com sucesso`);
    logOperation('EntradaNotas', `Atualizou rápida de nota fiscal ${updatedNote.id}`, 'true');
  };

  const resetToInitialData = () => {
    setNotesData(dadosIniciaisNotas);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosIniciaisNotas));
    
    window.dispatchEvent(new Event('storage'));
    
    toast.success('Dados das notas fiscais foram restaurados para o padrão inicial');
    logOperation('EntradaNotas', 'Restaurou dados iniciais das notas fiscais', 'true');
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (pageNumbers.indexOf(i) === -1) {
          pageNumbers.push(i);
        }
      }
      
      if (pageNumbers.indexOf(totalPages) === -1) {
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const currentPageNotes = getCurrentPageNotes();

  return (
    <PageLayout>
      <PageHeader 
        title="Entrada de Notas" 
        description="Gerenciamento de notas fiscais e fretes"
        icon={<FileText className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Entrada de Notas' }
        ]}
        actions={
          <Link to="/entrada-notas/nova" onClick={handleAddNote}>
            <Button className="bg-sistema-primary hover:bg-sistema-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Nova Nota
            </Button>
          </Link>
        }
      />

      <div className="bg-white dark:bg-sistema-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-8 animate-fade-in">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <Input
                type="text"
                className="pl-10 w-full"
                placeholder="Buscar notas fiscais..."
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
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">Nº Nota</th>
                <th scope="col" className="px-6 py-3">Data Coleta</th>
                <th scope="col" className="px-6 py-3">Cliente</th>
                <th scope="col" className="px-6 py-3">Destino</th>
                <th scope="col" className="px-6 py-3">Data Entrega</th>
                <th scope="col" className="px-6 py-3">Valor</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentPageNotes.length > 0 ? (
                currentPageNotes.map((note) => (
                  <tr key={note.id} className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <Link 
                        to={`/entrada-notas/editar/${note.id}`} 
                        state={{ noteData: note }}
                        className="text-sistema-primary hover:underline"
                      >
                        {note.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{note.date}</td>
                    <td className="px-6 py-4">{note.client}</td>
                    <td className="px-6 py-4">{note.destination}</td>
                    <td className="px-6 py-4">{note.deliveryDate}</td>
                    <td className="px-6 py-4">{note.value}</td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button 
                          className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" 
                          title="Editar"
                          onClick={() => handleEditClick(note)}
                        >
                          <Pencil size={18} />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-red-500 transition-colors duration-200" 
                          title="Excluir"
                          onClick={() => handleDeleteClick(note)}
                        >
                          <Trash size={18} />
                        </button>
                        <button 
                          className="text-gray-500 hover:text-blue-500 transition-colors duration-200" 
                          title="Detalhes"
                          onClick={() => handleDetailsClick(note)}
                        >
                          <Info size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
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
        
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {Math.min(filteredNotes.length, currentPageNotes.length)} de {filteredNotes.length} notas
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            
            {getPageNumbers().map(page => (
              <Button 
                key={page}
                variant={currentPage === page ? "default" : "outline"} 
                size="sm" 
                className={currentPage === page ? "bg-sistema-primary hover:bg-sistema-primary/90" : ""}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Próximo
            </Button>
          </div>
        </div>
      </div>

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
                <span className="col-span-3">{selectedNote.client}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data Coleta:</span>
                <span className="col-span-3">{selectedNote.date}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Destino:</span>
                <span className="col-span-3">{selectedNote.destination}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data Entrega:</span>
                <span className="col-span-3">{selectedNote.deliveryDate}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Valor:</span>
                <span className="col-span-3">{selectedNote.value}</span>
              </div>
              {selectedNote.password && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Senha/Agendamento:</span>
                  <span className="col-span-3">{selectedNote.password}</span>
                </div>
              )}
              {selectedNote.volume && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Volume (m³):</span>
                  <span className="col-span-3">{selectedNote.volume}</span>
                </div>
              )}
              {selectedNote.weight && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Peso (kg):</span>
                  <span className="col-span-3">{selectedNote.weight}</span>
                </div>
              )}
              {selectedNote.cargoType && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Tipo de Carga:</span>
                  <span className="col-span-3">{selectedNote.cargoType === 'paletizada' ? 'Paletizada' : 'Batida'}</span>
                </div>
              )}
              {selectedNote.vehicleType && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Veículo:</span>
                  <span className="col-span-3">{selectedNote.vehicleType}</span>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedNote.status === 'Entregue' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : selectedNote.status === 'Em trânsito'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
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

      <AlertDialog open={isDuplicateWarningOpen} onOpenChange={setIsDuplicateWarningOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Nota Fiscal Duplicada
            </AlertDialogTitle>
            <AlertDialogDescription>
              A nota fiscal já está cadastrada no sistema. 
              Não é possível cadastrar a mesma nota fiscal duas vezes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsDuplicateWarningOpen(false)}>
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default EntradaNotas;
