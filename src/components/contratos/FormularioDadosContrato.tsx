
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export interface DadosContratoFormData {
  idContrato: string;
  dataSaida: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  clienteDestino: string;
  tipo: 'frota' | 'terceiro';
  placaCavalo: string;
  placaCarreta: string;
  motorista: string;
  proprietario: string;
}

interface FormularioDadosContratoProps {
  onSubmit: (data: DadosContratoFormData) => void;
  onNext: () => void;
  initialData?: Partial<DadosContratoFormData>;
}

const FormularioDadosContrato: React.FC<FormularioDadosContratoProps> = ({
  onSubmit,
  onNext,
  initialData
}) => {
  const [formData, setFormData] = useState<DadosContratoFormData>({
    idContrato: initialData?.idContrato || '',
    dataSaida: initialData?.dataSaida || '',
    cidadeOrigem: initialData?.cidadeOrigem || '',
    estadoOrigem: initialData?.estadoOrigem || '',
    cidadeDestino: initialData?.cidadeDestino || '',
    estadoDestino: initialData?.estadoDestino || '',
    clienteDestino: initialData?.clienteDestino || '',
    tipo: initialData?.tipo || 'frota',
    placaCavalo: initialData?.placaCavalo || '',
    placaCarreta: initialData?.placaCarreta || '',
    motorista: initialData?.motorista || '',
    proprietario: initialData?.proprietario || ''
  });

  // Lista de estados brasileiros
  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: keyof DadosContratoFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.idContrato) {
      toast.error('O número do contrato é obrigatório');
      return;
    }
    
    if (!formData.dataSaida) {
      toast.error('A data de saída é obrigatória');
      return;
    }
    
    if (!formData.cidadeOrigem || !formData.estadoOrigem) {
      toast.error('Origem completa é obrigatória');
      return;
    }
    
    if (!formData.cidadeDestino || !formData.estadoDestino) {
      toast.error('Destino completo é obrigatório');
      return;
    }
    
    if (!formData.placaCavalo) {
      toast.error('A placa do cavalo é obrigatória');
      return;
    }
    
    if (!formData.motorista) {
      toast.error('O motorista é obrigatório');
      return;
    }
    
    onSubmit(formData);
    onNext();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Dados do Contrato</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="idContrato">Número do Contrato *</Label>
          <Input
            id="idContrato"
            name="idContrato"
            value={formData.idContrato}
            onChange={handleChange}
            placeholder="Número gerado pelo setor de operação"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dataSaida">Data de Saída *</Label>
            <Input
              id="dataSaida"
              name="dataSaida"
              type="date"
              value={formData.dataSaida}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidadeOrigem">Cidade de Origem *</Label>
              <Input
                id="cidadeOrigem"
                name="cidadeOrigem"
                value={formData.cidadeOrigem}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estadoOrigem">Estado *</Label>
              <Select 
                value={formData.estadoOrigem} 
                onValueChange={(value) => handleSelectChange('estadoOrigem', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="cidadeDestino">Cidade de Destino *</Label>
              <Input
                id="cidadeDestino"
                name="cidadeDestino"
                value={formData.cidadeDestino}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="estadoDestino">Estado *</Label>
              <Select 
                value={formData.estadoDestino} 
                onValueChange={(value) => handleSelectChange('estadoDestino', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="UF" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map(estado => (
                    <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="clienteDestino">Cliente Destino *</Label>
            <Input
              id="clienteDestino"
              name="clienteDestino"
              value={formData.clienteDestino}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="tipo">Tipo *</Label>
            <Select 
              value={formData.tipo} 
              onValueChange={(value) => handleSelectChange('tipo', value as 'frota' | 'terceiro')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="frota">Frota</SelectItem>
                <SelectItem value="terceiro">Terceiro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="placaCavalo">Placa do Cavalo *</Label>
            <Input
              id="placaCavalo"
              name="placaCavalo"
              value={formData.placaCavalo}
              onChange={handleChange}
              placeholder="ABC-1234"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="placaCarreta">Placa da Carreta</Label>
            <Input
              id="placaCarreta"
              name="placaCarreta"
              value={formData.placaCarreta}
              onChange={handleChange}
              placeholder="XYZ-9876"
            />
          </div>
          
          <div>
            <Label htmlFor="motorista">Motorista *</Label>
            <Input
              id="motorista"
              name="motorista"
              value={formData.motorista}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="proprietario">Proprietário</Label>
            <Input
              id="proprietario"
              name="proprietario"
              value={formData.proprietario}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDadosContrato;
