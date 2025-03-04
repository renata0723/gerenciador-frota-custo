
-- Função para criar a tabela Folha_Pagamento
CREATE OR REPLACE FUNCTION create_folha_pagamento_table()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS "Folha_Pagamento" (
    id SERIAL PRIMARY KEY,
    funcionario_nome TEXT NOT NULL,
    salario_base NUMERIC NOT NULL,
    data_pagamento DATE NOT NULL,
    mes_referencia TEXT NOT NULL,
    ano_referencia TEXT NOT NULL,
    inss NUMERIC,
    fgts NUMERIC,
    ir NUMERIC,
    vale_transporte NUMERIC,
    vale_refeicao NUMERIC,
    outros_descontos NUMERIC,
    outros_beneficios NUMERIC,
    valor_liquido NUMERIC NOT NULL,
    observacoes TEXT,
    status TEXT NOT NULL DEFAULT 'concluido',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
  );
END;
$$;
