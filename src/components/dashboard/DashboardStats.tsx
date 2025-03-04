
import React from 'react';
import StatCard from './StatCard';

interface StatItemBasic {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: number;
  descriptor: string;
}

interface StatItemWithTrend extends StatItemBasic {
  trendDown?: boolean;
}

type StatItem = StatItemBasic | StatItemWithTrend;

interface DashboardStatsProps {
  loading: boolean;
  stats: StatItem[];
}

export default function DashboardStats({ loading, stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          descriptor={stat.descriptor}
          loading={loading}
          trendDown={'trendDown' in stat ? stat.trendDown : false}
        />
      ))}
    </div>
  );
}
