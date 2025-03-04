
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import PageHeader from '@/components/ui/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calculator, FileSpreadsheet, Download, Percent, RefreshCw, ArrowLeft, Plus } from 'lucide-react';

import { 
  buscarCTEsPorPeriodo, 
  calcularTributacaoLucroReal, 
  salvarApuracaoImpostos,
  buscarApuracoesImpostos,
  buscarCreditosTributarios
} from '@/services/impostoService';
import { ApuracaoImpostos, CreditoTributario } from '@/types/contabilidade';
import { formatCurrency } from '@/utils/constants';

const ApuracaoImpostosPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apuracoes, setApuracoes] = useState<ApuracaoImpostos[]>([]);
  const [creditos, setCreditos] = useState<CreditoTributario[]>([]);
  const [activeTab, setActiveTab] = useState('listar');
  
  // Estado para nova apuração
  const [periodoInicio, setPeriodoInicio] = useState<string>(
    format(startOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [periodoFim, setPeriodoFim] = useState<string>(
    format(endOfMonth(new Date()), 'yyyy-MM-dd')
  );
  const [credito, setCredito] = useState<number>(0);
  const [periodoSelecionado, setPeriodoSelecionado] = useState('mensal');

  // Resultado da apuração
  const [resultado, setResultado] = useState<any>(null);
  
  useEffect(() => {
    carregarDados();
  }, []);
  
  const carregarDados = async () => {
    setLoading(true);
    try {
      const [apuracoesData, creditosData] = await Promise.all([
        buscarApuracoesImpostos(),
        buscarCreditosTributarios()
      ]);
      
      setApuracoes(apuracoesData);
      setCreditos(creditosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const ajustarPeriodo = (tipo: string) => {
    const hoje = new Date();
    let inicio, fim;
    
    if (tipo === 'mensal') {
      inicio = startOfMonth(hoje);
      fim = endOfMonth(hoje);
    } else if (tipo === 'trimestral') {
      const mesAtual = hoje.getMonth();
      const trimestreAtual = Math.floor(mesAtual / 3);
      inicio = new Date(hoje.getFullYear(), trimestreAtual * 3, 1);
      fim = endOfMonth(new Date(hoje.getFullYear(), trimestreAtual * 3 + 2, 1));
    } else if (tipo === 'anual') {
      inicio = new Date(hoje.getFullYear(), 0, 1);
      fim = new Date(hoje.getFullYear(), 11, 31);
    }
    
    setPeriodoInicio(format(inicio, 'yyyy-MM-dd'));
    setPeriodoFim(format(fim, 'yyyy-MM-dd'));
    setPeriodoSelecionado(tipo);
  };
  
  const realizarApuracao = async () => {
    setLoading(true);
    setResultado(null);
    
    try {
      // Buscar os CTEs emitidos no período
      const ctes = await buscarCTEsPorPeriodo(periodoInicio, periodoFim);
      
      // Calcular receita total dos CTEs
      const receitaTotal = ctes.reduce((soma, cte) => soma + (cte.valor_frete || 0), 0);
      
      // Buscar apuração do mês anterior para verificar prejuízo acumulado
      const mesAnteriorInicio = format(addMonths(parseISO(periodoInicio), -1), 'yyyy-MM-01');
      const mesAnteriorFim = format(endOfMonth(addMonths(parseISO(periodoInicio), -1)), 'yyyy-MM-dd');
      
      const apuracoesAnteriores = await buscarApuracoesImpostos();
      const mesAnterior = apuracoesAnteriores.find(
        ap => ap.periodo_inicio === mesAnteriorInicio && ap.periodo_fim === mesAnteriorFim
      ) || null;
      
      // Calcular impostos
      const resultadoCalculo = calcularTributacaoLucroReal(receitaTotal, credito, mesAnterior);
      
      // Montar o resultado para exibição
      const resultado = {
        periodo: {
          inicio: periodoInicio,
          fim: periodoFim
        },
        receita: {
          bruta: receitaTotal,
          quantidade_ctes: ctes.length
        },
        creditos: {
          pis_cofins: credito
        },
        calculo: resultadoCalculo
      };
      
      setResultado(resultado);
    } catch (error) {
      console.error('Erro ao realizar apuração:', error);
      toast.error('Erro ao realizar apuração. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const salvarApuracao = async () => {
    if (!resultado) return;
    
    try {
      setLoading(true);
      
      const apuracao: Partial<ApuracaoImpostos> = {
        periodo_inicio: resultado.periodo.inicio,
        periodo_fim: resultado.periodo.fim,
        receita_bruta: resultado.receita.bruta,
        base_calculo_pis_cofins: resultado.calculo.baseCalculoPisCofins,
        creditos_pis_cofins: credito,
        base_calculo_irpj: resultado.calculo.baseCalculoIrpj,
        base_calculo_csll: resultado.calculo.baseCalculoCsll,
        valor_pis: resultado.calculo.valorPis,
        valor_cofins: resultado.calculo.valorCofins,
        valor_irpj: resultado.calculo.valorIrpj,
        valor_csll: resultado.calculo.valorCsll,
        compensacao_prejuizo: resultado.calculo.compensacaoPrejuizo || 0,
        aliquota_efetiva: resultado.calculo.aliquotaEfetiva,
        status: 'ativo',
        observacoes: `Apuração de ${periodoSelecionado} com ${resultado.receita.quantidade_ctes} CTEs.`
      };
      
      const novaApuracao = await salvarApuracaoImpostos(apuracao);
      
      if (novaApuracao) {
        toast.success('Apuração de impostos salva com sucesso.');
        setApuracoes(prev => [novaApuracao, ...prev]);
        setActiveTab('listar');
        setResultado(null);
      } else {
        toast.error('Erro ao salvar apuração. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao salvar apuração:', error);
      toast.error('Erro ao salvar apuração. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy');
    } catch (error) {
      return dataString;
    }
  };
  
  const obterClasseCor = (valor: number) => {
    return valor < 0 ? 'text-red-600' : 'text-green-600';
  };

  const obterNomePeriodo = (inicio: string, fim: string) => {
    try {
      const dataInicio = parseISO(inicio);
      const dataFim = parseISO(fim);
      
      // Verificar se é mensal
      if (
        dataInicio.getMonth() === dataFim.getMonth() &&
        dataInicio.getFullYear() === dataFim.getFullYear()
      ) {
        return format(dataInicio, 'MMMM/yyyy');
      }
      
      // Verificar se é trimestral
      const diferencaMeses = (dataFim.getMonth() - dataInicio.getMonth()) + 
        (dataFim.getFullYear() - dataInicio.getFullYear()) * 12;
      
      if (diferencaMeses === 2) {
        const trimestre = Math.floor(dataInicio.getMonth() / 3) + 1;
        return `${trimestre}º Trimestre/${dataInicio.getFullYear()}`;
      }
      
      // Se for anual ou outro período
      return `${formatarData(inicio)} a ${formatarData(fim)}`;
    } catch (error) {
      return `${inicio} a ${fim}`;
    }
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Apuração de Impostos - Lucro Real" 
        description="Cálculo e controle de tributos para o regime de Lucro Real"
        icon={<Calculator className="h-6 w-6" />}
        actions={
          <Button variant="ghost" onClick={() => navigate('/contabilidade')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
        }
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="listar">Apurações Realizadas</TabsTrigger>
          <TabsTrigger value="novo">Nova Apuração</TabsTrigger>
          <TabsTrigger value="creditos">Créditos Tributários</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listar">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando apurações...</p>
            ) : apuracoes.length === 0 ? (
              <div className="text-center py-8">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhuma apuração registrada</h3>
                <p className="mt-1 text-gray-500">Clique em "Nova Apuração" para adicionar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead>Receita Bruta</TableHead>
                      <TableHead>PIS</TableHead>
                      <TableHead>COFINS</TableHead>
                      <TableHead>IRPJ</TableHead>
                      <TableHead>CSLL</TableHead>
                      <TableHead className="text-right">Alíquota Efetiva</TableHead>
                      <TableHead className="text-right">Total Impostos</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apuracoes.map((apuracao) => {
                      const totalImpostos = 
                        (apuracao.valor_pis || 0) + 
                        (apuracao.valor_cofins || 0) + 
                        (apuracao.valor_irpj || 0) + 
                        (apuracao.valor_csll || 0);
                      
                      return (
                        <TableRow key={apuracao.id}>
                          <TableCell className="font-medium">
                            {obterNomePeriodo(apuracao.periodo_inicio, apuracao.periodo_fim)}
                          </TableCell>
                          <TableCell>{formatCurrency(apuracao.receita_bruta)}</TableCell>
                          <TableCell>{formatCurrency(apuracao.valor_pis || 0)}</TableCell>
                          <TableCell>{formatCurrency(apuracao.valor_cofins || 0)}</TableCell>
                          <TableCell>{formatCurrency(apuracao.valor_irpj || 0)}</TableCell>
                          <TableCell>{formatCurrency(apuracao.valor_csll || 0)}</TableCell>
                          <TableCell className="text-right">
                            {((apuracao.aliquota_efetiva || 0) * 100).toFixed(2)}%
                          </TableCell>
                          <TableCell className={`text-right font-medium ${obterClasseCor(totalImpostos)}`}>
                            {formatCurrency(totalImpostos)}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apuracao.status === 'fechado' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {apuracao.status === 'fechado' ? 'Fechado' : 'Ativo'}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="novo">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <h3 className="text-lg font-semibold">Período de Apuração</h3>
                
                <div className="flex space-x-4">
                  <Button 
                    type="button" 
                    variant={periodoSelecionado === 'mensal' ? 'default' : 'outline'}
                    onClick={() => ajustarPeriodo('mensal')}
                  >
                    Mensal
                  </Button>
                  <Button 
                    type="button" 
                    variant={periodoSelecionado === 'trimestral' ? 'default' : 'outline'}
                    onClick={() => ajustarPeriodo('trimestral')}
                  >
                    Trimestral
                  </Button>
                  <Button 
                    type="button" 
                    variant={periodoSelecionado === 'anual' ? 'default' : 'outline'}
                    onClick={() => ajustarPeriodo('anual')}
                  >
                    Anual
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="periodo_inicio">Data Inicial</Label>
                    <Input
                      id="periodo_inicio"
                      type="date"
                      value={periodoInicio}
                      onChange={(e) => setPeriodoInicio(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="periodo_fim">Data Final</Label>
                    <Input
                      id="periodo_fim"
                      type="date"
                      value={periodoFim}
                      onChange={(e) => setPeriodoFim(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Créditos Tributários</h3>
                
                <div>
                  <Label htmlFor="credito">Créditos de PIS/COFINS (R$)</Label>
                  <Input
                    id="credito"
                    type="number"
                    step="0.01"
                    min="0"
                    value={credito}
                    onChange={(e) => setCredito(parseFloat(e.target.value) || 0)}
                    placeholder="Valor dos créditos a utilizar"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Valores de créditos de PIS/COFINS apurados em períodos anteriores
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab('listar')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="button" 
                  onClick={realizarApuracao}
                  disabled={loading}
                >
                  <Calculator className="mr-2 h-4 w-4" />
                  {loading ? 'Processando...' : 'Calcular Impostos'}
                </Button>
              </div>
              
              {resultado && (
                <div className="mt-6 space-y-6 border-t pt-6">
                  <h3 className="text-xl font-semibold text-center">Resultado da Apuração</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-600 mb-2">Período</h4>
                      <p className="text-sm">
                        {formatarData(resultado.periodo.inicio)} a {formatarData(resultado.periodo.fim)}
                      </p>
                      <p className="text-sm mt-2">
                        <strong>CTEs considerados:</strong> {resultado.receita.quantidade_ctes}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-600 mb-2">Receita Bruta</h4>
                      <p className="text-xl font-semibold">{formatCurrency(resultado.receita.bruta)}</p>
                      {resultado.calculo.compensacaoPrejuizo > 0 && (
                        <p className="text-sm mt-2 text-amber-600">
                          <strong>Compensação de prejuízo:</strong> {formatCurrency(resultado.calculo.compensacaoPrejuizo)}
                        </p>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-600 mb-2">Alíquota Efetiva</h4>
                      <p className="text-xl font-semibold">
                        {(resultado.calculo.aliquotaEfetiva * 100).toFixed(2)}%
                      </p>
                      <p className="text-sm mt-2">
                        <strong>Total de impostos:</strong> {formatCurrency(resultado.calculo.totalImpostos)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-3 font-medium">Apuração PIS/COFINS</div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span>Base de Cálculo:</span>
                          <span>{formatCurrency(resultado.calculo.baseCalculoPisCofins)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Créditos Utilizados:</span>
                          <span>{formatCurrency(credito)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PIS (1,65%):</span>
                          <span>{formatCurrency(resultado.calculo.valorPis)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>COFINS (7,6%):</span>
                          <span>{formatCurrency(resultado.calculo.valorCofins)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Total PIS/COFINS:</span>
                          <span>{formatCurrency(resultado.calculo.valorPis + resultado.calculo.valorCofins)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 px-4 py-3 font-medium">Apuração IRPJ/CSLL</div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <span>Base de Cálculo IRPJ (8%):</span>
                          <span>{formatCurrency(resultado.calculo.baseCalculoIrpj)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Base de Cálculo CSLL (12%):</span>
                          <span>{formatCurrency(resultado.calculo.baseCalculoCsll)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IRPJ:</span>
                          <span>{formatCurrency(resultado.calculo.valorIrpj)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>CSLL (9%):</span>
                          <span>{formatCurrency(resultado.calculo.valorCsll)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>Total IRPJ/CSLL:</span>
                          <span>{formatCurrency(resultado.calculo.valorIrpj + resultado.calculo.valorCsll)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setResultado(null)}
                      disabled={loading}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Recalcular
                    </Button>
                    <Button 
                      type="button" 
                      onClick={salvarApuracao}
                      disabled={loading}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Salvar Apuração
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="creditos">
          <Card className="p-6">
            {loading ? (
              <p className="text-center py-4">Carregando créditos tributários...</p>
            ) : creditos.length === 0 ? (
              <div className="text-center py-8">
                <Percent className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nenhum crédito tributário registrado</h3>
                <p className="mt-1 text-gray-500">Os créditos tributários ajudam a reduzir os impostos devidos.</p>
                
                <Button className="mt-4" onClick={() => navigate('/contabilidade/creditos-tributarios')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Crédito Tributário
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Créditos Tributários Disponíveis</h3>
                  <Button onClick={() => navigate('/contabilidade/creditos-tributarios')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Crédito
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Valor</TableHead>
                        <TableHead>Data Aquisição</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditos.map((credito) => (
                        <TableRow key={credito.id}>
                          <TableCell className="font-medium">
                            {credito.tipo_credito.toUpperCase()}
                          </TableCell>
                          <TableCell>{credito.descricao}</TableCell>
                          <TableCell>{formatCurrency(credito.valor)}</TableCell>
                          <TableCell>{formatarData(credito.data_aquisicao)}</TableCell>
                          <TableCell>{credito.periodo_apuracao}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              credito.status === 'disponivel' 
                                ? 'bg-green-100 text-green-800' 
                                : credito.status === 'utilizado'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {credito.status === 'disponivel' 
                                ? 'Disponível' 
                                : credito.status === 'utilizado'
                                ? 'Utilizado'
                                : 'Expirado'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default ApuracaoImpostosPage;
