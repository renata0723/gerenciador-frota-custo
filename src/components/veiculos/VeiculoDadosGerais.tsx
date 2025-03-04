
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface VeiculoDadosGeraisProps {
  formData: {
    placa: string;
    tipo: string;
    modelo: string;
    marca: string;
    ano: number;
    chassi: string;
    renavam: string;
    combustivel: string;
    cor: string;
    capacidade: string;
    frota: string;
    observacoes: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const VeiculoDadosGerais: React.FC<VeiculoDadosGeraisProps> = ({
  formData,
  handleChange,
  handleSelectChange
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="placa">Placa *</Label>
          <Input
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            placeholder="ABC-1234"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Veículo *</Label>
          <Select 
            value={formData.tipo} 
            onValueChange={(value) => handleSelectChange('tipo', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cavalo">Cavalo Mecânico</SelectItem>
              <SelectItem value="carreta">Carreta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="frota">Tipo de Frota *</Label>
          <RadioGroup 
            value={formData.frota} 
            onValueChange={(value) => handleSelectChange('frota', value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="propria" id="frota-propria" />
              <Label htmlFor="frota-propria" className="cursor-pointer">Própria</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="terceirizada" id="frota-terceirizada" />
              <Label htmlFor="frota-terceirizada" className="cursor-pointer">Terceirizada</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="modelo">Modelo *</Label>
          <Input
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            placeholder="Ex: Scania R450"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="marca">Marca *</Label>
          <Input
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            placeholder="Ex: Scania, Volvo"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="ano">Ano de Fabricação *</Label>
          <Input
            id="ano"
            name="ano"
            type="number"
            value={formData.ano}
            onChange={handleChange}
            placeholder="Ex: 2023"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="chassi">Chassi *</Label>
          <Input
            id="chassi"
            name="chassi"
            value={formData.chassi}
            onChange={handleChange}
            placeholder="Ex: 9BWHE21JX24060031"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="renavam">Renavam *</Label>
          <Input
            id="renavam"
            name="renavam"
            value={formData.renavam}
            onChange={handleChange}
            placeholder="Ex: 123456789"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="combustivel">Combustível *</Label>
          <Select 
            value={formData.combustivel} 
            onValueChange={(value) => handleSelectChange('combustivel', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o combustível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="diesels10">Diesel S10</SelectItem>
              <SelectItem value="gasolina">Gasolina</SelectItem>
              <SelectItem value="etanol">Etanol</SelectItem>
              <SelectItem value="flex">Flex</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cor">Cor</Label>
          <Input
            id="cor"
            name="cor"
            value={formData.cor}
            onChange={handleChange}
            placeholder="Ex: Vermelho"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="capacidade">Capacidade (kg)</Label>
          <Input
            id="capacidade"
            name="capacidade"
            value={formData.capacidade}
            onChange={handleChange}
            placeholder="Ex: 45000"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="observacoes">Observações</Label>
        <Textarea
          id="observacoes"
          name="observacoes"
          value={formData.observacoes}
          onChange={handleChange}
          placeholder="Informações adicionais sobre o veículo"
          rows={4}
        />
      </div>
    </div>
  );
};

export default VeiculoDadosGerais;
