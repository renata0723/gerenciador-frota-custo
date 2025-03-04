
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';

interface InfoBasicaFormProps {
  idContrato: string;
  setIdContrato: (value: string) => void;
  dataSaida: Date | undefined;
  setDataSaida: (date: Date | undefined) => void;
  readOnly?: boolean;
}

const InfoBasicaForm: React.FC<InfoBasicaFormProps> = ({
  idContrato,
  setIdContrato,
  dataSaida,
  setDataSaida,
  readOnly = false
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-2">
        <Label htmlFor="idContrato">Número do Contrato*</Label>
        <Input
          id="idContrato"
          value={idContrato}
          onChange={(e) => setIdContrato(e.target.value)}
          placeholder="Número do contrato"
          readOnly={readOnly}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="dataSaida">Data de Saída*</Label>
        <DatePicker
          id="dataSaida"
          value={dataSaida}
          onChange={setDataSaida}
          disabled={readOnly}
          placeholder="Selecione a data de saída"
        />
      </div>
    </div>
  );
};

export default InfoBasicaForm;
