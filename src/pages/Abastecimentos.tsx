
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, Search, Filter } from 'lucide-react';
import { formataMoeda } from '@/utils/constants';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';
import { AbastecimentoItem, TipoCombustivel, TipoCombustivelFormData } from '@/types/abastecimento';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Abastecimentos = () => {
  const [abastecimentos, setAbastecimentos] = useState<AbastecimentoItem[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [novoAbastecimentoOpen, setNovoAbastecimentoOpen] = useState(false);
  const [novoCombustivelOpen, setNovoCombustivelOpen] = useState(false);

  // Buscar abastecimentos
  const fetchAbastecimentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Abastecimentos')
        .select('*');
      
      if (error) throw error;
      setAbastecimentos(data || []);
    } catch (error) {
      console.error('Erro ao buscar abastecimentos:', error);
      toast.error('Erro ao carregar abastecimentos.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar tipos de combustível
  const fetchTiposCombustivel = async () => {
    try {
      const { data, error } = await supabase
        .from('TiposCombustivel')
        .select('*');
      
      if (error) throw error;
      setTiposCombustivel(data || []);
    } catch (error) {
      console.error('Erro ao buscar tipos de combustível:', error);
      toast.error('Erro ao carregar tipos de combustível.');
    }
  };

  useEffect(() => {
    fetchAbastecimentos();
    fetchTiposCombustivel();
  }, []);

  const handleAbastecimentoAdicionado = () => {
    setNovoAbastecimentoOpen(false);
    fetchAbastecimentos();
    toast.success('Abastecimento registrado com sucesso!');
  };

  const handleTipoCombustivelAdicionado = (tipoCombustivel: TipoCombustivel) => {
    setNovoCombustivelOpen(false);
    setTiposCombustivel([...tiposCombustivel, tipoCombustivel]);
    toast.success('Tipo de combustível cadastrado com sucesso!');
  };

  // Função para calcular consumo médio
  const calcularConsumoMedio = (abastecimento: AbastecimentoItem) => {
    if (!abastecimento.quilometragem || !abastecimento.valor_abastecimento) return 'N/A';
    const consumo = abastecimento.quilometragem / abastecimento.valor_abastecimento;
    return `${consumo.toFixed(2)} km/L`;
  };

  return (
    <PageLayout>
      <PageHeader
        title="Abastecimentos"
        description="Gerenciamento de abastecimentos da frota"
      />

      <div className="flex justify-between mb-6">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={18} />
            Exportar
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={18} />
            Filtros
          </Button>
        </div>

        <div className="flex gap-2">
          <Dialog open={novoCombustivelOpen} onOpenChange={setNovoCombustivelOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Plus size={18} />
                Novo Tipo de Combustível
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Tipo de Combustível</DialogTitle>
              </DialogHeader>
              <TipoCombustivelForm onTipoCombustivelAdded={handleTipoCombustivelAdicionado} />
            </DialogContent>
          </Dialog>

          <Dialog open={novoAbastecimentoOpen} onOpenChange={setNovoAbastecimentoOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={18} />
                Novo Abastecimento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Registrar Abastecimento</DialogTitle>
              </DialogHeader>
              <NovoAbastecimentoForm 
                tiposCombustivel={tiposCombustivel} 
                onAbastecimentoAdicionado={handleAbastecimentoAdicionado}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="todos">Todos os Abastecimentos</TabsTrigger>
          <TabsTrigger value="recentes">Abastecimentos Recentes</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas de Consumo</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Todos os Abastecimentos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combustível</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Km</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Médio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : abastecimentos.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 text-center">Nenhum abastecimento registrado</td>
                    </tr>
                  ) : (
                    abastecimentos.map((abastecimento, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.data_abastecimento}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.placa_veiculo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.tipo_combustivel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.quilometragem}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(abastecimento.valor_total || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.posto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.motorista_solicitante}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{calcularConsumoMedio(abastecimento)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recentes">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Abastecimentos Recentes (Últimos 30 dias)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Combustível</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Km</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Médio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : abastecimentos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center">Nenhum abastecimento recente</td>
                    </tr>
                  ) : (
                    // Aqui podemos filtrar somente os abastecimentos recentes (30 dias)
                    abastecimentos
                      .filter(a => {
                        if (!a.data_abastecimento) return false;
                        const dataAbastecimento = new Date(a.data_abastecimento);
                        const hoje = new Date();
                        const diff = hoje.getTime() - dataAbastecimento.getTime();
                        const dias = diff / (1000 * 3600 * 24);
                        return dias <= 30;
                      })
                      .map((abastecimento, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.data_abastecimento}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.placa_veiculo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.tipo_combustivel}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.quilometragem}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formataMoeda(abastecimento.valor_total || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{calcularConsumoMedio(abastecimento)}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="estatisticas">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Estatísticas por Veículo</h2>
              <p className="text-sm text-gray-500 mb-4">Consumo médio e gastos por veículo</p>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : abastecimentos.length === 0 ? (
                <p className="text-center py-4">Sem dados disponíveis</p>
              ) : (
                <div className="space-y-4">
                  {/* Aqui poderia ter um gráfico de barras mostrando o consumo por veículo */}
                  <p className="text-center">Os gráficos serão implementados em breve</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Tendência de Consumo</h2>
              <p className="text-sm text-gray-500 mb-4">Evolução do consumo de combustível ao longo do tempo</p>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : abastecimentos.length === 0 ? (
                <p className="text-center py-4">Sem dados disponíveis</p>
              ) : (
                <div className="space-y-4">
                  {/* Aqui poderia ter um gráfico de linha mostrando a evolução do consumo */}
                  <p className="text-center">Os gráficos serão implementados em breve</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Gastos por Período</h2>
              <p className="text-sm text-gray-500 mb-4">Total gasto com combustível por período</p>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : abastecimentos.length === 0 ? (
                <p className="text-center py-4">Sem dados disponíveis</p>
              ) : (
                <div className="space-y-4">
                  {/* Aqui poderia ter um gráfico de área mostrando os gastos por período */}
                  <p className="text-center">Os gráficos serão implementados em breve</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Distribuição por Tipo de Combustível</h2>
              <p className="text-sm text-gray-500 mb-4">Quantidade utilizada por tipo de combustível</p>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : abastecimentos.length === 0 ? (
                <p className="text-center py-4">Sem dados disponíveis</p>
              ) : (
                <div className="space-y-4">
                  {/* Aqui poderia ter um gráfico de pizza mostrando a distribuição por tipo de combustível */}
                  <p className="text-center">Os gráficos serão implementados em breve</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Abastecimentos;
