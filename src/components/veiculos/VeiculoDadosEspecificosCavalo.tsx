
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface VeiculoDadosEspecificosCavaloProps {
  formData: {
    potencia: string;
    torque: string;
    entreEixos: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const VeiculoDadosEspecificosCavalo: React.FC<VeiculoDadosEspecificosCavaloProps> = ({
  formData,
  handleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-2">
        <Label htmlFor="potencia">Potência (cv)</Label>
        <Input
          id="potencia"
          name="potencia"
          value={formData.potencia}
          onChange={handleChange}
          placeholder="Ex: 450"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="torque">Torque (Nm)</Label>
        <Input
          id="torque"
          name="torque"
          value={formData.torque}
          onChange={handleChange}
          placeholder="Ex: 2300"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="entreEixos">Entre-eixos (mm)</Label>
        <Input
          id="entreEixos"
          name="entreEixos"
          value={formData.entreEixos}
          onChange={handleChange}
          placeholder="Ex: 3800"
        />
      </div>
    </div>
  );
};

export default VeiculoDadosEspecificosCavalo;
