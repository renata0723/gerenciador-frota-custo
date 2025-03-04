
export type TipoFreteVeiculo = 'propria' | 'terceiro';
export type StatusVeiculo = 'ativo' | 'inativo';

export interface VeiculoData {
  id?: number;
  placa_cavalo: string;
  placa_carreta?: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo: StatusVeiculo;
  motivo_inativacao?: string;
  data_inativacao?: string;
  proprietario?: string;
  created_at?: string;
  updated_at?: string;
  marca_cavalo?: string;
  modelo_cavalo?: string;
  ano_cavalo?: number;
  marca_carreta?: string;
  modelo_carreta?: string;
  ano_carreta?: number;
}

export interface VeiculoFormData {
  placa_cavalo: string;
  placa_carreta: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo: StatusVeiculo;
  proprietario?: string;
  modelo_cavalo?: string;
  ano_cavalo?: number;
  marca_cavalo?: string;
  capacidade_cavalo?: number;
  modelo_carreta?: string;
  ano_carreta?: number;
  marca_carreta?: string;
  capacidade_carreta?: number;
}
