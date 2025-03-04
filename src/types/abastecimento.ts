
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
  contrato_id?: string;
  contabilizado?: boolean;
  conta_debito?: string;
  conta_credito?: string;
  status?: string;
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
  contrato_id?: string;
  contabilizado?: boolean;
  conta_debito?: string;
  conta_credito?: string;
}

export interface TipoCombustivelFormProps {
  onSuccess: (tipoCombustivel: TipoCombustivel) => void;
}

export interface NovoAbastecimentoFormProps {
  tiposCombustivel: TipoCombustivel[];
  onSave: (data: AbastecimentoFormData) => void;
  initialData?: Partial<AbastecimentoFormData>;
  onCancel?: () => void;
}
