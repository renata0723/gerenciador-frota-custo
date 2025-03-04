
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VeiculoTableHeader from './table/VeiculoTableHeader';
import VeiculoTableRow from './table/VeiculoTableRow';
import VeiculoTableEmpty from './table/VeiculoTableEmpty';
import VeiculoDeleteDialog from './dialogs/VeiculoDeleteDialog';
import VeiculoInativarDialog from './dialogs/VeiculoInativarDialog';

interface VeiculosTableProps {
  veiculos: any[];
  onInativar: (id: number, motivo: string, data: string) => void;
  onDelete: (id: number) => void;
}

const VeiculosTable: React.FC<VeiculosTableProps> = ({ 
  veiculos, 
  onInativar, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [inativarDialogOpen, setInativarDialogOpen] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState<number | null>(null);

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

  const handleInativarConfirm = (motivo: string, data: string) => {
    if (selectedVeiculo !== null && motivo.trim() !== '') {
      onInativar(selectedVeiculo, motivo, data);
      setInativarDialogOpen(false);
    }
  };

  const handleEditClick = (veiculo: any) => {
    navigate(`/veiculos/editar/${veiculo.id}`, { state: { veiculoData: veiculo } });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <VeiculoTableHeader />
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {veiculos.length > 0 ? (
              veiculos.map((veiculo) => (
                <VeiculoTableRow
                  key={veiculo.id}
                  veiculo={veiculo}
                  onEdit={handleEditClick}
                  onInativar={handleInativarClick}
                  onDelete={handleDeleteClick}
                />
              ))
            ) : (
              <VeiculoTableEmpty />
            )}
          </tbody>
        </table>
      </div>

      <VeiculoDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />

      <VeiculoInativarDialog
        open={inativarDialogOpen}
        onOpenChange={setInativarDialogOpen}
        onConfirm={handleInativarConfirm}
      />
    </>
  );
};

export default VeiculosTable;
