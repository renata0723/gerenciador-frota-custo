
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
      .maybeSingle();
    
    if (error) {
      console.error('Erro ao verificar administrador:', error);
      return null;
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
    console.log('Verificando credenciais de administrador:', credenciais.email);
    
    // Verificar usuário e senha
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('Usuarios')
      .select('id, senha')
      .eq('email', credenciais.email)
      .eq('senha', credenciais.senha)
      .maybeSingle();
    
    if (usuarioError) {
      console.log('Erro na autenticação (usuário):', usuarioError);
      return false;
    }
    
    if (!usuarioData) {
      console.log('Usuário não encontrado:', credenciais.email);
      return false;
    }
    
    // Verificar se é administrador geral
    const { data: adminData, error: adminError } = await supabase
      .from('Administradores')
      .select('nivel_acesso')
      .eq('usuario_id', usuarioData.id)
      .eq('nivel_acesso', 'Geral')
      .maybeSingle();
    
    if (adminError) {
      console.log('Erro na autenticação (admin):', adminError);
      return false;
    }
    
    if (!adminData) {
      console.log('Usuário não é administrador geral:', credenciais.email);
      return false;
    }
    
    // Atualizar último acesso
    const { error: updateError } = await supabase
      .from('Administradores')
      .update({ ultimo_acesso: new Date().toISOString() })
      .eq('usuario_id', usuarioData.id);
      
    if (updateError) {
      console.log('Erro ao atualizar último acesso:', updateError);
      // Não retornar false aqui, pois o login já está autenticado
    }
    
    // Registrar no log
    logOperation('Administradores', 'Login de administrador geral', `Email: ${credenciais.email}`);
    
    return true;
  } catch (error) {
    console.error('Erro ao autenticar administrador:', error);
    return false;
  }
};

// Criar novo administrador
export const criarAdministrador = async (dados: { usuario_id: number, nivel_acesso: 'Parcial' | 'Total' | 'Geral' }): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('Administradores')
      .insert({
        usuario_id: dados.usuario_id,
        nivel_acesso: dados.nivel_acesso
      });
    
    if (error) {
      console.error('Erro ao criar administrador:', error);
      return false;
    }
    
    logOperation('Administradores', 'Novo administrador criado', `ID: ${dados.usuario_id}, Nível: ${dados.nivel_acesso}`);
    return true;
  } catch (error) {
    console.error('Erro ao criar administrador:', error);
    return false;
  }
};

// Obter todos os administradores
export const getAdministradores = async (): Promise<Administrador[]> => {
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
    
    if (error) {
      console.error('Erro ao buscar administradores:', error);
      return [];
    }
    
    return data as unknown as Administrador[];
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    return [];
  }
};
