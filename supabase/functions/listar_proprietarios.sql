
-- Função para listar proprietários
CREATE OR REPLACE FUNCTION listar_proprietarios()
RETURNS SETOF json AS $$
BEGIN
  RETURN QUERY SELECT 
    json_build_object('nome', nome) 
  FROM "Proprietarios"
  ORDER BY nome;
END;
$$ LANGUAGE plpgsql;
