
export type TipoManutencao = "preventiva" | "corretiva";
export type LocalRealizacao = "patio" | "externa";

export interface ManutencaoItem {
  id?: number;
  placa_veiculo: string;
  data_manutencao: string;
  tipo_manutencao: TipoManutencao;
  local_realizacao: LocalRealizacao;
  pecas_servicos: string;
  valor_total: number;
}

export interface ManutencaoFormData {
  placa: string;
  data: string;
  tipo: TipoManutencao;
  local: LocalRealizacao;
  pecasServicos: string;
  valor: number;
}
