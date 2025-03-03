
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Plus, Search } from 'lucide-react';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { TipoCombustivel } from '@/types/abastecimento';

const Abastecimentos = () => {
  const [abastecimentos, setAbastecimentos] = useState<any[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('abastecimentos');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewTypeDialogOpen, setIsNewTypeDialogOpen] = useState(false);
  
  useEffect(() => {
    carregarDados();
  }, []);
  
  const carregarDados = async () => {
    setIsLoading(true);
    try {
      // Carregar abastecimentos
      const { data: abastecimentosData, error: abastecimentosError } = await supabase
        .from('Abastecimentos')
        .select('*')
        .order('data_abastecimento', { ascending: false });
      
      if (abastecimentosError) throw abastecimentosError;
      setAbastecimentos(abastecimentosData || []);
      
      // Carregar tipos de combustível
      const { data: tiposData, error: tiposError } = await supabase
        .from('TiposCombustivel')
        .select('*')
        .order('nome');
      
      if (tiposError) throw tiposError;
      setTiposCombustivel(tiposData || []);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados de abastecimentos');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNovoAbastecimento = async (formData: any) => {
    try {
      const { error } = await supabase
        .from('Abastecimentos')
        .insert([formData]);
      
      if (error) throw error;
      
      toast.success('Abastecimento registrado com sucesso!');
      setIsDialogOpen(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar abastecimento:', error);
      toast.error('Erro ao registrar abastecimento');
    }
  };
  
  const handleNovoTipoCombustivel = async (tipo: TipoCombustivel) => {
    try {
      const { error } = await supabase
        .from('TiposCombustivel')
        .insert([tipo]);
      
      if (error) throw error;
      
      toast.success('Tipo de combustível adicionado com sucesso!');
      setIsNewTypeDialogOpen(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar tipo de combustível:', error);
      toast.error('Erro ao adicionar tipo de combustível');
    }
  };
  
  const filteredAbastecimentos = abastecimentos.filter(item => 
    item.placa_veiculo?.toLowerCase().includes(search.toLowerCase()) ||
    item.motorista_solicitante?.toLowerCase().includes(search.toLowerCase()) ||
    item.tipo_combustivel?.toLowerCase().includes(search.toLowerCase())
  );
  
  const formatarData = (dataString: string) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };
  
  const exportarRelatorio = () => {
    // Esta função seria implementada para exportar os dados em PDF
    toast.info("Funcionalidade de exportação em desenvolvimento");
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Abastecimentos" 
        description="Registro e controle de abastecimentos da frota"
      />
      
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Buscar por placa, motorista ou tipo..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsNewTypeDialogOpen(true)}
            variant="outline"
            className="whitespace-nowrap"
          >
            Novo Tipo de Combustível
          </Button>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="whitespace-nowrap"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Abastecimento
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="abastecimentos">Abastecimentos</TabsTrigger>
          <TabsTrigger value="tiposCombustivel">Tipos de Combustível</TabsTrigger>
        </TabsList>
        
        <TabsContent value="abastecimentos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Abastecimentos Registrados</CardTitle>
                <CardDescription>
                  {filteredAbastecimentos.length} registros encontrados
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={exportarRelatorio}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">Carregando dados...</div>
              ) : filteredAbastecimentos.length === 0 ? (
                <div className="text-center py-10">
                  {search ? "Nenhum resultado encontrado para a pesquisa." : "Nenhum abastecimento registrado."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Data</th>
                        <th className="text-left p-3">Placa</th>
                        <th className="text-left p-3">Motorista</th>
                        <th className="text-left p-3">Combustível</th>
                        <th className="text-left p-3">Posto</th>
                        <th className="text-left p-3">Quilometragem</th>
                        <th className="text-right p-3">Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAbastecimentos.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">{formatarData(item.data_abastecimento)}</td>
                          <td className="p-3">{item.placa_veiculo}</td>
                          <td className="p-3">{item.motorista_solicitante}</td>
                          <td className="p-3">{item.tipo_combustivel}</td>
                          <td className="p-3">{item.posto}</td>
                          <td className="p-3">{item.quilometragem} km</td>
                          <td className="p-3 text-right">{formatCurrency(item.valor_total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tiposCombustivel">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Combustível Cadastrados</CardTitle>
              <CardDescription>
                Lista de tipos de combustível disponíveis para abastecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">Carregando tipos de combustível...</div>
              ) : tiposCombustivel.length === 0 ? (
                <div className="text-center py-10">
                  Nenhum tipo de combustível cadastrado.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tiposCombustivel.map((tipo) => (
                    <div 
                      key={tipo.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="font-medium text-lg">{tipo.nome}</h3>
                      <p className="text-gray-500 text-sm mt-1">{tipo.descricao}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Modal de Novo Abastecimento */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Novo Abastecimento</DialogTitle>
          </DialogHeader>
          <NovoAbastecimentoForm 
            tiposCombustivel={tiposCombustivel}
            onSave={handleNovoAbastecimento}
          />
        </DialogContent>
      </Dialog>
      
      {/* Modal de Novo Tipo de Combustível */}
      <Dialog open={isNewTypeDialogOpen} onOpenChange={setIsNewTypeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Tipo de Combustível</DialogTitle>
          </DialogHeader>
          <TipoCombustivelForm 
            onSave={handleNovoTipoCombustivel}
          />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Abastecimentos;
