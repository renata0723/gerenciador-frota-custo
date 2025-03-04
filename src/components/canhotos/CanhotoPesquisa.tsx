
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CanhotoPesquisaProps {
  onResultadoEncontrado: (canhoto: any) => void;
}

const CanhotoPesquisa: React.FC<CanhotoPesquisaProps> = ({ onResultadoEncontrado }) => {
  const [tipoPesquisa, setTipoPesquisa] = useState<'contrato' | 'manifesto' | 'cte' | 'nota'>('contrato');
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [pesquisando, setPesquisando] = useState(false);
  
  const handleSearch = async () => {
    if (!termoPesquisa.trim()) {
      toast.error('Por favor, informe um termo de pesquisa');
      return;
    }
    
    setPesquisando(true);
    
    try {
      let resultado;
      
      switch (tipoPesquisa) {
        case 'contrato':
          resultado = await pesquisarPorContrato(termoPesquisa);
          break;
        case 'manifesto':
          resultado = await pesquisarPorManifesto(termoPesquisa);
          break;
        case 'cte':
          resultado = await pesquisarPorCTe(termoPesquisa);
          break;
        case 'nota':
          resultado = await pesquisarPorNotaFiscal(termoPesquisa);
          break;
      }
      
      if (resultado) {
        onResultadoEncontrado(resultado);
      } else {
        toast.error('Nenhum registro encontrado para os critérios informados');
      }
    } catch (error) {
      console.error('Erro na pesquisa:', error);
      toast.error('Ocorreu um erro durante a pesquisa');
    } finally {
      setPesquisando(false);
    }
  };
  
  const pesquisarPorContrato = async (termo: string) => {
    const { data, error } = await supabase
      .from('Canhoto')
      .select('*')
      .eq('contrato_id', termo)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data;
  };
  
  const pesquisarPorManifesto = async (termo: string) => {
    const { data, error } = await supabase
      .from('Canhoto')
      .select('*')
      .eq('numero_manifesto', termo)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data;
  };
  
  const pesquisarPorCTe = async (termo: string) => {
    const { data, error } = await supabase
      .from('Canhoto')
      .select('*')
      .eq('numero_cte', termo)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data;
  };
  
  const pesquisarPorNotaFiscal = async (termo: string) => {
    const { data, error } = await supabase
      .from('Canhoto')
      .select('*')
      .eq('numero_nota_fiscal', termo)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    return data;
  };
  
  const handleClear = () => {
    setTermoPesquisa('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Localizar Documento</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={tipoPesquisa} onValueChange={(value) => setTipoPesquisa(value as any)}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="contrato" className="flex-1">Contrato</TabsTrigger>
            <TabsTrigger value="manifesto" className="flex-1">Manifesto</TabsTrigger>
            <TabsTrigger value="cte" className="flex-1">CT-e</TabsTrigger>
            <TabsTrigger value="nota" className="flex-1">Nota Fiscal</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contrato">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Input 
                  placeholder="Digite o número do contrato" 
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {termoPesquisa && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0" 
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button 
                className="ml-2" 
                onClick={handleSearch}
                disabled={pesquisando || !termoPesquisa}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="manifesto">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Input 
                  placeholder="Digite o número do manifesto" 
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {termoPesquisa && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0" 
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button 
                className="ml-2" 
                onClick={handleSearch}
                disabled={pesquisando || !termoPesquisa}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="cte">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Input 
                  placeholder="Digite o número do CT-e" 
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {termoPesquisa && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0" 
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button 
                className="ml-2" 
                onClick={handleSearch}
                disabled={pesquisando || !termoPesquisa}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="nota">
            <div className="flex items-center">
              <div className="relative flex-1">
                <Input 
                  placeholder="Digite o número da nota fiscal" 
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                {termoPesquisa && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0 top-0" 
                    onClick={handleClear}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Button 
                className="ml-2" 
                onClick={handleSearch}
                disabled={pesquisando || !termoPesquisa}
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CanhotoPesquisa;
