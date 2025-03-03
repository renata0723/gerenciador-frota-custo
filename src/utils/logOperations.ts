
/**
 * Função para registrar operações do sistema em log
 * @param module Nome do módulo onde a operação foi realizada
 * @param action Descrição da ação realizada
 */
export const logOperation = (module: string, action: string) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${module}: ${action}`);
  
  // Aqui posteriormente poderia ser implementado o envio para o backend
  // supabase.from('Logs').insert({ module, action, timestamp });
};

export default logOperation;
