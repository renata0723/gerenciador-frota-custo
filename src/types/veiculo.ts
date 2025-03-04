
export type TipoFreteVeiculo = 'propria' | 'terceiro';

export interface VeiculoData {
  id?: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  capacidade?: number;
  status: string;
  km_atual?: number;
  data_aquisicao?: string;
  valor_aquisicao?: number;
  renavam?: string;
  observacoes?: string;
  inativo: boolean;
  motivo_inativacao?: string;
  data_inativacao?: string;
  placa_cavalo: string;
  placa_carreta?: string;
  tipo_frota: TipoFreteVeiculo;
  status_veiculo: string;
}

export interface VeiculoFormData {
  id?: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: 'cavalo' | 'carreta' | 'truck' | 'outro';
  capacidade?: number;
  status: 'ativo' | 'inativo' | 'manutencao';
  km_atual?: number;
  data_aquisicao?: string;
  valor_aquisicao?: number;
  renavam?: string;
  observacoes?: string;
  proprietario?: string;
  tipo_frota: TipoFreteVeiculo;
  placa_cavalo?: string;
  placa_carreta?: string;
}
