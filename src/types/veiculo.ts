
export type TipoFreteVeiculo = 'propria' | 'terceiro';

export interface VeiculoData {
  placa_cavalo: string;
  placa_carreta?: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo: 'ativo' | 'inativo';
  data_inativacao?: string;
  motivo_inativacao?: string;
  marca?: string;
  modelo?: string;
  ano?: number;
  renavam?: string;
  chassi?: string;
  proprietario?: string;
  inativo: boolean;
}

export interface VeiculoSearchResult {
  placa_cavalo: string;
  placa_carreta?: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo: string;
  proprietario?: string;
}

export interface VeiculoEditFormProps {
  onSubmit: (data: VeiculoData) => void;
  onCancel: () => void;
  initialData?: Partial<VeiculoData>;
}

export interface VeiculoFormValues {
  placa_cavalo: string;
  placa_carreta?: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo?: string;
  proprietario?: string;
}

export interface ProprietarioVeiculo {
  id?: number;
  nome: string;
  documento?: string;
}
