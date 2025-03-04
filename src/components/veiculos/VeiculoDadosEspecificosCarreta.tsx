
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VeiculoDadosEspecificosCarretaProps {
  formData: {
    tipoCarroceria: string;
    comprimento: string;
    largura: string;
    altura: string;
    capacidadeCarga: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

const VeiculoDadosEspecificosCarreta: React.FC<VeiculoDadosEspecificosCarretaProps> = ({
  formData,
  handleChange,
  handleSelectChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="tipoCarroceria">Tipo de Carroceria</Label>
        <Select 
          value={formData.tipoCarroceria} 
          onValueChange={(value) => handleSelectChange('tipoCarroceria', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baú">Baú</SelectItem>
            <SelectItem value="graneleira">Graneleira</SelectItem>
            <SelectItem value="tanque">Tanque</SelectItem>
            <SelectItem value="sider">Sider</SelectItem>
            <SelectItem value="prancha">Prancha</SelectItem>
            <SelectItem value="caçamba">Caçamba</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comprimento">Comprimento (m)</Label>
        <Input
          id="comprimento"
          name="comprimento"
          value={formData.comprimento}
          onChange={handleChange}
          placeholder="Ex: 14.8"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="largura">Largura (m)</Label>
        <Input
          id="largura"
          name="largura"
          value={formData.largura}
          onChange={handleChange}
          placeholder="Ex: 2.6"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="altura">Altura (m)</Label>
        <Input
          id="altura"
          name="altura"
          value={formData.altura}
          onChange={handleChange}
          placeholder="Ex: 4.4"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="capacidadeCarga">Capacidade de Carga (kg)</Label>
        <Input
          id="capacidadeCarga"
          name="capacidadeCarga"
          value={formData.capacidadeCarga}
          onChange={handleChange}
          placeholder="Ex: 32000"
        />
      </div>
    </div>
  );
};

export default VeiculoDadosEspecificosCarreta;
