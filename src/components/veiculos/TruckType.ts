
export interface Truck {
  id: string;
  placa: string;
  tipo: string;
  modelo: string;
  marca: string;
  ano: number;
  frota: 'Própria' | 'Terceirizada';
  status: 'Ativo' | 'Inativo';
  inativacao?: {
    data: string;
    motivo: string;
  };
  quilometragem: number;
  ultimaManutencao?: string;
}
