
export interface Motorista {
  id: string;
  nome: string;
  cpf: string;
  cnh?: string;
  categoriaCnh?: string;
  vencimentoCnh?: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  dataContratacao?: string;
  status: 'active' | 'inactive';
  observacoes?: string;
}

export interface MotoristaSimples {
  nome: string;
  cpf: string;
  telefone?: string;
}

export interface MotoristaCompleto extends MotoristaSimples {
  cnh: string;
  categoriaCnh: string;
  vencimentoCnh: string;
  endereco?: string;
  dataNascimento?: string;
  dataContratacao?: string;
  status: 'active' | 'inactive';
  observacoes?: string;
}
