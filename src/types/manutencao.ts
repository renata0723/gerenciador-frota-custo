
export interface ManutencaoItem {
  id: number;
  tipo_manutencao: "preventiva" | "corretiva";
  placa_veiculo: string;
  data_manutencao: string;
  local_realizacao: "patio" | "externa";
  pecas_servicos: string;
  valor_total: number;
}

export interface NovaManutencaoFormProps {
  onSuccess: (data: ManutencaoItem) => void;
}
