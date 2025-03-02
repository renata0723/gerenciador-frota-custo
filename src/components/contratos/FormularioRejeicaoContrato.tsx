
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface RejeicaoData {
  motivo: string;
  data: string;
}

interface FormularioRejeicaoContratoProps {
  idContrato?: string;
  onRejeicaoRegistrada?: () => void;
  initialData?: RejeicaoData;
  onSave?: (data: RejeicaoData) => void;
}

const FormularioRejeicaoContrato: React.FC<FormularioRejeicaoContratoProps> = ({ 
  idContrato, 
  onRejeicaoRegistrada,
  initialData,
  onSave
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dataRejeicao, setDataRejeicao] = useState(
    initialData?.data || new Date().toISOString().slice(0, 10)
  );
  const [motivoRejeicao, setMotivoRejeicao] = useState(initialData?.motivo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!dataRejeicao || !motivoRejeicao) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const rejeicaoData = {
      motivo: motivoRejeicao,
      data: dataRejeicao
    };

    // Salvar a rejeição (simulado)
    console.log('Rejeição registrada:', {
      idContrato,
      ...rejeicaoData
    });

    // Notificar o usuário
    toast.success('Rejeição de contrato registrada com sucesso');
    
    // Chamar o callback onSave se disponível
    if (onSave) {
      onSave(rejeicaoData);
    }
    
    // Resetar o formulário e fechar o diálogo
    setMotivoRejeicao('');
    setIsOpen(false);
    
    // Chamar o callback (se fornecido)
    if (onRejeicaoRegistrada) {
      onRejeicaoRegistrada();
    }
  };

  // Botão de rejeição separado do formulário
  const BotaoRejeicao = () => (
    <Button variant="destructive" onClick={() => setIsOpen(true)}>
      Rejeitar Contrato
    </Button>
  );

  return (
    <>
      {/* Botão de rejeição fora do Dialog */}
      <BotaoRejeicao />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeição de Contrato</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataRejeicao">Data da Rejeição</Label>
                <Input
                  id="dataRejeicao"
                  type="date"
                  value={dataRejeicao}
                  onChange={(e) => setDataRejeicao(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="motivoRejeicao">Motivo da Rejeição</Label>
                <Textarea
                  id="motivoRejeicao"
                  value={motivoRejeicao}
                  onChange={(e) => setMotivoRejeicao(e.target.value)}
                  placeholder="Descreva o motivo da rejeição do contrato"
                  className="min-h-[120px]"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancelar</Button>
              </DialogClose>
              <Button type="submit" variant="destructive">Confirmar Rejeição</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FormularioRejeicaoContrato;
