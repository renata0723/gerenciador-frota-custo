
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import { FileText, Download, Filter, Calendar, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DashboardCard from '@/components/dashboard/DashboardCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const RelatoriosVeiculos = () => {
  const [periodo, setPeriodo] = useState('mensal');
  
  // Mock data para o relatório
  const relatorioMensal = [
    { placa: 'ABC-1234', km: 5800, combustivel: 2600, manutencao: 1800 },
    { placa: 'DEF-5678', km: 4200, combustivel: 1900, manutencao: 3200 },
    { placa: 'GHI-9012', km: 6500, combustivel: 2900, manutencao: 1500 },
    { placa: 'JKL-3456', km: 3800, combustivel: 1700, manutencao: 900 },
    { placa: 'MNO-7890', km: 5200, combustivel: 2300, manutencao: 1200 },
  ];
  
  // Dados para o gráfico de despesas por tipo de veículo
  const despesasPorTipoVeiculo = [
    { tipo: 'Utilitário', despesa: 8500 },
    { tipo: 'VUC', despesa: 12800 },
    { tipo: 'Toco', despesa: 15400 },
    { tipo: 'Truck', despesa: 18900 },
    { tipo: 'Carreta', despesa: 24600 },
  ];
  
  // Dados para o gráfico de distribuição de manutenções
  const distribuicaoManutencoes = [
    { name: 'Preventiva', value: 45 },
    { name: 'Corretiva', value: 30 },
    { name: 'Pneus', value: 15 },
    { name: 'Outros', value: 10 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PageLayout>
      <PageHeader 
        title="Relatórios de Veículos" 
        description="Análise de desempenho e custos da frota"
        icon={<FileText className="h-8 w-8 text-sistema-primary" />}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Relatórios de Veículos' }
        ]}
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center">
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
            <Button variant="outline" className="flex items-center">
              <Download size={16} className="mr-2" />
              Exportar
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
          <span className="text-sm font-medium">Data:</span>
          <Input
            type="month"
            defaultValue="2023-04"
            className="w-40"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Despesas por Tipo de Veículo">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={despesasPorTipoVeiculo}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tipo" />
                <YAxis 
                  tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
                />
                <Tooltip 
                  formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Despesa']}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="despesa" name="Despesa Mensal" fill="#0088FE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
        
        <DashboardCard title="Distribuição de Manutenções">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoManutencoes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {distribuicaoManutencoes.map((entry, index) => (
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total (R$)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Custo por KM</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {relatorioMensal.map((veiculo, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-sistema-primary">{veiculo.placa}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{veiculo.km.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {veiculo.combustivel.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {veiculo.manutencao.toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">R$ {(veiculo.combustivel + veiculo.manutencao).toLocaleString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    R$ {((veiculo.combustivel + veiculo.manutencao) / veiculo.km).toFixed(2)}
                    <span className={`ml-2 text-xs ${
                      ((veiculo.combustivel + veiculo.manutencao) / veiculo.km) < 0.8 
                      ? 'text-green-500' 
                      : ((veiculo.combustivel + veiculo.manutencao) / veiculo.km) > 1.2
                      ? 'text-red-500'
                      : 'text-yellow-500'
                    }`}>
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      {((veiculo.combustivel + veiculo.manutencao) / veiculo.km) < 0.8 
                        ? 'Baixo' 
                        : ((veiculo.combustivel + veiculo.manutencao) / veiculo.km) > 1.2
                        ? 'Alto'
                        : 'Médio'
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </PageLayout>
  );
};

export default RelatoriosVeiculos;
