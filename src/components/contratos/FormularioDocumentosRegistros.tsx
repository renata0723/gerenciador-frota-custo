
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

export interface DocumentoRegistro {
  id: string;
  numero: string;
  tipo: 'manifesto' | 'cte' | 'nota';
  valorFrete?: number;
  valorCarga?: number;
}

export interface DocumentosRegistrosData {
  manifestos: DocumentoRegistro[];
  ctes: DocumentoRegistro[];
  notas: DocumentoRegistro[];
  valorFrete: number;
  valorCarga: number;
}

interface FormularioDocumentosRegistrosProps {
  onSubmit: (data: DocumentosRegistrosData) => void;
  onBack: () => void;
  onNext: () => void;
  initialData?: Partial<DocumentosRegistrosData>;
}

const FormularioDocumentosRegistros: React.FC<FormularioDocumentosRegistrosProps> = ({
  onSubmit,
  onBack,
  onNext,
  initialData
}) => {
  const [formData, setFormData] = useState<DocumentosRegistrosData>({
    manifestos: initialData?.manifestos || [],
    ctes: initialData?.ctes || [],
    notas: initialData?.notas || [],
    valorFrete: initialData?.valorFrete || 0,
    valorCarga: initialData?.valorCarga || 0
  });
  
  // Estados para novos itens
  const [novoManifesto, setNovoManifesto] = useState('');
  const [novoCTe, setNovoCTe] = useState('');
  const [novaNota, setNovaNota] = useState('');
  
  // Atualizar os valores totais quando os CTes forem modificados
  useEffect(() => {
    if (formData.ctes.length > 0) {
      // Somar valores do frete de todos os CTes
      const totalFrete = formData.ctes.reduce((sum, cte) => {
        return sum + (cte.valorFrete || 0);
      }, 0);
      
      // Somar valores da carga de todos os CTes
      const totalCarga = formData.ctes.reduce((sum, cte) => {
        return sum + (cte.valorCarga || 0);
      }, 0);
      
      setFormData(prev => ({
        ...prev,
        valorFrete: totalFrete,
        valorCarga: totalCarga
      }));
    }
  }, [formData.ctes]);

  const handleNumberChange = (field: 'valorFrete' | 'valorCarga', value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue
    }));
  };

  const adicionarItem = (tipo: 'manifesto' | 'cte' | 'nota', valor: string) => {
    if (!valor.trim()) {
      toast.error(`Por favor, digite um número válido para o ${tipo}`);
      return;
    }

    const novoItem: DocumentoRegistro = {
      id: crypto.randomUUID(),
      numero: valor.trim(),
      tipo
    };
    
    // Para CTes, solicitar valores de frete e carga
    if (tipo === 'cte') {
      const valorFrete = prompt('Digite o valor do frete para este CTe (R$):');
      const valorCarga = prompt('Digite o valor da carga para este CTe (R$):');
      
      if (valorFrete) {
        novoItem.valorFrete = parseFloat(valorFrete);
      }
      
      if (valorCarga) {
        novoItem.valorCarga = parseFloat(valorCarga);
      }
    }

    setFormData(prev => {
      let novaLista;
      
      if (tipo === 'manifesto') {
        novaLista = { ...prev, manifestos: [...prev.manifestos, novoItem] };
        setNovoManifesto('');
      } else if (tipo === 'cte') {
        novaLista = { ...prev, ctes: [...prev.ctes, novoItem] };
        setNovoCTe('');
      } else {
        novaLista = { ...prev, notas: [...prev.notas, novoItem] };
        setNovaNota('');
      }
      
      return novaLista;
    });
    
    toast.success(`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} adicionado com sucesso`);
  };

  const removerItem = (tipo: 'manifesto' | 'cte' | 'nota', id: string) => {
    setFormData(prev => {
      let novaLista;
      
      if (tipo === 'manifesto') {
        novaLista = { 
          ...prev, 
          manifestos: prev.manifestos.filter(item => item.id !== id)
        };
      } else if (tipo === 'cte') {
        novaLista = { 
          ...prev, 
          ctes: prev.ctes.filter(item => item.id !== id) 
        };
      } else {
        novaLista = { 
          ...prev, 
          notas: prev.notas.filter(item => item.id !== id) 
        };
      }
      
      return novaLista;
    });
    
    toast.success(`Item removido com sucesso`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.valorFrete <= 0) {
      toast.error('O valor do frete deve ser maior que zero');
      return;
    }
    
    if (formData.valorCarga <= 0) {
      toast.error('O valor da carga deve ser maior que zero');
      return;
    }
    
    onSubmit(formData);
    onNext();
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Documentos e Registros</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção de Manifestos */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Números de Manifesto</h3>
          
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="novo-manifesto">Adicionar Manifesto</Label>
              <Input
                id="novo-manifesto"
                placeholder="Digite o número do manifesto"
                value={novoManifesto}
                onChange={(e) => setNovoManifesto(e.target.value)}
              />
            </div>
            <Button 
              type="button" 
              onClick={() => adicionarItem('manifesto', novoManifesto)}
              className="flex gap-1 items-center"
            >
              <Plus size={16} /> Adicionar
            </Button>
          </div>
          
          {formData.manifestos.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                {formData.manifestos.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>{item.numero}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerItem('manifesto', item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum manifesto registrado</p>
          )}
        </Card>
        
        {/* Seção de CTes */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Números de CTe</h3>
          
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="novo-cte">Adicionar CTe</Label>
              <Input
                id="novo-cte"
                placeholder="Digite o número do CTe"
                value={novoCTe}
                onChange={(e) => setNovoCTe(e.target.value)}
              />
            </div>
            <Button 
              type="button" 
              onClick={() => adicionarItem('cte', novoCTe)}
              className="flex gap-1 items-center"
            >
              <Plus size={16} /> Adicionar
            </Button>
          </div>
          
          {formData.ctes.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                {formData.ctes.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.numero}</span>
                      {(item.valorFrete || item.valorCarga) && (
                        <span className="text-xs text-gray-600">
                          {item.valorFrete ? `Frete: R$ ${item.valorFrete.toFixed(2)}` : ''} 
                          {item.valorFrete && item.valorCarga ? ' | ' : ''}
                          {item.valorCarga ? `Carga: R$ ${item.valorCarga.toFixed(2)}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removerItem('cte', item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum CTe registrado</p>
          )}
        </Card>
        
        {/* Seção de Notas Fiscais */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Notas Fiscais</h3>
          
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-1">
              <Label htmlFor="nova-nota">Adicionar Nota Fiscal</Label>
              <Input
                id="nova-nota"
                placeholder="Digite o número da nota fiscal"
                value={novaNota}
                onChange={(e) => setNovaNota(e.target.value)}
              />
            </div>
            <Button 
              type="button" 
              onClick={() => adicionarItem('nota', novaNota)}
              className="flex gap-1 items-center"
            >
              <Plus size={16} /> Adicionar
            </Button>
          </div>
          
          {formData.notas.length > 0 ? (
            <div className="bg-gray-50 p-4 rounded-md">
              <ul className="space-y-2">
                {formData.notas.map(item => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-white rounded border">
                    <span>{item.numero}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerItem('nota', item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhuma nota fiscal registrada</p>
          )}
        </Card>
        
        {/* Seção de Valores (agora são calculados automaticamente a partir dos CTes) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valorFrete">Valor do Frete (Receita da Empresa) (R$) *</Label>
            <Input
              id="valorFrete"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorFrete || ''}
              onChange={(e) => handleNumberChange('valorFrete', e.target.value)}
              required
              className={formData.ctes.length > 0 ? "bg-gray-100" : ""}
              readOnly={formData.ctes.length > 0}
            />
            {formData.ctes.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                <LinkIcon size={12} className="inline mr-1" />
                Valor calculado automaticamente a partir dos CTes
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="valorCarga">Valor da Carga (R$) *</Label>
            <Input
              id="valorCarga"
              type="number"
              step="0.01"
              min="0"
              value={formData.valorCarga || ''}
              onChange={(e) => handleNumberChange('valorCarga', e.target.value)}
              required
              className={formData.ctes.length > 0 ? "bg-gray-100" : ""}
              readOnly={formData.ctes.length > 0}
            />
            {formData.ctes.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                <LinkIcon size={12} className="inline mr-1" />
                Valor calculado automaticamente a partir dos CTes
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit">
            Próximo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FormularioDocumentosRegistros;
