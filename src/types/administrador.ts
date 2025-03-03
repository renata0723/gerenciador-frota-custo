
export interface Administrador {
  id: number;
  usuario_id: number;
  nivel_acesso: 'Parcial' | 'Total' | 'Geral';
  created_at?: string;
  ultimo_acesso?: string;
}

export interface CredenciaisAdministrador {
  email: string;
  senha: string;
}
