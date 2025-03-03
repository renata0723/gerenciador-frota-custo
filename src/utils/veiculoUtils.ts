
/**
 * Valida formatos de placa (padrão antigo: ABC-1234 ou novo: ABC1D23)
 * @param placa 
 * @returns boolean
 */
export const validarPlaca = (placa: string): boolean => {
  if (!placa || typeof placa !== 'string') return false;
  
  const regexAntigoMercosul = /^[A-Z]{3}-\d{4}$/;
  const regexNovoMercosul = /^[A-Z]{3}\d[A-Z]\d{2}$/;
  const regexAntigoSemHifen = /^[A-Z]{3}\d{4}$/;
  
  return regexAntigoMercosul.test(placa) || 
         regexNovoMercosul.test(placa) || 
         regexAntigoSemHifen.test(placa);
};

/**
 * Formata a placa para o padrão correto
 * @param placa 
 * @returns 
 */
export const formatarPlaca = (placa: string): string => {
  if (!placa || typeof placa !== 'string') return '';
  
  // Remover espaços e caracteres especiais
  const placaLimpa = placa.toUpperCase().trim().replace(/[^A-Z0-9]/g, '');
  
  // Formatar placa no padrão antigo (ABC1234 -> ABC-1234)
  if (/^[A-Z]{3}\d{4}$/.test(placaLimpa)) {
    return `${placaLimpa.substring(0, 3)}-${placaLimpa.substring(3)}`;
  }
  
  return placaLimpa;
};
