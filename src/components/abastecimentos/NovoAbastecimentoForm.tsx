
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface TipoCombustivel {
  id: string;
  nome: string;
  descricao: string;
}

interface AbastecimentoFormData {
  data: string;
  placa: string;
  motorista: string;
  tipoCombustivel: string;
  quantidade: number;
  valor: number;
  posto: string;
  responsavel: string;
  quilometragem: number;
}

interface NovoAbastecimentoFormProps {
  onSave: (data: AbastecimentoFormData) => void;
  tiposCombustivel: TipoCombustivel[];
  initialData?: Partial<AbastecimentoFormData>;
}

const NovoAbastecimentoForm: React.FC<NovoAbastecimentoFormProps> = ({
  onSave,
  tiposCombustivel,
  initialData
}) => {
  const [formData, setFormData] = useState<AbastecimentoFormData>({
    data: initialData?.data || "",
    placa: initialData?.placa || "",
    motorista: initialData?.motorista || "",
    tipoCombustivel: initialData?.tipoCombustivel || "",
    quantidade: initialData?.quantidade || 0,
    valor: initialData?.valor || 0,
    posto: initialData?.posto || "",
    responsavel: initialData?.responsavel || "",
    quilometragem: initialData?.quilometragem || 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success("Abastecimento registrado com sucesso!");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Registrar Novo Abastecimento</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="placa">Placa do Veículo</Label>
            <Input
              id="placa"
              name="placa"
              value={formData.placa}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="quilometragem">Quilometragem</Label>
            <Input
              id="quilometragem"
              name="quilometragem"
              type="number"
              value={formData.quilometragem}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="motorista">Motorista</Label>
            <Input
              id="motorista"
              name="motorista"
              value={formData.motorista}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tipoCombustivel">Tipo de Combustível</Label>
            <Select 
              value={formData.tipoCombustivel} 
              onValueChange={(value) => handleSelectChange("tipoCombustivel", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de combustível" />
              </SelectTrigger>
              <SelectContent>
                {tiposCombustivel.map((tipo) => (
                  <SelectItem key={tipo.id} value={tipo.nome}>
                    {tipo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quantidade">Quantidade (L)</Label>
            <Input
              id="quantidade"
              name="quantidade"
              type="number"
              step="0.01"
              value={formData.quantidade}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="valor">Valor Total (R$)</Label>
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
          
          <div>
            <Label htmlFor="posto">Posto</Label>
            <Input
              id="posto"
              name="posto"
              value={formData.posto}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="responsavel">Responsável pela Autorização</Label>
            <Input
              id="responsavel"
              name="responsavel"
              value={formData.responsavel}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <Button type="submit" className="w-full">Registrar Abastecimento</Button>
      </form>
    </div>
  );
};

export default NovoAbastecimentoForm;
