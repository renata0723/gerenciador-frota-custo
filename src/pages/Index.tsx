
import React from 'react';
import { Truck, FileText, Users, Clipboard, Fuel, Wrench, DollarSign, ArrowRight } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import DashboardCard from '../components/dashboard/DashboardCard';
import { Link } from 'react-router-dom';

const Index = () => {
  // Dados simulados para o dashboard
  const stats = [
    { 
      title: "Total de Veículos", 
      value: "48", 
      icon: <Truck className="text-sistema-primary" size={24} />,
      change: { value: 12, type: "increase" as const },
      subtitle: "vs. mês anterior"
    },
    { 
      title: "Notas Fiscais", 
      value: "237", 
      icon: <FileText className="text-sistema-primary" size={24} />,
      change: { value: 8, type: "increase" as const },
      subtitle: "vs. mês anterior"
    },
    { 
      title: "Motoristas", 
      value: "32", 
      icon: <Users className="text-sistema-primary" size={24} />,
      change: { value: 0, type: "neutral" as const },
      subtitle: "vs. mês anterior"
    },
    { 
      title: "Contratos Ativos", 
      value: "18", 
      icon: <Clipboard className="text-sistema-primary" size={24} />,
      change: { value: 5, type: "decrease" as const },
      subtitle: "vs. mês anterior"
    },
  ];

  // Dados simulados para tabelas
  const latestNotes = [
    { id: 'NF-12345', client: 'Empresa ABC Ltda', destination: 'São Paulo, SP', value: 'R$ 15.450,00' },
    { id: 'NF-12346', client: 'Distribuidora XYZ', destination: 'Rio de Janeiro, RJ', value: 'R$ 8.720,50' },
    { id: 'NF-12347', client: 'Indústria MNO', destination: 'Curitiba, PR', value: 'R$ 22.150,00' },
    { id: 'NF-12348', client: 'Comércio RST', destination: 'Belo Horizonte, MG', value: 'R$ 5.890,75' },
  ];

  const latestMaintenance = [
    { id: 'MAN-001', vehicle: 'ABC-1234', type: 'Preventiva', status: 'Concluída' },
    { id: 'MAN-002', vehicle: 'DEF-5678', type: 'Corretiva', status: 'Em andamento' },
    { id: 'MAN-003', vehicle: 'GHI-9012', type: 'Preventiva', status: 'Agendada' },
  ];

  const fuelConsumption = [
    { vehicle: 'ABC-1234', lastFuel: '250 L', avgConsumption: '2,8 km/L' },
    { vehicle: 'DEF-5678', lastFuel: '180 L', avgConsumption: '3,2 km/L' },
    { vehicle: 'GHI-9012', lastFuel: '220 L', avgConsumption: '2,5 km/L' },
  ];

  return (
    <PageLayout>
      <PageHeader 
        title="Dashboard" 
        description="Visão geral do sistema de gerenciamento de frota"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DashboardCard 
          title="Últimas Notas Fiscais" 
          action={
            <Link to="/notas" className="text-sistema-primary text-xs font-medium flex items-center hover:text-sistema-primary-dark transition-colors duration-200">
              Ver todas <ArrowRight size={14} className="ml-1" />
            </Link>
          }
        >
          <div className="table-container">
            <table className="table-default">
              <thead className="table-head">
                <tr>
                  <th className="table-header-cell">Nº Nota</th>
                  <th className="table-header-cell">Cliente</th>
                  <th className="table-header-cell">Destino</th>
                  <th className="table-header-cell">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {latestNotes.map((note) => (
                  <tr key={note.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="table-cell font-medium">{note.id}</td>
                    <td className="table-cell">{note.client}</td>
                    <td className="table-cell">{note.destination}</td>
                    <td className="table-cell">{note.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard 
          title="Últimas Manutenções" 
          action={
            <Link to="/manutencao" className="text-sistema-primary text-xs font-medium flex items-center hover:text-sistema-primary-dark transition-colors duration-200">
              Ver todas <ArrowRight size={14} className="ml-1" />
            </Link>
          }
        >
          <div className="table-container">
            <table className="table-default">
              <thead className="table-head">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Veículo</th>
                  <th className="table-header-cell">Tipo</th>
                  <th className="table-header-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {latestMaintenance.map((maintenance) => (
                  <tr key={maintenance.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="table-cell font-medium">{maintenance.id}</td>
                    <td className="table-cell">{maintenance.vehicle}</td>
                    <td className="table-cell">{maintenance.type}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        maintenance.status === 'Concluída' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : maintenance.status === 'Em andamento'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {maintenance.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Consumo de Combustível">
          <div className="space-y-4">
            {fuelConsumption.map((item, index) => (
              <div key={index} className="flex items-center p-3 border border-gray-100 dark:border-gray-800 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-sistema-primary/10 dark:bg-sistema-primary/20 flex items-center justify-center">
                  <Fuel className="text-sistema-primary" size={20} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.vehicle}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Média: {item.avgConsumption}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.lastFuel}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Último abast.</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Manutenções Por Tipo">
          <div className="h-48 flex items-center justify-center">
            <div className="flex space-x-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-8 border-sistema-primary flex items-center justify-center">
                  <p className="text-xl font-bold">65%</p>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Preventiva</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full border-8 border-gray-300 flex items-center justify-center">
                  <p className="text-xl font-bold">35%</p>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Corretiva</p>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Distribuição de Despesas">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Combustível</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">45%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-sistema-primary h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Manutenção</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">30%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-sistema-primary h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Motoristas</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">15%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-sistema-primary h-2 rounded-full" style={{ width: '15%' }}></div>
            </div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">Outros</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">10%</p>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-sistema-primary h-2 rounded-full" style={{ width: '10%' }}></div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </PageLayout>
  );
};

export default Index;
