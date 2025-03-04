
// Constantes para o sistema
import { TipoManutencao } from '@/types/manutencao';

export const estadosBrasileiros = [
  { nome: 'Acre', sigla: 'AC' },
  { nome: 'Alagoas', sigla: 'AL' },
  { nome: 'Amapá', sigla: 'AP' },
  { nome: 'Amazonas', sigla: 'AM' },
  { nome: 'Bahia', sigla: 'BA' },
  { nome: 'Ceará', sigla: 'CE' },
  { nome: 'Distrito Federal', sigla: 'DF' },
  { nome: 'Espírito Santo', sigla: 'ES' },
  { nome: 'Goiás', sigla: 'GO' },
  { nome: 'Maranhão', sigla: 'MA' },
  { nome: 'Mato Grosso', sigla: 'MT' },
  { nome: 'Mato Grosso do Sul', sigla: 'MS' },
  { nome: 'Minas Gerais', sigla: 'MG' },
  { nome: 'Pará', sigla: 'PA' },
  { nome: 'Paraíba', sigla: 'PB' },
  { nome: 'Paraná', sigla: 'PR' },
  { nome: 'Pernambuco', sigla: 'PE' },
  { nome: 'Piauí', sigla: 'PI' },
  { nome: 'Rio de Janeiro', sigla: 'RJ' },
  { nome: 'Rio Grande do Norte', sigla: 'RN' },
  { nome: 'Rio Grande do Sul', sigla: 'RS' },
  { nome: 'Rondônia', sigla: 'RO' },
  { nome: 'Roraima', sigla: 'RR' },
  { nome: 'Santa Catarina', sigla: 'SC' },
  { nome: 'São Paulo', sigla: 'SP' },
  { nome: 'Sergipe', sigla: 'SE' },
  { nome: 'Tocantins', sigla: 'TO' }
];

export const categoriasManutencao: TipoManutencao[] = [
  { id: 'preventiva', nome: 'Preventiva', descricao: 'Manutenção realizada para evitar falhas' },
  { id: 'corretiva', nome: 'Corretiva', descricao: 'Manutenção realizada para corrigir falhas' },
  { id: 'preditiva', nome: 'Preditiva', descricao: 'Manutenção baseada em previsão de falhas' }
];

export const origemManutencao = [
  { value: 'patio', label: 'Pátio' },
  { value: 'externa', label: 'Externa' }
];

export const tipoVeiculo = [
  { value: 'cavalo', label: 'Cavalo Mecânico' },
  { value: 'carreta', label: 'Carreta' },
  { value: 'truck', label: 'Caminhão Truck' },
  { value: 'outro', label: 'Outro' }
];

export const tipoFrota = [
  { value: 'propria', label: 'Frota Própria' },
  { value: 'terceiro', label: 'Terceirizado' }
];

export const situacaoVeiculo = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'manutencao', label: 'Em Manutenção' },
  { value: 'inativo', label: 'Inativo' }
];

export const tipoPlacaVeiculo = [
  { value: 'cavalo', label: 'Cavalo Mecânico' },
  { value: 'carreta', label: 'Carreta' },
  { value: 'conjunto', label: 'Conjunto (Cavalo + Carreta)' }
];

export const tipoFormaPagamento = [
  { value: 'pix', label: 'PIX' },
  { value: 'ted', label: 'TED' },
  { value: 'deposito', label: 'Depósito Bancário' },
  { value: 'cheque', label: 'Cheque' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'outro', label: 'Outro' }
];

// Define os status como um array de objetos para utilização em selects e depois adiciona aliases para facilitar o acesso
const STATUS_PAGAMENTO = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'parcial', label: 'Parcial' },
  { value: 'pago', label: 'Pago' },
  { value: 'cancelado', label: 'Cancelado' },
  { value: 'liberado', label: 'Liberado' }
];

// Adiciona os aliases para facilitar o acesso via índice
STATUS_PAGAMENTO.PENDENTE = STATUS_PAGAMENTO[0];
STATUS_PAGAMENTO.PARCIAL = STATUS_PAGAMENTO[1];
STATUS_PAGAMENTO.PAGO = STATUS_PAGAMENTO[2];
STATUS_PAGAMENTO.CANCELADO = STATUS_PAGAMENTO[3];
STATUS_PAGAMENTO.LIBERADO = STATUS_PAGAMENTO[4];

export { STATUS_PAGAMENTO };

// Tipos de conta para dados bancários
export const tipoConta = [
  { value: 'corrente', label: 'Conta Corrente' },
  { value: 'poupanca', label: 'Conta Poupança' }
];

// Status para notas fiscais
export const statusNotas = [
  { value: 'pendente', label: 'Pendente' },
  { value: 'em_transito', label: 'Em Trânsito' },
  { value: 'entregue', label: 'Entregue' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'devolvida', label: 'Devolvida' }
];

// Tipos de impostos para cálculo
export const tiposImpostos = [
  { value: 'pis', label: 'PIS' },
  { value: 'cofins', label: 'COFINS' },
  { value: 'csll', label: 'CSLL' },
  { value: 'irpj', label: 'IRPJ' },
  { value: 'icms', label: 'ICMS' },
  { value: 'iss', label: 'ISS' }
];

// Regimes tributários
export const regimesTributarios = [
  { value: 'simples_nacional', label: 'Simples Nacional' },
  { value: 'lucro_presumido', label: 'Lucro Presumido' },
  { value: 'lucro_real', label: 'Lucro Real' }
];

// Tipos de créditos tributários
export const tiposCreditosTributarios = [
  { value: 'pis_cofins', label: 'PIS/COFINS' },
  { value: 'icms', label: 'ICMS' },
  { value: 'ipi', label: 'IPI' },
  { value: 'outros', label: 'Outros' }
];
