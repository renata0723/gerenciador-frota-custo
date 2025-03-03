
export type StatusUsuario = 'ativo' | 'inativo' | 'bloqueado';

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  cargo?: string;
  status: StatusUsuario;
  ultimo_acesso?: string;
  created_at?: string;
}

export interface Permissao {
  id?: number;
  modulo: string;
  acao: string;
  descricao?: string;
  created_at?: string;
}

export interface PermissaoUsuario {
  id?: number;
  usuario_id: number;
  permissao_id: number;
  concedido_por?: number;
  created_at?: string;
  modulo?: string; // Campo virtual para exibição
  acao?: string;   // Campo virtual para exibição
}

export interface UsuarioComPermissoes extends Usuario {
  permissoes: PermissaoUsuario[];
}
