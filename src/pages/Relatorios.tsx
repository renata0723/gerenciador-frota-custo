
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardCard from '@/components/dashboard/DashboardCard';
import { logOperation } from '@/utils/logOperations';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  CreditCard,
  Truck,
  Users,
  DollarSign,
  Fuel,
  Wrench
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

const Relatorios = () => {
  const [periodo, setPeriodo] = useState('mensal');
  const [tipoRelatorio, setTipoRelatorio] = useState('veiculos');

  // Log da interação do usuário
  React.useEffect(() => {
    logOperation("Relatórios", `Visualização de relatórios - ${tipoRelatorio}`, "true");
  }, [tipoRelatorio]);

  // Dados para o relatório de veículos
  const dadosVeiculos = [
    { placa: 'ABC-1234', km: 5800, combustivel: 2600, manutencao: 1800, faturamento: 15000 },
    { placa: 'DEF-5678', km: 4200, combustivel: 1900, manutencao: 3200, faturamento: 12000 },
    { placa: 'GHI-9012', km: 6500, combustivel: 2900, manutencao: 1500, faturamento: 18000 },
    { placa: 'JKL-3456', km: 3800, combustivel: 1700, manutencao: 900, faturamento: 9000 },
    { placa: 'MNO-7890', km: 5200, combustivel: 2300, manutencao: 1200, faturamento: 14000 },
  ];

  // Dados para o gráfico de receitas vs despesas
  const dadosFinanceiros = [
    { mes: 'Jan', receitas: 45000, despesas: 32000 },
    { mes: 'Fev', receitas: 48000, despesas: 35000 },
    { mes: 'Mar', receitas: 52000, despesas: 36000 },
    { mes: 'Abr', receitas: 49000, despesas: 34000 },
    { mes: 'Mai', receitas: 53000, despesas: 37000 },
    { mes: 'Jun', receitas: 56000, despesas: 38000 },
    { mes: 'Jul', receitas: 54000, despesas: 37500 },
    { mes: 'Ago', receitas: 58000, despesas: 39000 },
    { mes: 'Set', receitas: 60000, despesas: 40000 },
    { mes: 'Out', receitas: 59000, despesas: 40500 },
    { mes: 'Nov', receitas: 62000, despesas: 41000 },
    { mes: 'Dez', receitas: 65000, despesas: 43000 },
  ];

  // Dados para o gráfico de distribuição de despesas
  const distribuicaoDespesas = [
    { name: 'Combustível', value: 45 },
    { name: 'Manutenção', value: 25 },
    { name: 'Salários', value: 20 },
    { name: 'Pedágios', value: 5 },
    { name: 'Outros', value: 5 },
  ];

  // Dados para o gráfico de contratos por mês
  const contratosData = [
    { mes: 'Jan', quantidade: 12 },
    { mes: 'Fev', quantidade: 15 },
    { mes: 'Mar', quantidade: 18 },
    { mes: 'Abr', quantidade: 14 },
    { mes: 'Mai', quantidade: 21 },
    { mes: 'Jun', quantidade: 19 },
    { mes: 'Jul', quantidade: 24 },
    { mes: 'Ago', quantidade: 22 },
    { mes: 'Set', quantidade: 20 },
    { mes: 'Out', quantidade: 23 },
    { mes: 'Nov', quantidade: 25 },
    { mes: 'Dez', quantidade: 28 },
  ];

  // Dados para o gráfico de tipos de manutenção
  const tiposManutencao = [
    { name: 'Preventiva', value: 45 },
    { name: 'Corretiva', value: 35 },
    { name: 'Pneus', value: 15 },
    { name: 'Outras', value: 5 },
  ];

  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleExportarRelatorio = () => {
    logOperation("Relatórios", `Exportação de relatório - ${tipoRelatorio}`, "true");
    alert("Funcionalidade de exportação em desenvolvimento");
  };

  // Função para calcular métricas financeiras
  const calcularMetricas = () => {
    const totalReceitas = dadosFinanceiros.reduce((acc, item) => acc + item.receitas, 0);
    const totalDespesas = dadosFinanceiros.reduce((acc, item) => acc + item.despesas, 0);
    const lucro = totalReceitas - totalDespesas;
    const margemLucro = (lucro / totalReceitas) * 100;

    return {
      totalReceitas,
      totalDespesas,
      lucro,
      margemLucro
    };
  };

  const metricas = calcularMetricas();

  return (
    <PageLayout>
      <PageHeader
        title="Relatórios"
        description="Análise detalhada de desempenho e custos operacionais"
        icon={<FileText className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Relatórios' }
        ]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center" onClick={handleExportarRelatorio}>
              <Download size={16} className="mr-2" />
              Exportar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
          </div>
        }
      />

      <div className="mb-6 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 bg-white dark:bg-sistema-dark p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <Calendar size={18} className="text-gray-500" />
          <span className="text-sm font-medium">Período:</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={periodo === 'mensal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo('mensal')}
            className={periodo === 'mensal' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
          >
            Mensal
          </Button>
          <Button
            variant={periodo === 'trimestral' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo('trimestral')}
            className={periodo === 'trimestral' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
          >
            Trimestral
          </Button>
          <Button
            variant={periodo === 'anual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriodo('anual')}
            className={periodo === 'anual' ? 'bg-sistema-primary hover:bg-sistema-primary/90' : ''}
          >
            Anual
          </Button>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <span className="text-sm font-medium">Mês/Ano:</span>
          <Input
            type="month"
            defaultValue="2023-04"
            className="w-40"
          />
        </div>
      </div>

      <Tabs defaultValue="veiculos" className="mb-6" onValueChange={setTipoRelatorio}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="veiculos" className="flex items-center">
            <Truck className="h-4 w-4 mr-2" />
            Veículos
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2" />
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="contratos" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Contratos
          </TabsTrigger>
          <TabsTrigger value="combustivel" className="flex items-center">
            <Fuel className="h-4 w-4 mr-2" />
            Combustível
          </TabsTrigger>
          <TabsTrigger value="manutencao" className="flex items-center">
            <Wrench className="h-4 w-4 mr-2" />
            Manutenção
          </TabsTrigger>
        </TabsList>

        {/* Aba de Veículos */}
        <TabsContent value="veiculos" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DashboardCard title="Custo por Veículo (R$)">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosVeiculos}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="placa" />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="combustivel" name="Combustível" fill="#0088FE" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="manutencao" name="Manutenção" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Faturamento por Veículo">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosVeiculos}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="placa" />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="faturamento" name="Faturamento" fill="#8884D8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>

          <DashboardCard
            title="Relatório Detalhado por Veículo"
            subtitle={`Período: ${periodo === 'mensal' ? 'Abril 2023' : periodo === 'trimestral' ? '2º Trimestre 2023' : 'Ano 2023'}`}
          >
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Placa</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">KM Rodados</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Combustível (R$)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manutenção (R$)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Faturamento (R$)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lucro (R$)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Margem (%)</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                  {dadosVeiculos.map((veiculo, index) => {
                    const custoTotal = veiculo.combustivel + veiculo.manutencao;
                    const lucro = veiculo.faturamento - custoTotal;
                    const margem = (lucro / veiculo.faturamento) * 100;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sistema-primary">{veiculo.placa}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{veiculo.km.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {veiculo.combustivel.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {veiculo.manutencao.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {veiculo.faturamento.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {lucro.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {margem.toFixed(2)}%
                          <span className={`ml-2 text-xs ${
                            margem > 30 
                            ? 'text-green-500' 
                            : margem < 15
                            ? 'text-red-500'
                            : 'text-yellow-500'
                          }`}>
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            {margem > 30 
                              ? 'Ótima' 
                              : margem < 15
                              ? 'Baixa'
                              : 'Média'
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DashboardCard>
        </TabsContent>

        {/* Aba Financeiro */}
        <TabsContent value="financeiro" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <DashboardCard title="Receitas Totais">
              <div className="flex flex-col items-center justify-center p-4">
                <DollarSign className="h-12 w-12 text-green-500 mb-2" />
                <div className="text-3xl font-bold">
                  R$ {metricas.totalReceitas.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-gray-500 mt-2">Anual</div>
              </div>
            </DashboardCard>

            <DashboardCard title="Despesas Totais">
              <div className="flex flex-col items-center justify-center p-4">
                <CreditCard className="h-12 w-12 text-red-500 mb-2" />
                <div className="text-3xl font-bold">
                  R$ {metricas.totalDespesas.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-gray-500 mt-2">Anual</div>
              </div>
            </DashboardCard>

            <DashboardCard title="Margem de Lucro">
              <div className="flex flex-col items-center justify-center p-4">
                <TrendingUp className="h-12 w-12 text-blue-500 mb-2" />
                <div className="text-3xl font-bold">
                  {metricas.margemLucro.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-500 mt-2">Anual</div>
              </div>
            </DashboardCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DashboardCard title="Receitas vs Despesas">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={dadosFinanceiros}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Valor']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#4ade80" fill="#4ade80" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#f87171" fill="#f87171" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Distribuição de Despesas">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distribuicaoDespesas}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {distribuicaoDespesas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        {/* Aba Contratos */}
        <TabsContent value="contratos" className="mt-4">
          <div className="grid grid-cols-1 gap-6 mb-6">
            <DashboardCard title="Contratos por Mês">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={contratosData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="quantidade" name="Quantidade de Contratos" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        {/* Aba Combustível */}
        <TabsContent value="combustivel" className="mt-4">
          <div className="grid grid-cols-1 gap-6 mb-6">
            <DashboardCard title="Consumo de Combustível por Mês">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosFinanceiros}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${(Number(value) / 2.5).toLocaleString('pt-BR')}`, 'Combustível']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Bar dataKey="despesas" name="Gasto com Combustível" fill="#0088FE" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>

        {/* Aba Manutenção */}
        <TabsContent value="manutencao" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <DashboardCard title="Tipos de Manutenção">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tiposManutencao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {tiposManutencao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>

            <DashboardCard title="Gastos com Manutenção por Mês">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dadosFinanceiros}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis 
                      tickFormatter={(value) => `R$ ${(value / 3000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R$ ${(Number(value) / 3).toLocaleString('pt-BR')}`, 'Manutenção']}
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="despesas" name="Gastos com Manutenção" stroke="#FF8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Relatorios;
