
export interface Manutencao {
  id?: number;
  placa_veiculo?: string;
  tipo_manutencao?: string;
  data_manutencao?: string;
  local_realizacao?: string;
  pecas_servicos?: string;
  valor_total?: number;
  contabilizado?: boolean;
}

export interface ManutencaoFiltro {
  placa?: string;
  tipo?: string;
  dataInicio?: string;
  dataFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
}
