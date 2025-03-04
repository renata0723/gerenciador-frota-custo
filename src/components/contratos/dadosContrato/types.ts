
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

export interface FormularioDadosContratoProps {
  onSave: (data: DadosContratoFormData) => void;
  onNext?: () => void;
  initialData?: DadosContratoFormData;
  readOnly?: boolean;
}
