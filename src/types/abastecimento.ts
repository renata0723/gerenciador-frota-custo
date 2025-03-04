
export type AbastecimentoFormData = {
  valor: number;
  quantidade: number;
  contabilizado: boolean;
  conta_debito: string;
  conta_credito: string;
  contrato_id?: string;
  posto?: string;
  quilometragem?: number;
  responsavel?: string;
  motorista?: string;
  data_abastecimento: string; // Campo obrigatório
  placa?: string;
  tipo_combustivel?: string;
  itens?: string;
};

export type AbastecimentoItem = {
  id?: number;
  data_abastecimento: string;
  placa_veiculo: string;
  tipo_combustivel: string;
  quantidade: number;
  valor_abastecimento: number;
  valor_total: number;
  posto: string;
  motorista_solicitante?: string;
  responsavel_autorizacao?: string;
  quilometragem?: number;
  contabilizado: boolean;
  conta_debito?: string;
  conta_credito?: string;
  status: string;
  contrato_id?: string;
  itens_abastecidos?: string;
};

export interface NovoAbastecimentoFormProps {
  onSubmit: (data: AbastecimentoFormData) => void;
  onCancel: () => void;
  initialData?: Partial<AbastecimentoFormData>;
}

export type TipoCombustivel = {
  id: string;
  nome: string;
  descricao?: string;
};
