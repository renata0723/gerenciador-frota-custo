
export interface AbastecimentoItem {
  id?: number;
  data_abastecimento: string;
  placa_veiculo: string;
  motorista_solicitante: string;
  tipo_combustivel: string;
  valor_abastecimento: number;
  quantidade: number;
  quilometragem: number;
  posto: string;
  responsavel_autorizacao: string;
  itens_abastecidos: string;
  valor_total: number;
}

export interface TipoCombustivel {
  id: string;
  nome: string;
  descricao?: string;
}

export interface AbastecimentoFormData {
  data: string;
  placa: string;
  motorista: string;
  tipoCombustivel: string;
  valor: number;
  quantidade: number;
  quilometragem: number;
  posto: string;
  responsavel: string;
  itens: string;
}

export interface TipoCombustivelFormProps {
  onTipoCombustivelAdded: (tipoCombustivel: TipoCombustivel) => void;
}

export interface NovoAbastecimentoFormProps {
  tiposCombustivel: TipoCombustivel[];
  onAbastecimentoAdicionado: () => void;
}
