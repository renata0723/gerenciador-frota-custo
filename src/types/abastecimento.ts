
export interface TipoCombustivel {
  id: string;
  nome: string;
  descricao?: string;
}

export interface AbastecimentoItem {
  id?: number;
  data_abastecimento: string;
  placa_veiculo: string;
  quilometragem: number;
  tipo_combustivel: string;
  posto: string;
  motorista_solicitante: string;
  responsavel_autorizacao?: string;
  valor_total: number;
  quantidade: number;
}

export interface AbastecimentoFormData {
  data: string;
  placa: string;
  motorista: string;
  tipoCombustivel: string;
  quantidade: number;
  valor: number;
  posto: string;
  responsavel: string;
  quilometragem: number;
}
