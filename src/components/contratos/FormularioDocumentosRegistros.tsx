
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Link as LinkIcon, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

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

interface CTEDialogData {
  numero: string;
  valorFrete: number;
  valorCarga: number;
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
  
  // Estado para o diálogo de criação de CTE
  const [cteDialogOpen, setCteDialogOpen] = useState(false);
  const [cteDialogData, setCteDialogData] = useState<CTEDialogData>({
    numero: '',
    valorFrete: 0,
    valorCarga: 0
  });
  
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
    } else {
      // Se não há CTEs, zerar os valores totais
      setFormData(prev => ({
        ...prev,
        valorFrete: 0,
        valorCarga: 0
      }));
    }
  }, [formData.ctes]);

  const adicionarManifesto = (valor: string) => {
    if (!valor.trim()) {
      toast.error(`Por favor, digite um número válido para o manifesto`);
      return;
    }

    const novoItem: DocumentoRegistro = {
      id: crypto.randomUUID(),
      numero: valor.trim(),
      tipo: 'manifesto'
    };
    
    setFormData(prev => ({
      ...prev,
      manifestos: [...prev.manifestos, novoItem]
    }));
    
    setNovoManifesto('');
    toast.success(`Manifesto adicionado com sucesso`);
  };

  const abrirDialogCTE = () => {
    setCteDialogData({
      numero: novoCTe,
      valorFrete: 0,
      valorCarga: 0
    });
    setCteDialogOpen(true);
  };

  const adicionarCTE = () => {
    if (!cteDialogData.numero.trim()) {
      toast.error(`Por favor, digite um número válido para o CTe`);
      return;
    }

    if (cteDialogData.valorFrete <= 0) {
      toast.error(`O valor do frete deve ser maior que zero`);
      return;
    }

    if (cteDialogData.valorCarga <= 0) {
      toast.error(`O valor da carga deve ser maior que zero`);
      return;
    }

    const novoItem: DocumentoRegistro = {
      id: crypto.randomUUID(),
      numero: cteDialogData.numero.trim(),
      tipo: 'cte',
      valorFrete: cteDialogData.valorFrete,
      valorCarga: cteDialogData.valorCarga
    };
    
    setFormData(prev => ({
      ...prev,
      ctes: [...prev.ctes, novoItem]
    }));
    
    setNovoCTe('');
    setCteDialogOpen(false);
    toast.success(`CTe adicionado com sucesso`);
  };

  const adicionarNota = (valor: string) => {
    if (!valor.trim()) {
      toast.error(`Por favor, digite um número válido para a nota fiscal`);
      return;
    }

    const novoItem: DocumentoRegistro = {
      id: crypto.randomUUID(),
      numero: valor.trim(),
      tipo: 'nota'
    };
    
    setFormData(prev => ({
      ...prev,
      notas: [...prev.notas, novoItem]
    }));
    
    setNovaNota('');
    toast.success(`Nota fiscal adicionada com sucesso`);
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

  const handleChangeCteDialog = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'valorFrete' || name === 'valorCarga') {
      const numValue = parseFloat(value);
      setCteDialogData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setCteDialogData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
              onClick={() => adicionarManifesto(novoManifesto)}
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
              onClick={() => abrirDialogCTE()}
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
                      <span className="text-xs text-gray-600">
                        Frete: R$ {(item.valorFrete || 0).toFixed(2)} | 
                        Carga: R$ {(item.valorCarga || 0).toFixed(2)}
                      </span>
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
              onClick={() => adicionarNota(novaNota)}
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
            <div className="flex items-center">
              <Input
                id="valorFrete"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorFrete || ''}
                className="bg-gray-100 border-r-0 rounded-r-none"
                readOnly
              />
              <div className="bg-gray-100 border border-l-0 rounded-l-none px-3 py-2 text-gray-600 flex items-center">
                <LinkIcon size={16} className="inline" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Valor calculado automaticamente a partir dos CTes
            </p>
          </div>
          
          <div>
            <Label htmlFor="valorCarga">Valor da Carga (R$) *</Label>
            <div className="flex items-center">
              <Input
                id="valorCarga"
                type="number"
                step="0.01"
                min="0"
                value={formData.valorCarga || ''}
                className="bg-gray-100 border-r-0 rounded-r-none"
                readOnly
              />
              <div className="bg-gray-100 border border-l-0 rounded-l-none px-3 py-2 text-gray-600 flex items-center">
                <LinkIcon size={16} className="inline" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Valor calculado automaticamente a partir dos CTes
            </p>
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

      {/* Diálogo para adicionar CTe com valores */}
      <Dialog open={cteDialogOpen} onOpenChange={setCteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar CTe</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="numero">Número do CTe *</Label>
                <Input
                  id="numero"
                  name="numero"
                  value={cteDialogData.numero}
                  onChange={handleChangeCteDialog}
                  placeholder="Digite o número do CTe"
                  required
                />
              </div>
              <div>
                <Label htmlFor="valorFrete">Valor do Frete (R$) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="valorFrete"
                    name="valorFrete"
                    type="number"
                    step="0.01"
                    min="0"
                    value={cteDialogData.valorFrete || ''}
                    onChange={handleChangeCteDialog}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="valorCarga">Valor da Carga (R$) *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="valorCarga"
                    name="valorCarga"
                    type="number"
                    step="0.01"
                    min="0"
                    value={cteDialogData.valorCarga || ''}
                    onChange={handleChangeCteDialog}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCteDialogOpen(false)}>Cancelar</Button>
            <Button type="button" onClick={adicionarCTE}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormularioDocumentosRegistros;
