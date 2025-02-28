
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Truck, TrendingUp, DollarSign, BadgeDollarSign, Gauge, ArrowUpCircle, ArrowDownCircle, Fuel, WrenchIcon, Receipt, FileText, X } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import DashboardCard from '../components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';

const TVDashboard = () => {
  const navigate = useNavigate();
  
  // Ativa o modo de tela cheia ao carregar a página
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error('Erro ao entrar em tela cheia:', err);
      }
    };
    
    enterFullscreen();
    
    return () => {
      // Sai do modo de tela cheia ao sair da página
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen();
      }
    };
  }, []);

  // Mock data
  const totalExpenses = "R$ 178.450,00";
  const totalRevenue = "R$ 342.780,00";
  const fuelExpenses = "R$ 80.302,50";
  const maintenanceExpenses = "R$ 53.535,00";
  const receivedInvoices = "124";
  const issuedInvoices = "113";

  // Mock data para veículos com maior consumo
  const vehicleRanking = [
    { plate: "ABC-1234", expense: 15400, type: "Combustível" },
    { plate: "DEF-5678", expense: 12800, type: "Manutenção" },
    { plate: "GHI-9012", expense: 10500, type: "Combustível" },
    { plate: "JKL-3456", expense: 9200, type: "Manutenção" },
    { plate: "MNO-7890", expense: 8300, type: "Combustível" },
    { plate: "PQR-1234", expense: 7600, type: "Manutenção" },
  ];

  // Mock data para distribuição de despesas
  const expenseDistributionData = [
    { name: 'Combustível', value: 45 },
    { name: 'Manutenção', value: 30 },
    { name: 'Motoristas', value: 15 },
    { name: 'Outros', value: 10 },
  ];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 relative">
      {/* Botão para voltar ao dashboard normal */}
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-4 right-4 z-50 bg-white/80 hover:bg-white"
        onClick={() => {
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
          }
          navigate('/');
        }}
      >
        <X size={18} className="mr-1" /> Sair da Projeção
      </Button>

      {/* Logo da empresa e título */}
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0 mr-4">
          <img 
            src="/lovable-uploads/cda21d11-e6d7-4886-bb6c-b43a15f1cc81.png" 
            alt="Logo da empresa" 
            className="h-16 w-auto"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Painel de Monitoramento</h1>
          <p className="text-gray-600">Visão geral para projeção em tela</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Despesas Totais"
          value={totalExpenses}
          icon={<DollarSign className="text-sistema-primary" size={24} />}
          className="border-red-500/20 bg-white shadow-lg"
        />
        <StatCard
          title="Receita Total"
          value={totalRevenue}
          icon={<BadgeDollarSign className="text-sistema-primary" size={24} />}
          className="border-green-500/20 bg-white shadow-lg"
        />
        <StatCard
          title="Despesas com Combustível"
          value={fuelExpenses}
          icon={<Fuel className="text-sistema-primary" size={24} />}
          className="border-yellow-500/20 bg-white shadow-lg"
        />
        <StatCard
          title="Despesas com Manutenção"
          value={maintenanceExpenses}
          icon={<WrenchIcon className="text-sistema-primary" size={24} />}
          className="border-blue-500/20 bg-white shadow-lg"
        />
        <StatCard
          title="Notas Recebidas"
          value={receivedInvoices}
          icon={<Receipt className="text-sistema-primary" size={24} />}
          className="border-purple-500/20 bg-white shadow-lg"
        />
        <StatCard
          title="Notas que Saíram"
          value={issuedInvoices}
          icon={<FileText className="text-sistema-primary" size={24} />}
          className="border-cyan-500/20 bg-white shadow-lg"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Ranking de Veículos por Despesa" className="bg-white shadow-lg">
          <div className="space-y-3">
            {vehicleRanking.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    vehicle.type === 'Combustível' 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.plate}</p>
                    <p className="text-xs text-gray-500">{vehicle.type}</p>
                  </div>
                </div>
                <span className="font-medium">
                  R$ {vehicle.expense.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Distribuição de Despesas" className="bg-white shadow-lg">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseDistributionData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Percentual']}
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '8px 12px',
                  }}
                />
                <Legend 
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ paddingBottom: '10px' }}
                />
                <Bar 
                  dataKey="value" 
                  name="Percentual" 
                  fill="#0088FE"
                  radius={[4, 4, 0, 0]}
                >
                  {expenseDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default TVDashboard;
