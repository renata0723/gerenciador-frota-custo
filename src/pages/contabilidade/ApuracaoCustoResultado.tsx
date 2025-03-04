
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Calculator, Download, PieChart } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/utils/formatters';
import { supabase } from '@/integrations/supabase/client';
import { ApuracaoCustoResultado as ApuracaoCustoResultadoType } from '@/types/contabilidade';

const ApuracaoCustoResultado = () => {
  const navigate = useNavigate();
  const [registros, setRegistros] = useState<ApuracaoCustoResultadoType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para nova apuração
  const [novaApuracao, setNovaApuracao] = useState<ApuracaoCustoResultadoType>({
    periodo_inicio: format(new Date(), 'yyyy-MM-dd'),
    periodo_fim: format(new Date(), 'yyyy-MM-dd'),
    receita_fretes: 0,
    custo_combustivel: 0,
    custo_manutencao: 0,
    custo_pneus: 0,
    custo_salarios: 0,
    despesas_administrativas: 0,
    despesas_financeiras: 0,
    outros_custos: 0,
    km_rodados: 0,
    status: 'aberto'
  });
  
  useEffect(() => {
    const carregarApuracoes = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('Apuracao_Custo_Resultado')
          .select('*')
          .order('periodo_fim', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setRegistros(data || []);
      } catch (error) {
        console.error('Erro ao carregar apurações:', error);
        toast.error('Erro ao carregar dados de apuração de custos.');
      } finally {
        setLoading(false);
      }
    };
    
    carregarApuracoes();
  }, []);
  
  useEffect(() => {
    // Calcula automaticamente resultados quando valores mudam
    const custoTotal = novaApuracao.custo_combustivel +
                      novaApuracao.custo_manutencao +
                      novaApuracao.custo_pneus +
                      novaApuracao.custo_salarios +
                      novaApuracao.outros_custos;
                      
    const despesasTotal = novaApuracao.despesas_administrativas +
                         novaApuracao.despesas_financeiras;
    
    const resultadoBruto = novaApuracao.receita_fretes - custoTotal;
    const resultadoLiquido = resultadoBruto - despesasTotal;
    
    // Calcula margem de lucro (resultado líquido / receita)
    const margemLucro = novaApuracao.receita_fretes > 0 
      ? (resultadoLiquido / novaApuracao.receita_fretes) * 100 
      : 0;
      
    // Calcula custo por km
    const custoKm = novaApuracao.km_rodados > 0 
      ? custoTotal / novaApuracao.km_rodados 
      : 0;
    
    setNovaApuracao(prev => ({
      ...prev,
      resultado_bruto: resultadoBruto,
      resultado_liquido: resultadoLiquido,
      margem_lucro: margemLucro,
      custo_km: custoKm
    }));
  }, [
    novaApuracao.receita_fretes, 
    novaApuracao.custo_combustivel,
    novaApuracao.custo_manutencao,
    novaApuracao.custo_pneus,
    novaApuracao.custo_salarios,
    novaApuracao.despesas_administrativas,
    novaApuracao.despesas_financeiras,
    novaApuracao.outros_custos,
    novaApuracao.km_rodados
  ]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setNovaApuracao(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!novaApuracao.periodo_inicio || !novaApuracao.periodo_fim) {
      toast.error('Por favor, preencha os períodos de início e fim.');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('Apuracao_Custo_Resultado')
        .insert([{
          ...novaApuracao,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast.success('Apuração de custos registrada com sucesso.');
      
      // Atualiza a lista de apurações
      setRegistros(prev => [data[0], ...prev]);
      
      // Limpa o formulário
      setNovaApuracao({
        periodo_inicio: format(new Date(), 'yyyy-MM-dd'),
        periodo_fim: format(new Date(), 'yyyy-MM-dd'),
        receita_fretes: 0,
        custo_combustivel: 0,
        custo_manutencao: 0,
        custo_pneus: 0,
        custo_salarios: 0,
        despesas_administrativas: 0,
        despesas_financeiras: 0,
        outros_custos: 0,
        km_rodados: 0,
        status: 'aberto'
      });
    } catch (error) {
      console.error('Erro ao salvar apuração:', error);
      toast.error('Erro ao salvar dados. Tente novamente mais tarde.');
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dataString;
    }
  };
  
  const obterClasseResultado = (valor: number = 0) => {
    return valor < 0 ? 'text-red-600' : 'text-green-600';
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Apuração de Custos e Resultados" 
        description="Análise detalhada de custos, receitas e resultados operacionais"
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            Voltar
          </Button>
        }
      />
      
      <Tabs defaultValue="listar" className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="listar">Apurações</TabsTrigger>
          <TabsTrigger value="nova">Nova Apuração</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando apurações...</p>
            ) : registros.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma apuração registrada</h3>
                <p className="mt-1 text-gray-500">Clique em "Nova Apuração" para adicionar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Custos Operacionais</TableHead>
                      <TableHead>Despesas</TableHead>
                      <TableHead>Resultado</TableHead>
                      <TableHead>Margem</TableHead>
                      <TableHead>Custo/Km</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registros.map((registro) => (
                      <TableRow 
                        key={registro.id} 
                        className="cursor-pointer"
                        onClick={() => navigate(`/contabilidade/apuracao/${registro.id}`)}
                      >
                        <TableCell>
                          {formatarData(registro.periodo_inicio)} a {formatarData(registro.periodo_fim)}
                        </TableCell>
                        <TableCell>{formatCurrency(registro.receita_fretes)}</TableCell>
                        <TableCell>
                          {formatCurrency(
                            (registro.custo_combustivel || 0) + 
                            (registro.custo_manutencao || 0) + 
                            (registro.custo_pneus || 0) + 
                            (registro.custo_salarios || 0) + 
                            (registro.outros_custos || 0)
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(
                            (registro.despesas_administrativas || 0) + 
                            (registro.despesas_financeiras || 0)
                          )}
                        </TableCell>
                        <TableCell className={`font-medium ${obterClasseResultado(registro.resultado_liquido)}`}>
                          {formatCurrency(registro.resultado_liquido || 0)}
                        </TableCell>
                        <TableCell className={obterClasseResultado(registro.margem_lucro)}>
                          {registro.margem_lucro ? registro.margem_lucro.toFixed(2) : '0.00'}%
                        </TableCell>
                        <TableCell>
                          {registro.custo_km ? `R$ ${registro.custo_km.toFixed(2)}/km` : 'R$ 0.00/km'}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            registro.status === 'fechado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {registro.status === 'fechado' ? 'Fechado' : 'Aberto'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="nova">
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="periodo_inicio">Início do Período</Label>
                  <Input
                    id="periodo_inicio"
                    name="periodo_inicio"
                    type="date"
                    value={novaApuracao.periodo_inicio}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="periodo_fim">Fim do Período</Label>
                  <Input
                    id="periodo_fim"
                    name="periodo_fim"
                    type="date"
                    value={novaApuracao.periodo_fim}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Receitas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receita_fretes">Receita de Fretes (R$)</Label>
                    <Input
                      id="receita_fretes"
                      name="receita_fretes"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.receita_fretes}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="km_rodados">Quilometragem Rodada (Km)</Label>
                    <Input
                      id="km_rodados"
                      name="km_rodados"
                      type="number"
                      step="1"
                      min="0"
                      value={novaApuracao.km_rodados}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Custos Diretos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="custo_combustivel">Combustível (R$)</Label>
                    <Input
                      id="custo_combustivel"
                      name="custo_combustivel"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.custo_combustivel}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="custo_manutencao">Manutenção (R$)</Label>
                    <Input
                      id="custo_manutencao"
                      name="custo_manutencao"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.custo_manutencao}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="custo_pneus">Pneus (R$)</Label>
                    <Input
                      id="custo_pneus"
                      name="custo_pneus"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.custo_pneus}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="custo_salarios">Salários Motoristas (R$)</Label>
                    <Input
                      id="custo_salarios"
                      name="custo_salarios"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.custo_salarios}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="outros_custos">Outros Custos (R$)</Label>
                  <Input
                    id="outros_custos"
                    name="outros_custos"
                    type="number"
                    step="0.01"
                    min="0"
                    value={novaApuracao.outros_custos}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Despesas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="despesas_administrativas">Despesas Administrativas (R$)</Label>
                    <Input
                      id="despesas_administrativas"
                      name="despesas_administrativas"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.despesas_administrativas}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="despesas_financeiras">Despesas Financeiras (R$)</Label>
                    <Input
                      id="despesas_financeiras"
                      name="despesas_financeiras"
                      type="number"
                      step="0.01"
                      min="0"
                      value={novaApuracao.despesas_financeiras}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Resultados Calculados</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="resultado_bruto">Resultado Bruto (R$)</Label>
                    <Input
                      id="resultado_bruto"
                      name="resultado_bruto"
                      type="number"
                      step="0.01"
                      value={novaApuracao.resultado_bruto || 0}
                      className={obterClasseResultado(novaApuracao.resultado_bruto)}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="resultado_liquido">Resultado Líquido (R$)</Label>
                    <Input
                      id="resultado_liquido"
                      name="resultado_liquido"
                      type="number"
                      step="0.01"
                      value={novaApuracao.resultado_liquido || 0}
                      className={obterClasseResultado(novaApuracao.resultado_liquido)}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="margem_lucro">Margem de Lucro (%)</Label>
                    <Input
                      id="margem_lucro"
                      name="margem_lucro"
                      type="number"
                      step="0.01"
                      value={novaApuracao.margem_lucro ? novaApuracao.margem_lucro.toFixed(2) : '0.00'}
                      className={obterClasseResultado(novaApuracao.margem_lucro)}
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="custo_km">Custo por Km (R$)</Label>
                    <Input
                      id="custo_km"
                      name="custo_km"
                      type="number"
                      step="0.01"
                      value={novaApuracao.custo_km ? novaApuracao.custo_km.toFixed(2) : '0.00'}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="observacoes">Observações</Label>
                <Input
                  id="observacoes"
                  name="observacoes"
                  value={novaApuracao.observacoes || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="periodo_fechado"
                  checked={novaApuracao.status === 'fechado'}
                  onChange={() => 
                    setNovaApuracao(prev => ({
                      ...prev, 
                      status: prev.status === 'aberto' ? 'fechado' : 'aberto'
                    }))
                  }
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <Label htmlFor="periodo_fechado" className="text-sm">
                  Período Fechado (não poderá ser alterado posteriormente)
                </Label>
              </div>
              
              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Registrar Apuração
              </Button>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default ApuracaoCustoResultado;
