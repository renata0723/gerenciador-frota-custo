
// Tipos para contratos
export interface DadosContratoFormData {
  idContrato: string;
  dataSaida: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  clienteDestino: string;
  tipo: 'frota' | 'terceiro';
  placaCavalo: string;
  placaCarreta: string;
  motorista: string;
  proprietario: string;
}

export interface DocumentosFormData {
  numeroManifesto: string[];
  numeroCTe: string[];
  notasFiscais: Array<{numero: string, valor: number}>;
  valorCarga: number;
}

export interface DocumentosRegistrosData {
  manifestos: string[];
  ctes: string[];
  notasFiscais: Array<{numero: string, valor: number}>;
  valorCarga: number;
}

export interface FreteContratadoData {
  valorFreteContratado: number;
  valorPedagio: number;
  valorAdiantamento: number;
  dataAdiantamento: string;
  bancoPagamento: string;
  contabilizado: boolean;
  valorSaldoPagar: number;
  contaDebito: string;
  contaCredito: string;
}

export interface ObservacoesData {
  observacoes: string;
  dataEntregaOperacao: string;
  operadorEntrega: string;
}

export interface ContratoCompleto {
  id: number;
  idContrato: string;
  dataSaida: string;
  cidadeOrigem: string;
  estadoOrigem: string;
  cidadeDestino: string;
  estadoDestino: string;
  clienteDestino: string;
  tipo: 'frota' | 'terceiro';
  placaCavalo: string;
  placaCarreta: string;
  motorista: string;
  proprietario: string;
  manifestos: string[];
  ctes: string[];
  notasFiscais: Array<{numero: string, valor: number}>;
  valorCarga: number;
  valorFreteContratado: number;
  valorPedagio: number;
  valorAdiantamento: number;
  dataAdiantamento: string;
  bancoPagamento: string;
  contabilizado: boolean;
  valorSaldoPagar: number;
  contaDebito: string;
  contaCredito: string;
  observacoes: string;
  dataEntregaOperacao: string;
  operadorEntrega: string;
  status: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

// Interface para props dos componentes de formulário
export interface FormularioDocumentosRegistrosProps {
  onSubmit: (data: DocumentosRegistrosData) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialData?: DocumentosRegistrosData;
  readOnly?: boolean;
}

export interface FormularioFreteContratadoProps {
  onSave: (data: FreteContratadoData) => void;
  onBack?: () => void;
  onNext?: () => void;
  initialData?: FreteContratadoData;
  contrato?: any;
  dadosContrato?: any;
  readOnly?: boolean;
}

export interface FormularioObservacoesProps {
  onSubmit: (data: ObservacoesData) => void;
  onBack?: () => void;
  initialData?: ObservacoesData;
  readOnly?: boolean;
}
