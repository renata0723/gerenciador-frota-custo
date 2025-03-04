
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, Search, Filter, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import NovoAbastecimentoForm from '@/components/abastecimentos/NovoAbastecimentoForm';
import TipoCombustivelForm from '@/components/abastecimentos/TipoCombustivelForm';
import { AbastecimentoItem, TipoCombustivel, AbastecimentoFormData } from '@/types/abastecimento';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatarValorMonetario, formatarData } from '@/utils/formatters';
import { Badge } from '@/components/ui/badge';

const Abastecimentos = () => {
  const [abastecimentos, setAbastecimentos] = useState<AbastecimentoItem[]>([]);
  const [tiposCombustivel, setTiposCombustivel] = useState<TipoCombustivel[]>([]);
  const [contratos, setContratos] = useState<{id: number, identificador: string}[]>([]);
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

      // Garantir que os dados retornados estejam no formato esperado
      const validData: AbastecimentoItem[] = (data || []).map(item => ({
        ...item,
        quantidade: item.quantidade || 0 // Adicionar quantidade se não existir
      }));
      
      setAbastecimentos(validData);
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

  // Buscar contratos para associação
  const fetchContratos = async () => {
    try {
      const { data, error } = await supabase
        .from('Contratos')
        .select('id, identificador');
      
      if (error) throw error;
      setContratos(data || []);
    } catch (error) {
      console.error('Erro ao buscar contratos:', error);
    }
  };

  useEffect(() => {
    fetchAbastecimentos();
    fetchTiposCombustivel();
    fetchContratos();
  }, []);

  const getNomeContrato = (contratoId: string | undefined) => {
    if (!contratoId) return 'N/A';
    const contrato = contratos.find(c => c.id.toString() === contratoId);
    return contrato ? `#${contrato.id} - ${contrato.identificador}` : `Contrato #${contratoId}`;
  };

  const handleSaveAbastecimento = async (formData: AbastecimentoFormData) => {
    try {
      const novoAbastecimento = {
        data_abastecimento: formData.data,
        placa_veiculo: formData.placa,
        motorista_solicitante: formData.motorista,
        tipo_combustivel: formData.tipoCombustivel,
        quantidade: formData.quantidade,
        valor_abastecimento: formData.valor,
        quilometragem: formData.quilometragem,
        posto: formData.posto,
        responsavel_autorizacao: formData.responsavel,
        itens_abastecidos: formData.itens,
        valor_total: formData.valor, // Valor total
        contrato_id: formData.contrato_id || null,
        contabilizado: formData.contabilizado || false,
        conta_debito: formData.conta_debito || null,
        conta_credito: formData.conta_credito || null
      };

      // Se contabilizado, cria o lançamento contábil
      if (formData.contabilizado && formData.conta_debito && formData.conta_credito) {
        const lancamentoContabil = {
          data_lancamento: formData.data,
          data_competencia: formData.data,
          conta_debito: formData.conta_debito,
          conta_credito: formData.conta_credito,
          valor: formData.valor,
          historico: `Abastecimento - Veículo ${formData.placa} - Posto ${formData.posto}`,
          status: 'ativo'
        };
        
        const { error: lancamentoError } = await supabase
          .from('Lancamentos_Contabeis')
          .insert([lancamentoContabil]);
          
        if (lancamentoError) {
          console.error('Erro ao criar lançamento contábil:', lancamentoError);
          toast.error('Erro ao contabilizar abastecimento.');
        } else {
          toast.success('Lançamento contábil registrado com sucesso!');
        }
      }

      const { error } = await supabase
        .from('Abastecimentos')
        .insert(novoAbastecimento);

      if (error) throw error;
      
      setNovoAbastecimentoOpen(false);
      fetchAbastecimentos();
      toast.success('Abastecimento registrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar abastecimento:', error);
      toast.error('Erro ao registrar abastecimento.');
    }
  };

  const handleTipoCombustivelAdded = (tipoCombustivel: TipoCombustivel) => {
    setNovoCombustivelOpen(false);
    setTiposCombustivel([...tiposCombustivel, tipoCombustivel]);
    toast.success('Tipo de combustível cadastrado com sucesso!');
  };

  // Função para calcular consumo médio
  const calcularConsumoMedio = (abastecimento: AbastecimentoItem) => {
    if (!abastecimento.quilometragem || !abastecimento.quantidade) return 'N/A';
    const consumo = abastecimento.quilometragem / abastecimento.quantidade;
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
              <TipoCombustivelForm onTipoCombustivelAdded={handleTipoCombustivelAdded} />
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
                onSave={handleSaveAbastecimento}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contabilizado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Médio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : abastecimentos.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-4 text-center">Nenhum abastecimento registrado</td>
                    </tr>
                  ) : (
                    abastecimentos.map((abastecimento, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{formatarData(abastecimento.data_abastecimento)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.placa_veiculo}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.tipo_combustivel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.quilometragem}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatarValorMonetario(abastecimento.valor_total || 0)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.posto}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{abastecimento.motorista_solicitante}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{getNomeContrato(abastecimento.contrato_id)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {abastecimento.contabilizado ? (
                            <Badge className="bg-green-500">Sim</Badge>
                          ) : (
                            <Badge variant="outline">Não</Badge>
                          )}
                        </td>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contrato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo Médio</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">Carregando...</td>
                    </tr>
                  ) : abastecimentos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 text-center">Nenhum abastecimento recente</td>
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
                          <td className="px-6 py-4 whitespace-nowrap">{formatarData(abastecimento.data_abastecimento)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.placa_veiculo}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.tipo_combustivel}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{abastecimento.quilometragem}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{formatarValorMonetario(abastecimento.valor_total || 0)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{getNomeContrato(abastecimento.contrato_id)}</td>
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
              <h2 className="text-xl font-semibold mb-4">Gastos por Contrato</h2>
              <p className="text-sm text-gray-500 mb-4">Total de combustível gasto por contrato</p>
              
              {loading ? (
                <p className="text-center py-4">Carregando...</p>
              ) : abastecimentos.length === 0 ? (
                <p className="text-center py-4">Sem dados disponíveis</p>
              ) : (
                <div className="space-y-4">
                  {/* Aqui poderia ter um gráfico mostrando os gastos por contrato */}
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
