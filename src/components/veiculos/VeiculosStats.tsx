
import React from 'react';
import { Truck, AlertTriangle, Building, Activity } from 'lucide-react';
import StatCard from '../dashboard/StatCard';

interface VeiculosStatsProps {
  veiculosData: any[];
}

const VeiculosStats: React.FC<VeiculosStatsProps> = ({ veiculosData }) => {
  // Calcular estatísticas
  const totalVeiculos = veiculosData.length;
  const frotaPropria = veiculosData.filter(v => v.frota === 'Própria').length;
  const frotaTerceirizada = veiculosData.filter(v => v.frota === 'Terceirizada').length;
  const emManutencao = veiculosData.filter(v => 
    v.status === 'Inativo' && 
    v.inativacao?.motivo?.includes('Manutenção')
  ).length;
  const veiculosAtivos = veiculosData.filter(v => v.status === 'Ativo').length;
  const percentualAtivos = Math.round((veiculosAtivos / totalVeiculos) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total de Veículos"
        value={totalVeiculos.toString()}
        icon={<Truck className="text-sistema-primary" size={24} />}
        subtitle={`${frotaPropria} próprios, ${frotaTerceirizada} terceirizados`}
      />

      <StatCard
        title="Veículos Ativos"
        value={veiculosAtivos.toString()}
        icon={<Activity className="text-sistema-primary" size={24} />}
        change={{ 
          value: percentualAtivos, 
          type: percentualAtivos > 70 ? 'increase' : percentualAtivos > 50 ? 'neutral' : 'decrease' 
        }}
        subtitle="do total da frota"
      />

      <StatCard
        title="Frota Própria"
        value={frotaPropria.toString()}
        icon={<Building className="text-sistema-primary" size={24} />}
        change={{ 
          value: Math.round((frotaPropria / totalVeiculos) * 100), 
          type: 'neutral' 
        }}
        subtitle="do total da frota"
      />

      <StatCard
        title="Em Manutenção"
        value={emManutencao.toString()}
        icon={<AlertTriangle className="text-sistema-primary" size={24} />}
        change={{ 
          value: Math.round((emManutencao / totalVeiculos) * 100), 
          type: emManutencao > 2 ? 'decrease' : 'neutral' 
        }}
        subtitle="do total da frota"
      />
    </div>
  );
};

export default VeiculosStats;
