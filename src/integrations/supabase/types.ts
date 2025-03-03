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
      Contratos: {
        Row: {
          cidade_destino: string | null
          cidade_origem: string | null
          cliente_destino: string | null
          data_saida: string | null
          id: number | null
          motorista_id: number | null
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
          data_despesa: string | null
          descricao_detalhada: string | null
          id: number | null
          tipo_despesa: string | null
          valor_despesa: number | null
        }
        Insert: {
          data_despesa?: string | null
          descricao_detalhada?: string | null
          id?: number | null
          tipo_despesa?: string | null
          valor_despesa?: number | null
        }
        Update: {
          data_despesa?: string | null
          descricao_detalhada?: string | null
          id?: number | null
          tipo_despesa?: string | null
          valor_despesa?: number | null
        }
        Relationships: []
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
          tipo_veiculo?: string | null
          valor_cotacao?: number | null
          valor_nota_fiscal?: number | null
          volume?: number | null
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
          valor_total: number | null
        }
        Insert: {
          banco_pagamento?: string | null
          contratos_associados?: string | null
          dados_bancarios?: string | null
          data_pagamento?: string | null
          id?: number | null
          parceiro?: string | null
          valor_total?: number | null
        }
        Update: {
          banco_pagamento?: string | null
          contratos_associados?: string | null
          dados_bancarios?: string | null
          data_pagamento?: string | null
          id?: number | null
          parceiro?: string | null
          valor_total?: number | null
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
      [_ in never]: never
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
