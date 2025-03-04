
/**
 * Função para validar formato de placa de veículo (padrão antigo e Mercosul)
 */
export function isValidPlaca(placa: string): boolean {
  // Remove hífens para normalizar o formato
  const placaNormalizada = placa.replace('-', '').toUpperCase();
  
  // Padrão antigo (ABC1234)
  const padraoBrasileiroAntigo = /^[A-Z]{3}[0-9]{4}$/;
  
  // Padrão Mercosul (ABC1D23)
  const padraoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  
  return padraoBrasileiroAntigo.test(placaNormalizada) || padraoMercosul.test(placaNormalizada);
}

/**
 * Função para validar CPF
 */
export function isValidCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais, o que invalida o CPF
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  
  // Validação do primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = soma % 11;
  let dv1 = resto < 2 ? 0 : 11 - resto;
  if (dv1 !== parseInt(cpf.charAt(9))) return false;
  
  // Validação do segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = soma % 11;
  let dv2 = resto < 2 ? 0 : 11 - resto;
  if (dv2 !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}

/**
 * Função para validar CNPJ
 */
export function isValidCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  cnpj = cnpj.replace(/\D/g, '');
  
  // Verifica se tem 14 dígitos
  if (cnpj.length !== 14) return false;
  
  // Verifica se todos os dígitos são iguais, o que invalida o CNPJ
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  // Validação do primeiro dígito verificador
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;
  
  // Validação do segundo dígito verificador
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(1))) return false;
  
  return true;
}

/**
 * Função para formatar CPF (###.###.###-##)
 */
export function formatCPF(cpf: string): string {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Função para formatar CNPJ (##.###.###/####-##)
 */
export function formatCNPJ(cnpj: string): string {
  cnpj = cnpj.replace(/\D/g, '');
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Função para validar email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}
