
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { TipoCombustivel, AbastecimentoFormData } from "@/types/abastecimento";
import { supabase } from "@/integrations/supabase/client";

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

  const [placasDisponiveis, setPlacasDisponiveis] = useState<{placa_cavalo: string}[]>([]);
  const [motoristasDisponiveis, setMotoristasDisponiveis] = useState<{nome: string}[]>([]);
  const [carregandoPlacas, setCarregandoPlacas] = useState(false);
  const [carregandoMotoristas, setCarregandoMotoristas] = useState(false);

  useEffect(() => {
    carregarPlacas();
    carregarMotoristas();
  }, []);

  const carregarPlacas = async () => {
    setCarregandoPlacas(true);
    try {
      const { data, error } = await supabase
        .from('Veiculos')
        .select('placa_cavalo')
        .eq('status_veiculo', 'Ativo');

      if (error) {
        console.error('Erro ao carregar placas:', error);
        return;
      }

      setPlacasDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao processar placas:', error);
    } finally {
      setCarregandoPlacas(false);
    }
  };

  const carregarMotoristas = async () => {
    setCarregandoMotoristas(true);
    try {
      // Tenta carregar da tabela Motoristas nova
      const { data, error } = await supabase
        .from('Motorista')
        .select('nome');

      if (error) {
        console.error('Erro ao carregar motoristas:', error);
        setMotoristasDisponiveis([
          { nome: 'João Silva' },
          { nome: 'Maria Oliveira' },
          { nome: 'Pedro Santos' }
        ]);
        return;
      }

      setMotoristasDisponiveis(data || []);
    } catch (error) {
      console.error('Erro ao processar motoristas:', error);
    } finally {
      setCarregandoMotoristas(false);
    }
  };

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

    // Validação básica
    if (!formData.data) {
      toast.error('A data é obrigatória');
      return;
    }

    if (!formData.placa) {
      toast.error('A placa do veículo é obrigatória');
      return;
    }

    if (!formData.tipoCombustivel) {
      toast.error('O tipo de combustível é obrigatório');
      return;
    }

    if (formData.quantidade <= 0) {
      toast.error('A quantidade deve ser maior que zero');
      return;
    }

    if (formData.valor <= 0) {
      toast.error('O valor deve ser maior que zero');
      return;
    }

    onSave(formData);
    
    // Limpar o formulário
    setFormData({
      data: "",
      placa: "",
      motorista: "",
      tipoCombustivel: "",
      quantidade: 0,
      valor: 0,
      posto: "",
      responsavel: "",
      quilometragem: 0
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">Registrar Novo Abastecimento</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data">Data *</Label>
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
            <Label htmlFor="placa">Placa do Veículo *</Label>
            <Select 
              value={formData.placa} 
              onValueChange={(value) => handleSelectChange("placa", value)}
              disabled={carregandoPlacas || placasDisponiveis.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={carregandoPlacas ? "Carregando..." : "Selecione a placa"} />
              </SelectTrigger>
              <SelectContent>
                {placasDisponiveis.map((veiculo) => (
                  <SelectItem key={veiculo.placa_cavalo} value={veiculo.placa_cavalo}>
                    {veiculo.placa_cavalo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="quilometragem">Quilometragem *</Label>
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
            <Label htmlFor="motorista">Motorista *</Label>
            <Select 
              value={formData.motorista} 
              onValueChange={(value) => handleSelectChange("motorista", value)}
              disabled={carregandoMotoristas || motoristasDisponiveis.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={carregandoMotoristas ? "Carregando..." : "Selecione o motorista"} />
              </SelectTrigger>
              <SelectContent>
                {motoristasDisponiveis.map((motorista) => (
                  <SelectItem key={motorista.nome} value={motorista.nome}>
                    {motorista.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="tipoCombustivel">Tipo de Combustível *</Label>
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
            <Label htmlFor="quantidade">Quantidade (L) *</Label>
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
            <Label htmlFor="valor">Valor Total (R$) *</Label>
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
            <Label htmlFor="posto">Posto *</Label>
            <Input
              id="posto"
              name="posto"
              value={formData.posto}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="responsavel">Responsável pela Autorização *</Label>
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
