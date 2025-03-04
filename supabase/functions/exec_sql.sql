
-- Função para executar SQL dinamicamente
-- ATENÇÃO: Esta função pode representar um risco de segurança se mal utilizada
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql_query;
END;
$$;
