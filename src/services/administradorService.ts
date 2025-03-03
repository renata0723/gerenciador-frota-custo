
import { supabase } from '@/integrations/supabase/client';
import { Administrador, CredenciaisAdministrador } from '@/types/administrador';
import { logOperation } from '@/utils/logOperations';

// Verificar se um usuário é administrador
export const verificarAdministrador = async (usuarioId: number): Promise<Administrador | null> => {
  try {
    const { data, error } = await supabase
      .from('Administradores')
      .select('*')
      .eq('usuario_id', usuarioId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Usuário não é administrador
      }
      throw error;
    }
    
    return data as Administrador;
  } catch (error) {
    console.error('Erro ao verificar administrador:', error);
    return null;
  }
};

// Autenticar administrador geral
export const autenticarAdministradorGeral = async (credenciais: CredenciaisAdministrador): Promise<boolean> => {
  try {
    // Verificar usuário e senha
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('Usuarios')
      .select('id, senha')
      .eq('email', credenciais.email)
      .eq('senha', credenciais.senha)
      .single();
    
    if (usuarioError || !usuarioData) {
      return false;
    }
    
    // Verificar se é administrador geral
    const { data: adminData, error: adminError } = await supabase
      .from('Administradores')
      .select('nivel_acesso')
      .eq('usuario_id', usuarioData.id)
      .eq('nivel_acesso', 'Geral')
      .single();
    
    if (adminError || !adminData) {
      return false;
    }
    
    // Atualizar último acesso
    await supabase
      .from('Administradores')
      .update({ ultimo_acesso: new Date().toISOString() })
      .eq('usuario_id', usuarioData.id);
    
    // Registrar no log
    logOperation('Administradores', 'Login de administrador geral', `Email: ${credenciais.email}`);
    
    return true;
  } catch (error) {
    console.error('Erro ao autenticar administrador:', error);
    return false;
  }
};

// Criar novo administrador
export const criarAdministrador = async (usuarioId: number, nivelAcesso: 'Parcial' | 'Total' | 'Geral'): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Administradores')
      .insert({
        usuario_id: usuarioId,
        nivel_acesso: nivelAcesso
      });
    
    if (error) throw error;
    
    logOperation('Administradores', 'Novo administrador criado', `ID: ${usuarioId}, Nível: ${nivelAcesso}`);
    return true;
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    return false;
  }
};

// Obter todos os administradores
export const getAdministradores = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('Administradores')
      .select(`
        *,
        usuario:usuario_id (
          id,
          nome,
          email,
          cargo
        )
      `);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    return [];
  }
};
