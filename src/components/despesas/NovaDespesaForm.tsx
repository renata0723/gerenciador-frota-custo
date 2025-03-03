
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from '@/integrations/supabase/client';
import { DespesaFormData, TipoDespesa } from "@/types/despesa";

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
    valor: initialData?.valor || 0,
    contrato: initialData?.contrato || "",
    categoria: initialData?.categoria || "viagem",
    rateio: initialData?.rateio || false
  });

  const [contratos, setContratos] = useState<{id: number, cliente_destino: string}[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarContratos();
  }, []);

  const carregarContratos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('id, cliente_destino')
        .eq('status_contrato', 'Ativo');
        
      if (error) {
        console.error('Erro ao carregar contratos:', error);
        toast.error('Erro ao carregar contratos disponíveis');
        return;
      }
      
      setContratos(data || []);
    } catch (error) {
      console.error('Erro ao processar dados de contratos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "tipo") {
      setFormData({
        ...formData,
        tipo: value as TipoDespesa,
        // Se mudar para administrativa, remove o contrato e define categoria como administrativa
        ...(value === "administrativa" ? { 
          categoria: "administrativa", 
          contrato: undefined 
        } : {})
      });
    } else if (name === "categoria") {
      setFormData({
        ...formData,
        categoria: value as "viagem" | "administrativa",
        // Se mudar para administrativa, remove o contrato
        ...(value === "administrativa" ? { contrato: undefined } : {})
      });
    } else if (name === "contrato") {
      setFormData({
        ...formData,
        contrato: value
      });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      rateio: checked
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
    
    // Validar contrato para despesas de viagem
    if (formData.categoria === "viagem" && !formData.contrato) {
      toast.error("Por favor, selecione um contrato para essa despesa de viagem");
      return;
    }
    
    onSave(formData);
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
            <Label htmlFor="categoria">Categoria da Despesa</Label>
            <Select 
              value={formData.categoria} 
              onValueChange={(value) => handleSelectChange("categoria", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viagem">Despesa de Viagem</SelectItem>
                <SelectItem value="administrativa">Despesa Administrativa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo">Tipo de Despesa</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleSelectChange("tipo", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {formData.categoria === "viagem" ? (
                  <>
                    <SelectItem value="descarga">Descarga</SelectItem>
                    <SelectItem value="reentrega">Reentrega</SelectItem>
                    <SelectItem value="no-show">No-Show</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </>
                ) : (
                  <SelectItem value="administrativa">Administrativa</SelectItem>
                )}
              </SelectContent>
            </Select>
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
        </div>
        
        {formData.categoria === "viagem" && (
          <div>
            <Label htmlFor="contrato">Contrato Relacionado</Label>
            <Select 
              value={formData.contrato || ""} 
              onValueChange={(value) => handleSelectChange("contrato", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Carregando contratos..." : "Selecione o contrato"} />
              </SelectTrigger>
              <SelectContent>
                {contratos.map((contrato) => (
                  <SelectItem key={contrato.id} value={String(contrato.id)}>
                    {contrato.id} - {contrato.cliente_destino}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {formData.categoria === "administrativa" && (
          <div className="flex items-center space-x-2">
            <Switch 
              id="rateio" 
              checked={formData.rateio}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="rateio">Aplicar rateio em contratos</Label>
          </div>
        )}
        
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
        
        <Button type="submit" className="w-full">Registrar Despesa</Button>
      </form>
    </div>
  );
};

export default NovaDespesaForm;
