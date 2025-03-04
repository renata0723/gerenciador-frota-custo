
-- Função para verificar se uma tabela existe
CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
RETURNS integer
LANGUAGE plpgsql
AS $$
DECLARE
  count_tables integer;
BEGIN
  SELECT COUNT(*) INTO count_tables
  FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = table_name;
  
  RETURN count_tables;
END;
$$;
