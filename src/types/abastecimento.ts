
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
