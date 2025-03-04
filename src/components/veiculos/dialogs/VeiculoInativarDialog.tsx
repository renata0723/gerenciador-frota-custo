
import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface VeiculoInativarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (motivo: string, data: string) => void;
}

const VeiculoInativarDialog: React.FC<VeiculoInativarDialogProps> = ({
  open,
  onOpenChange,
  onConfirm
}) => {
  const [motivoInativacao, setMotivoInativacao] = useState('');
  const [dataInativacao, setDataInativacao] = useState(new Date().toISOString().split('T')[0]);

  const handleConfirm = () => {
    if (motivoInativacao.trim() !== '') {
      onConfirm(motivoInativacao, dataInativacao);
      setMotivoInativacao('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar Inativação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VeiculoInativarDialog;
