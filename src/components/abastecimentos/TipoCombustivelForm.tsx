
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { addTipoCombustivel } from '@/services/abastecimentoService';
import { toast } from 'sonner';

export interface TipoCombustivel {
  id: string;
  nome: string;
  descricao?: string;
}

export interface TipoCombustivelFormProps {
  onTipoCombustivelAdded: (tipoCombustivel: TipoCombustivel) => void;
}

const TipoCombustivelForm: React.FC<TipoCombustivelFormProps> = ({ onTipoCombustivelAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<{
    id: string;
    nome: string;
    descricao: string;
  }>({
    id: '',
    nome: '',
    descricao: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.nome) {
      toast.error('Por favor, preencha os campos obrigatórios.');
      return;
    }

    try {
      const result = await addTipoCombustivel(formData);
      if (result) {
        toast.success('Tipo de combustível adicionado com sucesso!');
        onTipoCombustivelAdded(result);
        setFormData({ id: '', nome: '', descricao: '' });
        setOpen(false);
      }
    } catch (error) {
      console.error('Erro ao adicionar tipo de combustível:', error);
      toast.error('Erro ao adicionar tipo de combustível. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Novo Tipo de Combustível
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Tipo de Combustível</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Código</Label>
            <Input
              id="id"
              name="id"
              placeholder="Ex: DSL, GAS, ARL"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              placeholder="Ex: Diesel S10, Gasolina, Arla 32"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição (opcional)</Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Descreva detalhes sobre este tipo de combustível"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TipoCombustivelForm;
