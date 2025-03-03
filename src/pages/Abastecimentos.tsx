import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TipoCombustivel, TipoCombustivelFormData } from '@/types/abastecimento';

const Abastecimentos: React.FC = () => {
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [isNewTypeDialogOpen, setIsNewTypeDialogOpen] = useState(false);
  const [newTipoCombustivel, setNewTipoCombustivel] = useState<TipoCombustivelFormData>({ nome: '', descricao: '' });

  useEffect(() => {
    loadTiposCombustivel();
  }, []);

  const loadTiposCombustivel = async () => {
    const { data, error } = await supabase.from('TiposCombustivel').select('*');
    if (error) {
      console.error('Erro ao carregar tipos de combustível:', error);
      toast.error('Erro ao carregar tipos de combustível');
      return;
    }
    setTiposCombustivel(data || []);
  };

  const handleSaveFuelType = async (data: TipoCombustivelFormData) => {
    setIsNewTypeDialogOpen(false);
    
    try {
      // Criar um ID para o novo tipo
      const tipoCombustivelData: TipoCombustivel = {
        id: `tipo-${Date.now()}`, // Gerando um ID único
        nome: data.nome,
        descricao: data.descricao
      };
      
      const { error } = await supabase
        .from('TiposCombustivel')
        .insert(tipoCombustivelData);
        
      if (error) {
        console.error('Erro ao salvar tipo de combustível:', error);
        toast.error('Erro ao salvar tipo de combustível');
        return;
      }
      
      // Adicionar à lista local
      setTiposCombustivel([...tiposCombustivel, tipoCombustivelData]);
      toast.success(`Tipo de combustível ${data.nome} adicionado com sucesso!`);
      
      // Log de operação
      logOperation('Abastecimentos', `Adicionado novo tipo de combustível: ${data.nome}`);
    } catch (error) {
      console.error('Erro ao processar:', error);
      toast.error('Ocorreu um erro ao salvar o tipo de combustível');
    }
  };

  return (
    <div>
      <Card>
        <h2 className="text-lg font-bold">Tipos de Combustível</h2>
        <Button onClick={() => setIsNewTypeDialogOpen(true)}>Adicionar Tipo de Combustível</Button>
        <ul>
          {tiposCombustivel.map(tipo => (
            <li key={tipo.id}>{tipo.nome} - {tipo.descricao}</li>
          ))}
        </ul>
      </Card>

      <Dialog open={isNewTypeDialogOpen} onOpenChange={setIsNewTypeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Tipo de Combustível</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={newTipoCombustivel.nome}
              onChange={(e) => setNewTipoCombustivel({ ...newTipoCombustivel, nome: e.target.value })}
            />
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={newTipoCombustivel.descricao}
              onChange={(e) => setNewTipoCombustivel({ ...newTipoCombustivel, descricao: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsNewTypeDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => handleSaveFuelType(newTipoCombustivel)}>Salvar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Abastecimentos;
