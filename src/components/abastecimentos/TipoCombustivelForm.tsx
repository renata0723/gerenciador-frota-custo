
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface TipoCombustivelFormData {
  nome: string;
  descricao: string;
}

interface TipoCombustivelFormProps {
  onSave: (data: TipoCombustivelFormData) => void;
  initialData?: TipoCombustivelFormData;
}

const TipoCombustivelForm: React.FC<TipoCombustivelFormProps> = ({
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<TipoCombustivelFormData>({
    nome: initialData?.nome || "",
    descricao: initialData?.descricao || ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success("Tipo de combustível cadastrado com sucesso!");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Cadastrar Tipo de Combustível</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <Button type="submit" className="w-full">Cadastrar</Button>
      </form>
    </div>
  );
};

export default TipoCombustivelForm;
