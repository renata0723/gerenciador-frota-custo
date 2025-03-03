
export interface TipoCombustivel {
  id: string;
  nome: string;
  descricao?: string;
}

export interface TipoCombustivelFormData {
  nome: string;
  descricao?: string;
  id?: string; // Adicionando id como opcional para compatibilidade com TipoCombustivel
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

export interface AbastecimentoItem {
  tipo: string;
  quantidade: number;
}

export interface Abastecimento {
  id: number;
  data_abastecimento: string;
  placa_veiculo: string;
  motorista_solicitante: string;
  tipo_combustivel: string;
  valor_abastecimento: number;
  valor_total: number;
  posto: string;
  responsavel_autorizacao: string;
  quilometragem: number;
  itens_abastecidos: string; // JSON string que será convertido para AbastecimentoItem[]
}
