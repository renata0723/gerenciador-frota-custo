
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ManutencaoFormData {
  data: string;
  placa: string;
  tipo: "preventiva" | "corretiva";
  local: "pátio" | "externa";
  descricao: string;
  valor: number;
  pecas: string[];
  servicos: string[];
}

interface NovaManutencaoFormProps {
  onSave: (data: ManutencaoFormData) => void;
  initialData?: Partial<ManutencaoFormData>;
}

const NovaManutencaoForm: React.FC<NovaManutencaoFormProps> = ({
  onSave,
  initialData
}) => {
  const [formData, setFormData] = useState<ManutencaoFormData>({
    data: initialData?.data || "",
    placa: initialData?.placa || "",
    tipo: initialData?.tipo || "preventiva",
    local: initialData?.local || "pátio",
    descricao: initialData?.descricao || "",
    valor: initialData?.valor || 0,
    pecas: initialData?.pecas || [],
    servicos: initialData?.servicos || []
  });

  const [novaPeca, setNovaPeca] = useState("");
  const [novoServico, setNovoServico] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleSelectChange = (name: keyof ManutencaoFormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const adicionarPeca = () => {
    if (novaPeca.trim()) {
      setFormData({
        ...formData,
        pecas: [...formData.pecas, novaPeca.trim()]
      });
      setNovaPeca("");
    }
  };

  const removerPeca = (index: number) => {
    const novasPecas = [...formData.pecas];
    novasPecas.splice(index, 1);
    setFormData({
      ...formData,
      pecas: novasPecas
    });
  };

  const adicionarServico = () => {
    if (novoServico.trim()) {
      setFormData({
        ...formData,
        servicos: [...formData.servicos, novoServico.trim()]
      });
      setNovoServico("");
    }
  };

  const removerServico = (index: number) => {
    const novosServicos = [...formData.servicos];
    novosServicos.splice(index, 1);
    setFormData({
      ...formData,
      servicos: novosServicos
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast.success("Manutenção registrada com sucesso!");
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Registrar Nova Manutenção</DialogTitle>
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
            <Label htmlFor="tipo">Tipo de Manutenção</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleSelectChange("tipo", value as "preventiva" | "corretiva")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="preventiva">Preventiva</SelectItem>
                <SelectItem value="corretiva">Corretiva</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="local">Local da Manutenção</Label>
            <Select 
              value={formData.local} 
              onValueChange={(value) => handleSelectChange("local", value as "pátio" | "externa")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pátio">Pátio</SelectItem>
                <SelectItem value="externa">Externa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição</Label>
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
          <Label>Peças Utilizadas</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={novaPeca}
              onChange={(e) => setNovaPeca(e.target.value)}
              placeholder="Adicionar peça"
            />
            <Button type="button" onClick={adicionarPeca} variant="outline">
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.pecas.map((peca, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {peca}
                <button 
                  type="button"
                  onClick={() => removerPeca(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Serviços Realizados</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={novoServico}
              onChange={(e) => setNovoServico(e.target.value)}
              placeholder="Adicionar serviço"
            />
            <Button type="button" onClick={adicionarServico} variant="outline">
              Adicionar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.servicos.map((servico, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {servico}
                <button 
                  type="button"
                  onClick={() => removerServico(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
        
        <Button type="submit" className="w-full">Registrar Manutenção</Button>
      </form>
    </div>
  );
};

export default NovaManutencaoForm;
