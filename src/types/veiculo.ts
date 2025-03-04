
export type TipoFreteVeiculo = 'propria' | 'terceiro';
export type StatusVeiculo = 'ativo' | 'inativo';

export interface VeiculoData {
  placa_cavalo: string;
  placa_carreta?: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo: StatusVeiculo;
  motivo_inativacao?: string;
  data_inativacao?: string;
  proprietario?: string;
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
