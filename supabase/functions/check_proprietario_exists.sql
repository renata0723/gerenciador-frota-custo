
-- Função para verificar se um proprietário existe por nome
CREATE OR REPLACE FUNCTION check_proprietario_exists(proprietario_nome TEXT)
RETURNS json AS $$
DECLARE
  proprietario_record RECORD;
  result json;
BEGIN
  SELECT * FROM "Proprietarios" WHERE nome = proprietario_nome LIMIT 1 INTO proprietario_record;
  
  IF proprietario_record IS NOT NULL THEN
    result := json_build_object('exists', true);
  ELSE
    result := json_build_object('exists', false);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
