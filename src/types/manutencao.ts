
export interface ManutencaoItem {
  id?: number | null;
  data_manutencao: string | null;
  placa_veiculo: string | null;
  tipo_manutencao: "preventiva" | "corretiva";
  local_realizacao: "patio" | "externa";
  pecas_servicos: string | null;
  valor_total: number | null;
}

export type TipoManutencao = "preventiva" | "corretiva";
