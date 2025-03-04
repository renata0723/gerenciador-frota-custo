export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Abastecimentos: {
        Row: {
          data_abastecimento: string | null
          id: number | null
          itens_abastecidos: string | null
          motorista_solicitante: string | null
          placa_veiculo: string | null
          posto: string | null
          quilometragem: number | null
          responsavel_autorizacao: string | null
          tipo_combustivel: string | null
          valor_abastecimento: number | null
          valor_total: number | null
        }
        Insert: {
          data_abastecimento?: string | null
          id?: number | null
          itens_abastecidos?: string | null
          motorista_solicitante?: string | null
          placa_veiculo?: string | null
          posto?: string | null
          quilometragem?: number | null
          responsavel_autorizacao?: string | null
          tipo_combustivel?: string | null
          valor_abastecimento?: number | null
          valor_total?: number | null
        }
        Update: {
          data_abastecimento?: string | null
          id?: number | null
          itens_abastecidos?: string | null
          motorista_solicitante?: string | null
          placa_veiculo?: string | null
          posto?: string | null
          quilometragem?: number | null
          responsavel_autorizacao?: string | null
          tipo_combustivel?: string | null
          valor_abastecimento?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
      Administradores: {
        Row: {
          created_at: string | null
          id: number
          nivel_acesso: string
          ultimo_acesso: string | null
          usuario_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          nivel_acesso: string
          ultimo_acesso?: string | null
          usuario_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          nivel_acesso?: string
          ultimo_acesso?: string | null
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Administradores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Cancelamentos: {
        Row: {
          created_at: string | null
          data_cancelamento: string | null
          id: number
          motivo: string
          numero_documento: string
          observacoes: string | null
          responsavel: string
          tipo_documento: string
        }
        Insert: {
          created_at?: string | null
          data_cancelamento?: string | null
          id?: number
          motivo: string
          numero_documento: string
          observacoes?: string | null
          responsavel: string
          tipo_documento: string
        }
        Update: {
          created_at?: string | null
          data_cancelamento?: string | null
          id?: number
          motivo?: string
          numero_documento?: string
          observacoes?: string | null
          responsavel?: string
          tipo_documento?: string
        }
        Relationships: []
      }
      Canhoto: {
        Row: {
          cliente: string | null
          contrato_id: string | null
          data_entrega_cliente: string | null
          data_programada_pagamento: string | null
          data_recebimento_canhoto: string | null
          id: number | null
          motorista: string | null
          numero_cte: string | null
          numero_manifesto: string | null
          numero_nota_fiscal: string | null
          proprietario_veiculo: string | null
          responsavel_recebimento: string | null
          saldo_a_pagar: number | null
          status: string | null
        }
        Insert: {
          cliente?: string | null
          contrato_id?: string | null
          data_entrega_cliente?: string | null
          data_programada_pagamento?: string | null
          data_recebimento_canhoto?: string | null
          id?: number | null
          motorista?: string | null
          numero_cte?: string | null
          numero_manifesto?: string | null
          numero_nota_fiscal?: string | null
          proprietario_veiculo?: string | null
          responsavel_recebimento?: string | null
          saldo_a_pagar?: number | null
          status?: string | null
        }
        Update: {
          cliente?: string | null
          contrato_id?: string | null
          data_entrega_cliente?: string | null
          data_programada_pagamento?: string | null
          data_recebimento_canhoto?: string | null
          id?: number | null
          motorista?: string | null
          numero_cte?: string | null
          numero_manifesto?: string | null
          numero_nota_fiscal?: string | null
          proprietario_veiculo?: string | null
          responsavel_recebimento?: string | null
          saldo_a_pagar?: number | null
          status?: string | null
        }
        Relationships: []
      }
      Centros_Custo: {
        Row: {
          codigo: string
          nome: string
          responsavel: string | null
          status: string
        }
        Insert: {
          codigo: string
          nome: string
          responsavel?: string | null
          status?: string
        }
        Update: {
          codigo?: string
          nome?: string
          responsavel?: string | null
          status?: string
        }
        Relationships: []
      }
      Contratos: {
        Row: {
          cidade_destino: string | null
          cidade_origem: string | null
          cliente_destino: string | null
          data_saida: string | null
          id: number | null
          motorista_id: number | null
          notas_fiscais: string[] | null
          placa_carreta: string | null
          placa_cavalo: string | null
          proprietario: string | null
          status_contrato: string | null
          tipo_frota: string | null
          valor_adicional: number | null
          valor_carga: number | null
          valor_frete: number | null
        }
        Insert: {
          cidade_destino?: string | null
          cidade_origem?: string | null
          cliente_destino?: string | null
          data_saida?: string | null
          id?: number | null
          motorista_id?: number | null
          notas_fiscais?: string[] | null
          placa_carreta?: string | null
          placa_cavalo?: string | null
          proprietario?: string | null
          status_contrato?: string | null
          tipo_frota?: string | null
          valor_adicional?: number | null
          valor_carga?: number | null
          valor_frete?: number | null
        }
        Update: {
          cidade_destino?: string | null
          cidade_origem?: string | null
          cliente_destino?: string | null
          data_saida?: string | null
          id?: number | null
          motorista_id?: number | null
          notas_fiscais?: string[] | null
          placa_carreta?: string | null
          placa_cavalo?: string | null
          proprietario?: string | null
          status_contrato?: string | null
          tipo_frota?: string | null
          valor_adicional?: number | null
          valor_carga?: number | null
          valor_frete?: number | null
        }
        Relationships: []
      }
      "Despesas Gerais": {
        Row: {
          categoria: string | null
          conta_contabil: string | null
          contabilizado: boolean | null
          contrato_id: string | null
          data_despesa: string | null
          descricao_detalhada: string | null
          id: number | null
          rateio: boolean | null
          tipo_despesa: string | null
          valor_despesa: number | null
        }
        Insert: {
          categoria?: string | null
          conta_contabil?: string | null
          contabilizado?: boolean | null
          contrato_id?: string | null
          data_despesa?: string | null
          descricao_detalhada?: string | null
          id?: number | null
          rateio?: boolean | null
          tipo_despesa?: string | null
          valor_despesa?: number | null
        }
        Update: {
          categoria?: string | null
          conta_contabil?: string | null
          contabilizado?: boolean | null
          contrato_id?: string | null
          data_despesa?: string | null
          descricao_detalhada?: string | null
          id?: number | null
          rateio?: boolean | null
          tipo_despesa?: string | null
          valor_despesa?: number | null
        }
        Relationships: []
      }
      DRE: {
        Row: {
          created_at: string | null
          custos_operacionais: number | null
          despesas_administrativas: number | null
          id: number
          periodo_fim: string
          periodo_inicio: string
          receita_bruta: number | null
          receita_liquida: number | null
          resultado_periodo: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custos_operacionais?: number | null
          despesas_administrativas?: number | null
          id?: number
          periodo_fim: string
          periodo_inicio: string
          receita_bruta?: number | null
          receita_liquida?: number | null
          resultado_periodo?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custos_operacionais?: number | null
          despesas_administrativas?: number | null
          id?: number
          periodo_fim?: string
          periodo_inicio?: string
          receita_bruta?: number | null
          receita_liquida?: number | null
          resultado_periodo?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      Folha_Pagamento: {
        Row: {
          ano_referencia: string
          created_at: string | null
          data_pagamento: string
          fgts: number | null
          funcionario_nome: string
          id: number
          inss: number | null
          ir: number | null
          mes_referencia: string
          observacoes: string | null
          outros_beneficios: number | null
          outros_descontos: number | null
          salario_base: number
          status: string
          vale_refeicao: number | null
          vale_transporte: number | null
          valor_liquido: number
        }
        Insert: {
          ano_referencia: string
          created_at?: string | null
          data_pagamento: string
          fgts?: number | null
          funcionario_nome: string
          id?: number
          inss?: number | null
          ir?: number | null
          mes_referencia: string
          observacoes?: string | null
          outros_beneficios?: number | null
          outros_descontos?: number | null
          salario_base: number
          status?: string
          vale_refeicao?: number | null
          vale_transporte?: number | null
          valor_liquido: number
        }
        Update: {
          ano_referencia?: string
          created_at?: string | null
          data_pagamento?: string
          fgts?: number | null
          funcionario_nome?: string
          id?: number
          inss?: number | null
          ir?: number | null
          mes_referencia?: string
          observacoes?: string | null
          outros_beneficios?: number | null
          outros_descontos?: number | null
          salario_base?: number
          status?: string
          vale_refeicao?: number | null
          vale_transporte?: number | null
          valor_liquido?: number
        }
        Relationships: []
      }
      Lancamentos_Contabeis: {
        Row: {
          centro_custo: string | null
          conta_credito: string
          conta_debito: string
          created_at: string | null
          data_competencia: string
          data_lancamento: string
          documento_referencia: string | null
          historico: string
          id: number
          periodo_fiscal_fechado: boolean | null
          status: string
          tipo_documento: string | null
          valor: number
        }
        Insert: {
          centro_custo?: string | null
          conta_credito: string
          conta_debito: string
          created_at?: string | null
          data_competencia: string
          data_lancamento: string
          documento_referencia?: string | null
          historico: string
          id?: number
          periodo_fiscal_fechado?: boolean | null
          status?: string
          tipo_documento?: string | null
          valor: number
        }
        Update: {
          centro_custo?: string | null
          conta_credito?: string
          conta_debito?: string
          created_at?: string | null
          data_competencia?: string
          data_lancamento?: string
          documento_referencia?: string | null
          historico?: string
          id?: number
          periodo_fiscal_fechado?: boolean | null
          status?: string
          tipo_documento?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "Lancamentos_Contabeis_centro_custo_fkey"
            columns: ["centro_custo"]
            isOneToOne: false
            referencedRelation: "Centros_Custo"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "Lancamentos_Contabeis_conta_credito_fkey"
            columns: ["conta_credito"]
            isOneToOne: false
            referencedRelation: "Plano_Contas"
            referencedColumns: ["codigo"]
          },
          {
            foreignKeyName: "Lancamentos_Contabeis_conta_debito_fkey"
            columns: ["conta_debito"]
            isOneToOne: false
            referencedRelation: "Plano_Contas"
            referencedColumns: ["codigo"]
          },
        ]
      }
      Livro_Caixa: {
        Row: {
          created_at: string | null
          data_movimento: string
          descricao: string
          documento_referencia: string | null
          id: number
          lancamento_contabil_id: number | null
          saldo: number
          status: string
          tipo: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data_movimento: string
          descricao: string
          documento_referencia?: string | null
          id?: number
          lancamento_contabil_id?: number | null
          saldo: number
          status?: string
          tipo: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data_movimento?: string
          descricao?: string
          documento_referencia?: string | null
          id?: number
          lancamento_contabil_id?: number | null
          saldo?: number
          status?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "Livro_Caixa_lancamento_contabil_id_fkey"
            columns: ["lancamento_contabil_id"]
            isOneToOne: false
            referencedRelation: "Lancamentos_Contabeis"
            referencedColumns: ["id"]
          },
        ]
      }
      Manutenção: {
        Row: {
          data_manutencao: string | null
          id: number | null
          local_realizacao: string | null
          pecas_servicos: string | null
          placa_veiculo: string | null
          tipo_manutencao: string | null
          valor_total: number | null
        }
        Insert: {
          data_manutencao?: string | null
          id?: number | null
          local_realizacao?: string | null
          pecas_servicos?: string | null
          placa_veiculo?: string | null
          tipo_manutencao?: string | null
          valor_total?: number | null
        }
        Update: {
          data_manutencao?: string | null
          id?: number | null
          local_realizacao?: string | null
          pecas_servicos?: string | null
          placa_veiculo?: string | null
          tipo_manutencao?: string | null
          valor_total?: number | null
        }
        Relationships: []
      }
      Motorista: {
        Row: {
          cpf: string | null
          id: number | null
          informacoes_adicionais: string | null
          nome: string | null
        }
        Insert: {
          cpf?: string | null
          id?: number | null
          informacoes_adicionais?: string | null
          nome?: string | null
        }
        Update: {
          cpf?: string | null
          id?: number | null
          informacoes_adicionais?: string | null
          nome?: string | null
        }
        Relationships: []
      }
      Motoristas: {
        Row: {
          categoria_cnh: string | null
          cnh: string | null
          cpf: string | null
          data_contratacao: string | null
          data_nascimento: string | null
          endereco: string | null
          id: number
          nome: string
          observacoes: string | null
          proprietario_vinculado: string | null
          status: string | null
          telefone: string | null
          tipo: string | null
          tipo_cadastro: string | null
          vencimento_cnh: string | null
        }
        Insert: {
          categoria_cnh?: string | null
          cnh?: string | null
          cpf?: string | null
          data_contratacao?: string | null
          data_nascimento?: string | null
          endereco?: string | null
          id?: number
          nome: string
          observacoes?: string | null
          proprietario_vinculado?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string | null
          tipo_cadastro?: string | null
          vencimento_cnh?: string | null
        }
        Update: {
          categoria_cnh?: string | null
          cnh?: string | null
          cpf?: string | null
          data_contratacao?: string | null
          data_nascimento?: string | null
          endereco?: string | null
          id?: number
          nome?: string
          observacoes?: string | null
          proprietario_vinculado?: string | null
          status?: string | null
          telefone?: string | null
          tipo?: string | null
          tipo_cadastro?: string | null
          vencimento_cnh?: string | null
        }
        Relationships: []
      }
      "Notas Fiscais": {
        Row: {
          carga_batida_paleteizada: string | null
          cidade_destino: string | null
          cliente_destinatario: string | null
          data_coleta: string | null
          data_prevista_entrega: string | null
          estado_destino: string | null
          horario_coleta: string | null
          numero_nota_fiscal: number | null
          numero_paletes: number | null
          peso_total: number | null
          quantidade_paletes: number | null
          senha_agendamento: string | null
          status_nota: string | null
          tipo_veiculo: string | null
          valor_cotacao: number | null
          valor_nota_fiscal: number | null
          volume: number | null
        }
        Insert: {
          carga_batida_paleteizada?: string | null
          cidade_destino?: string | null
          cliente_destinatario?: string | null
          data_coleta?: string | null
          data_prevista_entrega?: string | null
          estado_destino?: string | null
          horario_coleta?: string | null
          numero_nota_fiscal?: number | null
          numero_paletes?: number | null
          peso_total?: number | null
          quantidade_paletes?: number | null
          senha_agendamento?: string | null
          status_nota?: string | null
          tipo_veiculo?: string | null
          valor_cotacao?: number | null
          valor_nota_fiscal?: number | null
          volume?: number | null
        }
        Update: {
          carga_batida_paleteizada?: string | null
          cidade_destino?: string | null
          cliente_destinatario?: string | null
          data_coleta?: string | null
          data_prevista_entrega?: string | null
          estado_destino?: string | null
          horario_coleta?: string | null
          numero_nota_fiscal?: number | null
          numero_paletes?: number | null
          peso_total?: number | null
          quantidade_paletes?: number | null
          senha_agendamento?: string | null
          status_nota?: string | null
          tipo_veiculo?: string | null
          valor_cotacao?: number | null
          valor_nota_fiscal?: number | null
          volume?: number | null
        }
        Relationships: []
      }
      Permissoes: {
        Row: {
          acao: string
          created_at: string | null
          descricao: string | null
          id: number
          modulo: string
        }
        Insert: {
          acao: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          modulo: string
        }
        Update: {
          acao?: string
          created_at?: string | null
          descricao?: string | null
          id?: number
          modulo?: string
        }
        Relationships: []
      }
      Plano_Contas: {
        Row: {
          codigo: string
          codigo_reduzido: string
          conta_pai: string | null
          natureza: string
          nivel: number
          nome: string
          status: string
          tipo: string
        }
        Insert: {
          codigo: string
          codigo_reduzido: string
          conta_pai?: string | null
          natureza: string
          nivel: number
          nome: string
          status?: string
          tipo: string
        }
        Update: {
          codigo?: string
          codigo_reduzido?: string
          conta_pai?: string | null
          natureza?: string
          nivel?: number
          nome?: string
          status?: string
          tipo?: string
        }
        Relationships: []
      }
      Proprietarios: {
        Row: {
          created_at: string | null
          dados_bancarios: string | null
          documento: string | null
          nome: string
        }
        Insert: {
          created_at?: string | null
          dados_bancarios?: string | null
          documento?: string | null
          nome: string
        }
        Update: {
          created_at?: string | null
          dados_bancarios?: string | null
          documento?: string | null
          nome?: string
        }
        Relationships: []
      }
      Relatórios: {
        Row: {
          data_geracao: string | null
          descricao: string | null
          id: number | null
          periodo: string | null
          tipo_relatorio: string | null
        }
        Insert: {
          data_geracao?: string | null
          descricao?: string | null
          id?: number | null
          periodo?: string | null
          tipo_relatorio?: string | null
        }
        Update: {
          data_geracao?: string | null
          descricao?: string | null
          id?: number | null
          periodo?: string | null
          tipo_relatorio?: string | null
        }
        Relationships: []
      }
      "Saldo a pagar": {
        Row: {
          banco_pagamento: string | null
          contratos_associados: string | null
          dados_bancarios: string | null
          data_pagamento: string | null
          id: number | null
          parceiro: string | null
          saldo_restante: number | null
          valor_pago: number | null
          valor_total: number | null
          vencimento: string | null
        }
        Insert: {
          banco_pagamento?: string | null
          contratos_associados?: string | null
          dados_bancarios?: string | null
          data_pagamento?: string | null
          id?: number | null
          parceiro?: string | null
          saldo_restante?: number | null
          valor_pago?: number | null
          valor_total?: number | null
          vencimento?: string | null
        }
        Update: {
          banco_pagamento?: string | null
          contratos_associados?: string | null
          dados_bancarios?: string | null
          data_pagamento?: string | null
          id?: number | null
          parceiro?: string | null
          saldo_restante?: number | null
          valor_pago?: number | null
          valor_total?: number | null
          vencimento?: string | null
        }
        Relationships: []
      }
      TiposCombustivel: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id: string
          nome: string
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
        }
        Relationships: []
      }
      UsuarioPermissoes: {
        Row: {
          concedido_por: number | null
          created_at: string | null
          id: number
          permissao_id: number | null
          usuario_id: number | null
        }
        Insert: {
          concedido_por?: number | null
          created_at?: string | null
          id?: number
          permissao_id?: number | null
          usuario_id?: number | null
        }
        Update: {
          concedido_por?: number | null
          created_at?: string | null
          id?: number
          permissao_id?: number | null
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "UsuarioPermissoes_concedido_por_fkey"
            columns: ["concedido_por"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UsuarioPermissoes_permissao_id_fkey"
            columns: ["permissao_id"]
            isOneToOne: false
            referencedRelation: "Permissoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "UsuarioPermissoes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "Usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      Usuarios: {
        Row: {
          cargo: string | null
          created_at: string | null
          email: string
          id: number
          nome: string
          senha: string
          status: string
          ultimo_acesso: string | null
        }
        Insert: {
          cargo?: string | null
          created_at?: string | null
          email: string
          id?: number
          nome: string
          senha: string
          status?: string
          ultimo_acesso?: string | null
        }
        Update: {
          cargo?: string | null
          created_at?: string | null
          email?: string
          id?: number
          nome?: string
          senha?: string
          status?: string
          ultimo_acesso?: string | null
        }
        Relationships: []
      }
      VeiculoProprietarios: {
        Row: {
          created_at: string | null
          id: number
          placa_cavalo: string
          proprietario_nome: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          placa_cavalo: string
          proprietario_nome: string
        }
        Update: {
          created_at?: string | null
          id?: number
          placa_cavalo?: string
          proprietario_nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "VeiculoProprietarios_placa_cavalo_fkey"
            columns: ["placa_cavalo"]
            isOneToOne: false
            referencedRelation: "Veiculos"
            referencedColumns: ["placa_cavalo"]
          },
          {
            foreignKeyName: "VeiculoProprietarios_proprietario_nome_fkey"
            columns: ["proprietario_nome"]
            isOneToOne: false
            referencedRelation: "Proprietarios"
            referencedColumns: ["nome"]
          },
        ]
      }
      Veiculos: {
        Row: {
          data_inativacao: string | null
          motivo_inativacao: string | null
          placa_carreta: string | null
          placa_cavalo: string | null
          status_veiculo: string | null
          tipo_frota: string | null
        }
        Insert: {
          data_inativacao?: string | null
          motivo_inativacao?: string | null
          placa_carreta?: string | null
          placa_cavalo?: string | null
          status_veiculo?: string | null
          tipo_frota?: string | null
        }
        Update: {
          data_inativacao?: string | null
          motivo_inativacao?: string | null
          placa_carreta?: string | null
          placa_cavalo?: string | null
          status_veiculo?: string | null
          tipo_frota?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_function_exists: {
        Args: {
          function_name: string
        }
        Returns: boolean
      }
      check_table_exists: {
        Args: {
          table_name: string
        }
        Returns: number
      }
      create_folha_pagamento_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      exec_sql: {
        Args: {
          sql_query: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
