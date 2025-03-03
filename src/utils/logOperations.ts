
import { supabase } from '@/integrations/supabase/client';

/**
 * Função para registrar operações do sistema em log
 * @param module Nome do módulo onde a operação foi realizada
 * @param action Descrição da ação realizada
 * @param details Detalhes adicionais (opcional)
 */
export const logOperation = (module: string, action: string, details?: string) => {
  const timestamp = new Date().toISOString();
  const user = 'Usuário Atual'; // No futuro, pode ser integrado com o sistema de autenticação
  
  console.log(`[${timestamp}] ${module}: ${action} (por ${user})${details ? ` - ${details}` : ''}`);
  
  // Aqui posteriormente poderia ser implementado o envio para o backend
  // supabase.from('Logs').insert({ module, action, timestamp, user_id: 'user-id-aqui', details });
};

export default logOperation;
