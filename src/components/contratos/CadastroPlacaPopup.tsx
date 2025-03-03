
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle } from 'lucide-react';
import PlacaVeiculoForm from './PlacaVeiculoForm';

interface CadastroPlacaPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (placaCavalo: string, placaCarreta: string | null, tipoFrota: string, proprietario: string) => void;
}

const CadastroPlacaPopup: React.FC<CadastroPlacaPopupProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            Cadastrar Novo Cavalo
          </DialogTitle>
        </DialogHeader>
        
        <PlacaVeiculoForm 
          onSave={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CadastroPlacaPopup;
