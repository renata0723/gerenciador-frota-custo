
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Permissao } from "@/types/usuario";
import { getPermissoes } from "@/services/usuarios";

interface PermissaoUsuarioFormProps {
  usuarioId: number;
  onSave: (permissoes: number[]) => void;
  permissoesAtuais?: number[];
}

const PermissaoUsuarioForm: React.FC<PermissaoUsuarioFormProps> = ({
  usuarioId,
  onSave,
  permissoesAtuais = []
}) => {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [modulosFiltrados, setModulosFiltrados] = useState<string[]>([]);
  const [moduloSelecionado, setModuloSelecionado] = useState<string>('');
  const [permissoesSelecionadas, setPermissoesSelecionadas] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarPermissoes();
  }, []);

  useEffect(() => {
    if (permissoesAtuais.length > 0) {
      setPermissoesSelecionadas(permissoesAtuais);
    }
  }, [permissoesAtuais]);

  const carregarPermissoes = async () => {
    setLoading(true);
    try {
      const data = await getPermissoes();
      setPermissoes(data);
      
      // Extrair módulos únicos
      const modulos = [...new Set(data.map(p => p.modulo))].filter(Boolean) as string[];
      setModulosFiltrados(modulos);
      
      if (modulos.length > 0) {
        setModuloSelecionado(modulos[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      toast.error('Não foi possível carregar as permissões');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissaoToggle = (permissaoId: number) => {
    setPermissoesSelecionadas(prev => {
      if (prev.includes(permissaoId)) {
        return prev.filter(id => id !== permissaoId);
      } else {
        return [...prev, permissaoId];
      }
    });
  };

  const handleSavePermissoes = () => {
    onSave(permissoesSelecionadas);
  };

  const handleSelectAll = (modulo: string) => {
    const permissoesDoModulo = permissoes
      .filter(p => p.modulo === modulo)
      .map(p => p.id as number);
      
    setPermissoesSelecionadas(prev => {
      // Verificar se todas as permissões do módulo já estão selecionadas
      const todasSelecionadas = permissoesDoModulo.every(id => prev.includes(id));
      
      if (todasSelecionadas) {
        // Remover todas as permissões do módulo
        return prev.filter(id => !permissoesDoModulo.includes(id));
      } else {
        // Adicionar todas as permissões do módulo que ainda não estão selecionadas
        const novaSelecao = [...prev];
        permissoesDoModulo.forEach(id => {
          if (!novaSelecao.includes(id)) {
            novaSelecao.push(id);
          }
        });
        return novaSelecao;
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Permissões de Acesso</h3>
        <Select
          value={moduloSelecionado}
          onValueChange={(value) => setModuloSelecionado(value)}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione o módulo" />
          </SelectTrigger>
          <SelectContent>
            {modulosFiltrados.map(modulo => (
              <SelectItem key={modulo} value={modulo}>
                {modulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {loading ? (
        <div className="text-center py-4">Carregando permissões...</div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <span className="text-sm font-medium">Permissões do módulo {moduloSelecionado}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleSelectAll(moduloSelecionado)}
              >
                Selecionar Todas
              </Button>
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {permissoes
                  .filter(p => p.modulo === moduloSelecionado)
                  .map(permissao => (
                    <div key={permissao.id} className="flex items-start space-x-2">
                      <Checkbox
                        id={`permissao-${permissao.id}`}
                        checked={permissoesSelecionadas.includes(permissao.id as number)}
                        onCheckedChange={() => handlePermissaoToggle(permissao.id as number)}
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor={`permissao-${permissao.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {permissao.acao}
                        </Label>
                        {permissao.descricao && (
                          <p className="text-sm text-gray-500">{permissao.descricao}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      <Button 
        className="w-full" 
        onClick={handleSavePermissoes}
        disabled={loading}
      >
        Salvar Permissões
      </Button>
    </div>
  );
};

export default PermissaoUsuarioForm;
