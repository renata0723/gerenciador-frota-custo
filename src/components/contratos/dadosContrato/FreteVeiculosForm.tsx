
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Truck } from 'lucide-react';
import CadastroPlacaForm from '../CadastroPlacaForm';
import CadastroMotoristaForm from '../CadastroMotoristaForm';

interface FreteVeiculosFormProps {
  tipo: 'frota' | 'terceiro';
  setTipo: (value: 'frota' | 'terceiro') => void;
  placaCavalo: string;
  setPlacaCavalo: (value: string) => void;
  placaCarreta: string;
  setPlacaCarreta: (value: string) => void;
  motorista: string;
  setMotorista: (value: string) => void;
  proprietario: string;
  setProprietario: (value: string) => void;
  placasVeiculos: any[];
  motoristas: any[];
  proprietarios: any[];
  readOnly?: boolean;
  onCadastroPlacaSuccess: (data: any) => void;
  onCadastroMotoristaSuccess: (data: any) => void;
}

const FreteVeiculosForm: React.FC<FreteVeiculosFormProps> = ({
  tipo,
  setTipo,
  placaCavalo,
  setPlacaCavalo,
  placaCarreta,
  setPlacaCarreta,
  motorista,
  setMotorista,
  proprietario,
  setProprietario,
  placasVeiculos,
  motoristas,
  proprietarios,
  readOnly = false,
  onCadastroPlacaSuccess,
  onCadastroMotoristaSuccess
}) => {
  const [modalCadastroPlaca, setModalCadastroPlaca] = React.useState(false);
  const [modalCadastroMotorista, setModalCadastroMotorista] = React.useState(false);

  return (
    <div className="space-y-6 mb-4">
      <div>
        <Label>Tipo de Frete*</Label>
        <RadioGroup
          value={tipo}
          onValueChange={(v) => setTipo(v as 'frota' | 'terceiro')}
          className="flex space-x-4 mt-2"
          disabled={readOnly}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="frota" id="frota" />
            <Label htmlFor="frota" className="cursor-pointer">Frota Própria</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="terceiro" id="terceiro" />
            <Label htmlFor="terceiro" className="cursor-pointer">Frete Terceirizado</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="placaCavalo">Placa do Cavalo*</Label>
            {!readOnly && (
              <Dialog open={modalCadastroPlaca} onOpenChange={setModalCadastroPlaca}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Truck className="mr-1 h-3 w-3" />
                    Nova Placa
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Nova Placa de Cavalo</DialogTitle>
                  </DialogHeader>
                  <CadastroPlacaForm 
                    onSave={(data) => {
                      onCadastroPlacaSuccess(data);
                      setModalCadastroPlaca(false);
                    }}
                    onCancel={() => setModalCadastroPlaca(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Select 
            value={placaCavalo} 
            onValueChange={setPlacaCavalo}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a placa" />
            </SelectTrigger>
            <SelectContent>
              {placasVeiculos.map((veiculo) => (
                <SelectItem key={veiculo.placa_cavalo} value={veiculo.placa_cavalo}>
                  {veiculo.placa_cavalo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="placaCarreta">Placa da Carreta</Label>
          <Input
            id="placaCarreta"
            value={placaCarreta}
            onChange={(e) => setPlacaCarreta(e.target.value)}
            placeholder="Placa da carreta (opcional)"
            readOnly={readOnly}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center">
            <Label htmlFor="motorista">Motorista*</Label>
            {!readOnly && (
              <Dialog open={modalCadastroMotorista} onOpenChange={setModalCadastroMotorista}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Novo Motorista
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Novo Motorista</DialogTitle>
                  </DialogHeader>
                  <CadastroMotoristaForm 
                    onSave={(data) => {
                      onCadastroMotoristaSuccess(data);
                      setModalCadastroMotorista(false);
                    }}
                    onCancel={() => setModalCadastroMotorista(false)}
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
          <Select 
            value={motorista} 
            onValueChange={setMotorista}
            disabled={readOnly}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o motorista" />
            </SelectTrigger>
            <SelectContent>
              {motoristas.map((m) => (
                <SelectItem key={m.id} value={String(m.id)}>
                  {m.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {tipo === 'terceiro' && (
          <div>
            <Label htmlFor="proprietario">Proprietário*</Label>
            <Select 
              value={proprietario} 
              onValueChange={setProprietario}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o proprietário" />
              </SelectTrigger>
              <SelectContent>
                {proprietarios.map((p) => (
                  <SelectItem key={p.nome} value={p.nome}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreteVeiculosForm;
