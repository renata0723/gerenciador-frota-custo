
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";

interface DespesaFormData {
  data: string;
  tipo: "descarga" | "reentrega" | "no-show" | "outros";
  descricao: string;
  valor: number;
}

interface NovaDespesaFormProps {
  onSave: (data: DespesaFormData) => void;
  initialData?: Partial<DespesaFormData>;
}

const NovaDespesaForm: React.FC<NovaDespesaFormProps> = ({
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<DespesaFormData>({
    data: initialData?.data || format(new Date(), 'yyyy-MM-dd'),
    tipo: initialData?.tipo || "descarga",
    descricao: initialData?.descricao || "",
    valor: initialData?.valor || 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      tipo: value as "descarga" | "reentrega" | "no-show" | "outros"
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.data) {
      toast.error("Por favor, informe a data da despesa");
      return;
    }
    
    if (!formData.descricao) {
      toast.error("Por favor, informe a descrição da despesa");
      return;
    }
    
    if (formData.valor <= 0) {
      toast.error("Por favor, informe um valor válido para a despesa");
      return;
    }
    
    onSave(formData);
    toast.success("Despesa registrada com sucesso!");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Registrar Nova Despesa</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              name="data"
              type="date"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tipo">Tipo de Despesa</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={handleSelectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="descarga">Descarga</SelectItem>
                <SelectItem value="reentrega">Reentrega</SelectItem>
                <SelectItem value="no-show">No-Show</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição Detalhada</Label>
          <Textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="valor">Valor (R$)</Label>
          <Input
            id="valor"
            name="valor"
            type="number"
            step="0.01"
            value={formData.valor}
            onChange={handleChange}
            required
          />
        </div>
        
        <Button type="submit" className="w-full">Registrar Despesa</Button>
      </form>
    </div>
  );
};

export default NovaDespesaForm;
