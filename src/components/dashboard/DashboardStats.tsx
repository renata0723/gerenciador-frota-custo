
import React from 'react';
import { Truck, FileText, Users, Clipboard } from 'lucide-react';
import StatCard from './StatCard';

interface StatItem {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: { value: number; type: 'increase' | 'decrease' | 'neutral' };
  subtitle: string;
}

const DashboardStats: React.FC = () => {
  // Dados simulados para o dashboard
  const stats: StatItem[] = [
    { 
      title: "Total de Veículos", 
      value: "48", 
      icon: <Truck className="text-sistema-primary" size={24} />,
      change: { value: 12, type: "increase" },
      subtitle: "vs. mês anterior"
    },
    { 
      title: "Notas Fiscais", 
      value: "237", 
      icon: <FileText className="text-sistema-primary" size={24} />,
      change: { value: 8, type: "increase" },
      subtitle: "vs. mês anterior"
    },
    { 
      title: "Motoristas", 
      value: "32", 
      icon: <Users className="text-sistema-primary" size={24} />,
      change: { value: 0, type: "neutral" },
      subtitle: "vs. mês anterior"
    },
    { 
      title: "Contratos Ativos", 
      value: "18", 
      icon: <Clipboard className="text-sistema-primary" size={24} />,
      change: { value: 5, type: "decrease" },
      subtitle: "vs. mês anterior"
    },
  ];

  return (
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
  );
};

export default DashboardStats;
