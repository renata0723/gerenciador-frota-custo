
/**
 * Valida formatos de placa (padrão antigo: ABC-1234 ou novo: ABC1D23)
 * @param placa 
 * @returns boolean
 */
export const validarPlaca = (placa: string): boolean => {
  if (!placa || typeof placa !== 'string') return false;
  
  const placaUpperCase = placa.toUpperCase().trim();
  console.log('Validando placa:', placaUpperCase);
  
  // Formatos aceitos:
  // 1. Padrão antigo com hífen: ABC-1234
  // 2. Padrão antigo sem hífen: ABC1234
  // 3. Padrão Mercosul: ABC1D23
  const regexAntigoMercosul = /^[A-Z]{3}-\d{4}$/;
  const regexNovoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  const regexAntigoSemHifen = /^[A-Z]{3}\d{4}$/;
  
  const isValid = regexAntigoMercosul.test(placaUpperCase) || 
                  regexNovoMercosul.test(placaUpperCase) ||
                  regexAntigoSemHifen.test(placaUpperCase);
  
  console.log('Placa é válida:', isValid);
  return isValid;
};

/**
 * Formata a placa para o padrão correto e converte para maiúsculas
 * @param placa 
 * @returns 
 */
export const formatarPlaca = (placa: string): string => {
  if (!placa || typeof placa !== 'string') return '';
  
  // Remover espaços e converter para maiúsculas
  const placaLimpa = placa.toUpperCase().trim();
  
  // Se tiver hífen, manter o formato
  if (placaLimpa.includes('-')) {
    return placaLimpa;
  }
  
  // Formatar placa no padrão antigo (ABC1234 -> ABC-1234) se for o padrão antigo
  if (/^[A-Z]{3}\d{4}$/.test(placaLimpa)) {
    return `${placaLimpa.substring(0, 3)}-${placaLimpa.substring(3)}`;
  }
  
  // Se for padrão Mercosul ou outro formato, retornar como está
  return placaLimpa;
};

/**
 * Verifica se uma placa já existe no banco de dados
 * @param placa Placa a ser verificada
 * @param tipo Tipo do veículo (cavalo ou carreta)
 * @returns true se a placa já existe, false caso contrário
 */
export const verificarPlacaExistente = async (placa: string, tipo: 'cavalo' | 'carreta'): Promise<boolean> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  const placaFormatada = formatarPlaca(placa);
  const campoPlaca = tipo === 'cavalo' ? 'placa_cavalo' : 'placa_carreta';
  
  console.log(`Verificando placa ${placaFormatada} no campo ${campoPlaca}`);
  
  const { data, error } = await supabase
    .from('Veiculos')
    .select('*')
    .eq(campoPlaca, placaFormatada);
  
  if (error) {
    console.error('Erro ao verificar placa existente:', error);
    return false;
  }
  
  console.log('Resultados encontrados:', data?.length || 0);
  return data !== null && data.length > 0;
};

/**
 * Converte qualquer string para MAIÚSCULAS independente de como foi digitada
 * @param text String a ser convertida
 * @returns String em MAIÚSCULAS
 */
export const converterParaMaiusculas = (text: string): string => {
  if (!text) return '';
  return text.toUpperCase().trim();
};
