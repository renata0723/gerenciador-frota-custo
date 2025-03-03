
export type TipoManutencao = 'preventiva' | 'corretiva';

export interface ManutencaoItem {
  id?: number;
  data_manutencao: string;
  placa_veiculo: string;
  tipo_manutencao: TipoManutencao;
  local_realizacao: "patio" | "externa";
  pecas_servicos: string;
  valor_total: number;
}

export interface ManutencaoFormData {
  data: string;
  placa: string;
  tipo: TipoManutencao;
  local: "patio" | "externa";
  pecasServicos: string;
  valorTotal: number;
}
