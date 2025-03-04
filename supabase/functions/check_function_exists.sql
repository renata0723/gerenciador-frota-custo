
-- Função para verificar se outra função existe
CREATE OR REPLACE FUNCTION check_function_exists(function_name text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  exists_count integer;
BEGIN
  SELECT COUNT(*) INTO exists_count
  FROM pg_proc p
  JOIN pg_namespace n ON p.pronamespace = n.oid
  WHERE n.nspname = 'public'
  AND p.proname = function_name;
  
  RETURN exists_count > 0;
END;
$$;
