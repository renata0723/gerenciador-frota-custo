
import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Truck, TrendingUp, DollarSign, BadgeDollarSign, Gauge, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DashboardCard from '../components/dashboard/DashboardCard';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';

const TVDashboard = () => {
  // Mock data for expenses
  const totalExpenses = "R$ 178.450,00";
  const totalRevenue = "R$ 342.780,00";
  const profitMargin = "48%";
  const totalTrips = "243";

  // Mock data for vehicles with highest expenses
  const expensiveVehicles = [
    { id: 1, plate: "ABC-1234", expense: 15400, percentage: 12 },
    { id: 2, plate: "DEF-5678", expense: 12800, percentage: 10 },
    { id: 3, plate: "GHI-9012", expense: 10500, percentage: 8 },
    { id: 4, plate: "JKL-3456", expense: 9200, percentage: 7 },
  ];

  // Mock data for vehicles with highest revenue
  const profitableVehicles = [
    { id: 1, plate: "MNO-7890", revenue: 28500, percentage: 15 },
    { id: 2, plate: "PQR-1234", revenue: 25300, percentage: 13 },
    { id: 3, plate: "STU-5678", revenue: 21400, percentage: 11 },
    { id: 4, plate: "VWX-9012", revenue: 19800, percentage: 10 },
  ];

  // Mock data for performance by plates (km/L)
  const performanceData = [
    { plate: "ABC-1234", performance: 2.8 },
    { plate: "DEF-5678", performance: 3.2 },
    { plate: "GHI-9012", performance: 2.5 },
    { plate: "JKL-3456", performance: 2.9 },
    { plate: "MNO-7890", performance: 3.1 },
    { plate: "PQR-1234", performance: 2.7 },
  ];

  // Mock data for monthly expenses
  const monthlyExpensesData = [
    { name: 'Jan', fuel: 12000, maintenance: 5000, staff: 8000 },
    { name: 'Fev', fuel: 13500, maintenance: 4800, staff: 8000 },
    { name: 'Mar', fuel: 14200, maintenance: 6200, staff: 8200 },
    { name: 'Abr', fuel: 15800, maintenance: 4500, staff: 8400 },
    { name: 'Mai', fuel: 16300, maintenance: 5300, staff: 8600 },
    { name: 'Jun', fuel: 15200, maintenance: 7800, staff: 8800 },
  ];

  // Mock data for expense distribution
  const expenseDistributionData = [
    { name: 'Combustível', value: 45 },
    { name: 'Manutenção', value: 30 },
    { name: 'Motoristas', value: 15 },
    { name: 'Outros', value: 10 },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <PageLayout>
      <PageHeader 
        title="Painel de Desempenho" 
        description="Visualização em tempo real para monitoramento da frota"
        icon={<Gauge className="text-sistema-primary" size={28} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Despesas Totais"
          value={totalExpenses}
          icon={<DollarSign className="text-sistema-primary" size={24} />}
          change={{ value: 8, type: "increase" }}
          subtitle="vs. mês anterior"
        />
        <StatCard
          title="Receita Total"
          value={totalRevenue}
          icon={<BadgeDollarSign className="text-sistema-primary" size={24} />}
          change={{ value: 12, type: "increase" }}
          subtitle="vs. mês anterior"
        />
        <StatCard
          title="Margem de Lucro"
          value={profitMargin}
          icon={<TrendingUp className="text-sistema-primary" size={24} />}
          change={{ value: 3, type: "increase" }}
          subtitle="vs. mês anterior"
        />
        <StatCard
          title="Total de Viagens"
          value={totalTrips}
          icon={<Truck className="text-sistema-primary" size={24} />}
          change={{ value: 5, type: "increase" }}
          subtitle="vs. mês anterior"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Veículos com Maiores Gastos">
          <div className="space-y-4">
            {expensiveVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="text-red-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.plate}</p>
                    <p className="text-xs text-gray-500">
                      {vehicle.percentage}% das despesas totais
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  R$ {vehicle.expense.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Veículos com Maior Faturamento">
          <div className="space-y-4">
            {profitableVehicles.map((vehicle) => (
              <div key={vehicle.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mr-3">
                    <ArrowUpCircle className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.plate}</p>
                    <p className="text-xs text-gray-500">
                      {vehicle.percentage}% da receita total
                    </p>
                  </div>
                </div>
                <span className="font-semibold">
                  R$ {vehicle.revenue.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Desempenho por Placas (km/L)">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="plate" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} km/L`, 'Desempenho']} />
                <Legend />
                <Bar dataKey="performance" fill="#33C3F0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Distribuição de Despesas">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {expenseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Percentual']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Gastos Mensais Detalhados">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyExpensesData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']} />
              <Legend />
              <Line type="monotone" dataKey="fuel" stroke="#FF8042" name="Combustível" strokeWidth={2} />
              <Line type="monotone" dataKey="maintenance" stroke="#0088FE" name="Manutenção" strokeWidth={2} />
              <Line type="monotone" dataKey="staff" stroke="#00C49F" name="Pessoal" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>
    </PageLayout>
  );
};

export default TVDashboard;
