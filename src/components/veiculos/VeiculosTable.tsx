
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash, AlertCircle, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VeiculosTableProps {
  veiculos: any[];
  onInativar: (id: number, motivo: string, data: string) => void;
  onDelete: (id: number) => void;
}

const VeiculosTable: React.FC<VeiculosTableProps> = ({ veiculos, onInativar, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inativarDialogOpen, setInativarDialogOpen] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<number | null>(null);
  const [motivoInativacao, setMotivoInativacao] = useState('');
  const [dataInativacao, setDataInativacao] = useState(new Date().toISOString().split('T')[0]);

  const handleDeleteClick = (id: number) => {
    setSelectedVeiculo(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedVeiculo !== null) {
      onDelete(selectedVeiculo);
      setDeleteDialogOpen(false);
    }
  };

  const handleInativarClick = (id: number) => {
    setSelectedVeiculo(id);
    setInativarDialogOpen(true);
  };

  const handleInativarConfirm = () => {
    if (selectedVeiculo !== null && motivoInativacao.trim() !== '') {
      onInativar(selectedVeiculo, motivoInativacao, dataInativacao);
      setInativarDialogOpen(false);
      setMotivoInativacao('');
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Placa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modelo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ano</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frota</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {veiculos.length > 0 ? (
              veiculos.map((veiculo) => (
                <tr key={veiculo.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{veiculo.placa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{veiculo.tipo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{veiculo.modelo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{veiculo.ano}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      veiculo.frota === 'Própria' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {veiculo.frota}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      veiculo.status === 'Ativo' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {veiculo.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <Link to={`/veiculos/editar/${veiculo.id}`} className="text-gray-500 hover:text-sistema-primary transition-colors duration-200" title="Editar">
                        <Edit size={18} />
                      </Link>

                      {veiculo.status === 'Ativo' && (
                        <button 
                          onClick={() => handleInativarClick(veiculo.id)}
                          className="text-yellow-500 hover:text-yellow-600 transition-colors duration-200" 
                          title="Inativar"
                        >
                          <AlertCircle size={18} />
                        </button>
                      )}

                      <button 
                        onClick={() => handleDeleteClick(veiculo.id)} 
                        className="text-gray-500 hover:text-red-500 transition-colors duration-200" 
                        title="Excluir"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
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

      {/* Dialog de confirmação para excluir */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog para inativar veículo */}
      <Dialog open={inativarDialogOpen} onOpenChange={setInativarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Inativar Veículo</DialogTitle>
            <DialogDescription>
              Preencha o motivo da inativação e a data.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo da Inativação</Label>
              <Input
                id="motivo"
                value={motivoInativacao}
                onChange={(e) => setMotivoInativacao(e.target.value)}
                placeholder="Ex: Manutenção prolongada, venda, etc."
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="data">Data de Inativação</Label>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <Input
                  id="data"
                  type="date"
                  value={dataInativacao}
                  onChange={(e) => setDataInativacao(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setInativarDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInativarConfirm}>
              Confirmar Inativação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VeiculosTable;
