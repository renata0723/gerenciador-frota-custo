
export type TipoManutencao = 'preventiva' | 'corretiva';

export interface ManutencaoItem {
  id: number | null;
  placa_veiculo: string | null;
  tipo_manutencao: TipoManutencao;
  data_manutencao: string | null;
  local_realizacao: "patio" | "externa";
  pecas_servicos: string | null;
  valor_total: number | null;
}
