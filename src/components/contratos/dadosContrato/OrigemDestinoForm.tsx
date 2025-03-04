
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { estadosBrasileiros } from '@/utils/constants';

interface OrigemDestinoFormProps {
  cidadeOrigem: string;
  setCidadeOrigem: (value: string) => void;
  estadoOrigem: string;
  setEstadoOrigem: (value: string) => void;
  cidadeDestino: string;
  setCidadeDestino: (value: string) => void;
  estadoDestino: string;
  setEstadoDestino: (value: string) => void;
  clienteDestino: string;
  setClienteDestino: (value: string) => void;
  readOnly?: boolean;
}

const OrigemDestinoForm: React.FC<OrigemDestinoFormProps> = ({
  cidadeOrigem,
  setCidadeOrigem,
  estadoOrigem,
  setEstadoOrigem,
  cidadeDestino,
  setCidadeDestino,
  estadoDestino,
  setEstadoDestino,
  clienteDestino,
  setClienteDestino,
  readOnly = false
}) => {
  return (
    <div className="space-y-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="cidadeOrigem">Cidade de Origem*</Label>
          <Input
            id="cidadeOrigem"
            value={cidadeOrigem}
            onChange={(e) => setCidadeOrigem(e.target.value)}
            placeholder="Cidade de origem"
            readOnly={readOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="estadoOrigem">Estado*</Label>
          <Select 
            value={estadoOrigem} 
            onValueChange={setEstadoOrigem}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {estadosBrasileiros.map((estado) => (
                <SelectItem key={estado.sigla} value={estado.sigla}>
                  {estado.sigla} - {estado.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="cidadeDestino">Cidade de Destino*</Label>
          <Input
            id="cidadeDestino"
            value={cidadeDestino}
            onChange={(e) => setCidadeDestino(e.target.value)}
            placeholder="Cidade de destino"
            readOnly={readOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="estadoDestino">Estado*</Label>
          <Select 
            value={estadoDestino} 
            onValueChange={setEstadoDestino}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {estadosBrasileiros.map((estado) => (
                <SelectItem key={estado.sigla} value={estado.sigla}>
                  {estado.sigla} - {estado.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="clienteDestino">Cliente Destinatário*</Label>
        <Input
          id="clienteDestino"
          value={clienteDestino}
          onChange={(e) => setClienteDestino(e.target.value)}
          placeholder="Nome do cliente destinatário"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default OrigemDestinoForm;
