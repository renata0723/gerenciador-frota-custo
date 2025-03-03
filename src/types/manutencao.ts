
import { TipoManutencao } from "@/utils/constants";

export interface ManutencaoItem {
  id: number;
  placa_veiculo: string;
  data_manutencao: string;
  tipo_manutencao: TipoManutencao;
  local_realizacao: string;
  pecas_servicos: string;
  valor_total: number;
}
