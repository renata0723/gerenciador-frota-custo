
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type TipoPermissao = 'visualizar' | 'editar' | 'excluir' | 'criar';

export interface Permissao {
  modulo: string;
  acao: TipoPermissao;
}

export const usePermissoes = (modulo: string) => {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const carregarUsuario = () => {
      const usuarioString = sessionStorage.getItem('usuario');
      const adminGeral = sessionStorage.getItem('adminGeral');
      
      // Se for admin geral, concede todas as permissões automaticamente
      if (adminGeral === 'true') {
        setPermissoes([
          { modulo, acao: 'visualizar' },
          { modulo, acao: 'editar' },
          { modulo, acao: 'excluir' },
          { modulo, acao: 'criar' }
        ]);
        setLoading(false);
        return;
      }
      
      // Se não for admin, verifica permissões do usuário
      if (usuarioString) {
        try {
          const usuario = JSON.parse(usuarioString);
          if (usuario && usuario.id) {
            setUserId(usuario.id);
            carregarPermissoes(usuario.id);
          } else {
            // Por padrão concede permissão de visualização para todos os usuários
            setPermissoes([{ modulo, acao: 'visualizar' }]);
            setLoading(false);
          }
        } catch (error) {
          console.error('Erro ao processar dados de usuário:', error);
          // Por padrão concede permissão de visualização
          setPermissoes([{ modulo, acao: 'visualizar' }]);
          setLoading(false);
        }
      } else {
        // Por padrão concede permissão de visualização
        setPermissoes([{ modulo, acao: 'visualizar' }]);
        setLoading(false);
      }
    };

    carregarUsuario();
  }, [modulo]);

  const carregarPermissoes = async (usuarioId: number) => {
    try {
      const { data, error } = await supabase
        .from('UsuarioPermissoes')
        .select(`
          id,
          permissao_id,
          Permissoes:permissao_id(id, modulo, acao)
        `)
        .eq('usuario_id', usuarioId);

      if (error) {
        throw error;
      }

      if (data) {
        // Filtrar permissões pelo módulo atual
        const permissoesDoModulo = data
          .filter(item => item.Permissoes && 
                 item.Permissoes.modulo === modulo)
          .map(item => ({
            modulo: item.Permissoes.modulo,
            acao: item.Permissoes.acao as TipoPermissao
          }));
        
        // Se não tiver nenhuma permissão específica, concede no mínimo visualização
        if (permissoesDoModulo.length === 0) {
          setPermissoes([{ modulo, acao: 'visualizar' }]);
        } else {
          setPermissoes(permissoesDoModulo);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      // Garante pelo menos visualização em caso de erro
      setPermissoes([{ modulo, acao: 'visualizar' }]);
    } finally {
      setLoading(false);
    }
  };

  const temPermissao = (acao: TipoPermissao): boolean => {
    // Verifica se tem a permissão para a ação específica
    return permissoes.some(p => p.acao === acao);
  };

  return {
    loading,
    permissoes,
    temPermissao,
    podeVisualizar: temPermissao('visualizar'),
    podeEditar: temPermissao('editar'),
    podeExcluir: temPermissao('excluir'),
    podeCriar: temPermissao('criar'),
    userId
  };
};
