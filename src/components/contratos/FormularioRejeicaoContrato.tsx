
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { logOperation } from "@/utils/logOperations";

interface FormularioRejeicaoContratoProps {
  contratoId: string;
  onRejeicaoConfirmada: (data: RejeicaoContratoData) => void;
}

export interface RejeicaoContratoData {
  contratoId: string;
  dataRejeicao: string;
  motivo: string;
}

export function FormularioRejeicaoContrato({ contratoId, onRejeicaoConfirmada }: FormularioRejeicaoContratoProps) {
  const [open, setOpen] = useState(false);
  const [dataRejeicao, setDataRejeicao] = useState(new Date().toISOString().split('T')[0]);
  const [motivo, setMotivo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dataRejeicao || !motivo) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dadosRejeicao: RejeicaoContratoData = {
      contratoId,
      dataRejeicao,
      motivo
    };

    onRejeicaoConfirmada(dadosRejeicao);
    logOperation(`Rejeição de Contrato: Contrato ID: ${contratoId} - Motivo: ${motivo}`);
    
    toast.success("Rejeição de contrato registrada com sucesso!");
    setOpen(false);
    
    // Resetar formulário
    setMotivo("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          Rejeitar Contrato
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rejeição de Contrato</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dataRejeicao">Data da Rejeição</Label>
              <Input
                id="dataRejeicao"
                type="date"
                value={dataRejeicao}
                onChange={(e) => setDataRejeicao(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo da Rejeição</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={4}
                placeholder="Descreva o motivo da rejeição do contrato..."
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive">
              Confirmar Rejeição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
